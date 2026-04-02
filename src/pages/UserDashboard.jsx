import React, { useState, useEffect } from 'react';
import { User, Package, MessageSquare, ShoppingCart, LogOut, CreditCard, Edit2, Save, Eye, History, ArrowRight, Heart } from 'lucide-react';
import { orderAPI, authAPI } from '../api';
import { getRecentViews, clearRecentViews } from '../utils/recentViews';
import { getWishlistItems, toggleWishlist } from '../utils/wishlist';
import { downloadCustomerReport } from '../utils/reportGenerator';
import './UserDashboard.css';

const UserDashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [enquiries, setEnquiries] = useState([]);
    const [enquiriesLoading, setEnquiriesLoading] = useState(false);
    const [recentProducts, setRecentProducts] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [profileData, setProfileData] = useState({
        name: user ? user.name : "Guest User",
        email: user ? user.email : "guest@example.com",
        phone: user ? (user.phone || "") : "",
        company: user ? (user.company || "") : ""
    });

    const onLogoutRequested = () => {
        // Find handleLogout from props or parent context if possible
        // For now, clear storage and reload or use navigate
        localStorage.removeItem('fivestar_token');
        window.location.href = '/';
    };

    useEffect(() => {
        if (user) {
            setProfileData(prev => ({
                ...prev,
                name: user.name,
                email: user.email,
                phone: user.phone || prev.phone,
                company: user.company || prev.company,
            }));

            // Check if we requested a specific tab (like from the Header)
            const requestedTab = localStorage.getItem('fivestar_dash_tab');
            if (requestedTab) {
                setActiveTab(requestedTab);
                localStorage.removeItem('fivestar_dash_tab');
            }
        }
    }, [user]);

    // Fetch data when tabs change
    useEffect(() => {
        if (!user) return;

        if (activeTab === 'orders') {
            const fetchOrders = async () => {
                setOrdersLoading(true);
                try {
                    const data = await orderAPI.getMyOrders();
                    setOrders(data);
                } catch (error) {
                    console.error('Failed to load orders:', error);
                } finally {
                    setOrdersLoading(false);
                }
            };
            fetchOrders();
        }

        if (activeTab === 'enquiries') {
            const fetchEnquiries = async () => {
                setEnquiriesLoading(true);
                try {
                    const { enquiryAPI } = await import('../api');
                    const data = await enquiryAPI.getMyEnquiries();
                    setEnquiries(data);
                } catch (error) {
                    console.error('Failed to load enquiries:', error);
                } finally {
                    setEnquiriesLoading(false);
                }
            };
            fetchEnquiries();
        }

        if (activeTab === 'recent') {
            setRecentProducts(getRecentViews());
        }

        if (activeTab === 'wishlist') {
            setWishlistItems(getWishlistItems());
        }
    }, [activeTab, user]);

    const handleInputChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async () => {
        try {
            await authAPI.updateProfile({
                name: profileData.name,
                company: profileData.company,
                phone: profileData.phone,
            });
            setIsEditing(false);
            alert("Profile Updated Successfully!");
        } catch (error) {
            alert(error.message || "Failed to update profile");
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="dashboard-content-box">
                        <div className="box-header">
                            <h2>My Profile</h2>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn btn-secondary" onClick={() => downloadCustomerReport(user, orders, enquiries)} title="Download your complete account report">
                                    📥 Download Report
                                </button>
                                {!isEditing ? (
                                    <button className="btn-icon" onClick={() => setIsEditing(true)}>
                                        <Edit2 size={18} /> Edit
                                    </button>
                                ) : (
                                    <button className="btn-icon save" onClick={handleSaveProfile}>
                                        <Save size={18} /> Save
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="profile-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    disabled
                                    className="disabled-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            <div className="form-group">
                                <label>Company Name</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={profileData.company}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="Enter your company name"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <div className="dashboard-content-box">
                        <h2>Order History</h2>
                        {ordersLoading ? (
                            <p>Loading orders...</p>
                        ) : orders.length === 0 ? (
                            <p>No orders placed yet. <a href="/catalogue">Browse the catalogue</a> to get started!</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Amount</th>
                                            <th>Items</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order._id}>
                                                <td>#{order._id.slice(-8).toUpperCase()}</td>
                                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                                                <td>{order.items?.length || 0} items</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            case 'enquiries':
                return (
                    <div className="dashboard-content-box">
                        <h2>My Enquiries</h2>
                        {enquiriesLoading ? (
                            <p>Loading enquiries...</p>
                        ) : enquiries.length === 0 ? (
                            <p>You haven't submitted any enquiries yet.</p>
                        ) : (
                            <div className="user-enquiry-list">
                                {enquiries.map(enquiry => (
                                    <div key={enquiry._id} className="user-enquiry-card">
                                        <div className="enquiry-main">
                                            <div className="enquiry-meta">
                                                <span className="subject"><strong>Subject:</strong> {enquiry.subject}</span>
                                                <span className="date">{new Date(enquiry.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="message">{enquiry.message}</p>
                                        </div>
                                        {enquiry.adminReply && (
                                            <div className="reply-section">
                                                <div className="reply-header">
                                                    <strong>Admin Response:</strong>
                                                </div>
                                                <p className="reply-content">{enquiry.adminReply}</p>
                                            </div>
                                        )}
                                        <div className="enquiry-status">
                                            Status: <span className={`status-text ${enquiry.status.toLowerCase()}`}>{enquiry.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'recent':
                return (
                    <div className="dashboard-content-box">
                        <div className="box-header">
                            <h2>Recently Viewed Products</h2>
                            {recentProducts.length > 0 && (
                                <button className="btn-text-only" onClick={() => { clearRecentViews(); setRecentProducts([]); }}>
                                    Clear History
                                </button>
                            )}
                        </div>
                        {recentProducts.length === 0 ? (
                            <div className="empty-state-dashboard">
                                <History size={48} color="#cbd5e1" />
                                <p>You haven't viewed any strategic components recently.</p>
                                <a href="/catalogue" className="btn btn-primary">Browse Catalogue</a>
                            </div>
                        ) : (
                            <div className="recent-views-grid">
                                {recentProducts.map((p, idx) => (
                                    <div key={idx} className="recent-product-card animate-fade-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                                        <div className="recent-card-icon">
                                            <History size={24} />
                                        </div>
                                        <div className="recent-card-info">
                                            <h4>{p.name}</h4>
                                            <p>{p.partCode} • {p.category}</p>
                                            <span className="recent-price">{p.price}</span>
                                        </div>
                                        <a href={`/product/${p.partCode}`} className="btn-view-recent">
                                            <ArrowRight size={18} />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'wishlist':
                return (
                    <div className="dashboard-content-box">
                        <div className="box-header">
                            <h2>My Wishlist</h2>
                            <p className="subtitle">{wishlistItems.length} items saved for procurement</p>
                        </div>
                        {wishlistItems.length === 0 ? (
                            <div className="empty-state-dashboard">
                                <Heart size={48} color="#cbd5e1" />
                                <p>Your wishlist is empty. Explore our catalogue to save strategic components.</p>
                                <a href="/catalogue" className="btn btn-primary">Browse Catalogue</a>
                            </div>
                        ) : (
                            <div className="recent-views-grid">
                                {wishlistItems.map((p, idx) => (
                                    <div key={idx} className="recent-product-card animate-fade-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                                        <div className="recent-card-icon" style={{ background: '#fff1f2', color: '#fb7185' }}>
                                            <Heart size={24} fill="#fb7185" />
                                        </div>
                                        <div className="recent-card-info">
                                            <h4>{p.name}</h4>
                                            <p>{p.partCode} • {p.category}</p>
                                            <span className="recent-price">{p.price}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                className="btn-text-only"
                                                style={{ color: '#94a3b8', fontSize: '0.8rem' }}
                                                onClick={() => { toggleWishlist(p); setWishlistItems(getWishlistItems()); }}
                                            >
                                                Remove
                                            </button>
                                            <a href={`/product/${p.partCode}`} className="btn-view-recent">
                                                <ArrowRight size={18} />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="dashboard-page container section">
            <div className="dashboard-layout">
                <aside className="dashboard-sidebar">
                    <div className="user-profile-summary">
                        <div className="avatar-circle">
                            {profileData.name.charAt(0).toUpperCase()}
                        </div>
                        <h3>{profileData.name}</h3>
                        <p>{profileData.email}</p>
                    </div>
                    <nav className="dashboard-nav">
                        <button
                            className={activeTab === 'profile' ? 'active' : ''}
                            onClick={() => setActiveTab('profile')}
                        >
                            <User size={20} /> My Profile
                        </button>
                        <button
                            className={activeTab === 'orders' ? 'active' : ''}
                            onClick={() => setActiveTab('orders')}
                        >
                            <Package size={20} /> Orders
                        </button>
                        <button
                            className={activeTab === 'enquiries' ? 'active' : ''}
                            onClick={() => setActiveTab('enquiries')}
                        >
                            <MessageSquare size={20} /> Enquiries
                        </button>
                        <button
                            className={activeTab === 'recent' ? 'active' : ''}
                            onClick={() => setActiveTab('recent')}
                        >
                            <Eye size={20} /> Recently Viewed
                        </button>
                        <button
                            className={activeTab === 'wishlist' ? 'active' : ''}
                            onClick={() => setActiveTab('wishlist')}
                        >
                            <Heart size={20} /> Wishlist
                        </button>
                        <button className="logout-btn" onClick={onLogoutRequested}>
                            <LogOut size={20} /> Logout
                        </button>
                    </nav>
                </aside>

                <main className="dashboard-main">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default UserDashboard;

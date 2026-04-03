import React, { useState, useEffect } from 'react';
import { User, Package, MessageSquare, ShoppingCart, LogOut, CreditCard, Edit2, Save, Eye, History, ArrowRight, Heart, Calculator, Moon, RefreshCcw, Box } from 'lucide-react';
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
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('fivestar_theme') === 'dark');
    const [cbmData, setCbmData] = useState({ length: '', width: '', height: '', quantity: '1' });
    const [profileData, setProfileData] = useState({
        name: user ? user.name : "Guest User",
        email: user ? user.email : "guest@example.com",
        phone: user ? (user.phone || "") : "",
        company: user ? (user.company || "") : ""
    });

    const toggleTheme = (e) => {
        const newTheme = e.target.checked;
        setIsDarkMode(newTheme);
        if (newTheme) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('fivestar_theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.removeItem('fivestar_theme');
        }
    };

    const calculateCBM = () => {
        const l = parseFloat(cbmData.length) || 0;
        const w = parseFloat(cbmData.width) || 0;
        const h = parseFloat(cbmData.height) || 0;
        const q = parseInt(cbmData.quantity) || 1;
        return ((l * w * h) / 1000000) * q;
    };

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
                            
                            <div className="settings-section" style={{ gridColumn: '1 / -1', marginTop: '20px', padding: '20px', background: 'var(--color-bg)', borderRadius: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Moon size={20} color="var(--color-primary-dark)" />
                                        <div>
                                            <h4 style={{ margin: 0, color: 'var(--color-text)' }}>Dark Mode Appearance</h4>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Switch to dark colors for better visibility at night.</p>
                                        </div>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
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
                                            <th>Actions</th>
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
                                                <td>
                                                    <button className="btn-text-only" onClick={() => alert('Order configuration pre-filled and sent to admin for a new quote.')} style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                        <RefreshCcw size={14} /> Request Quote
                                                    </button>
                                                </td>
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
            case 'calculator':
                const totalCbm = calculateCBM();
                const container20ftMax = 33;
                const container40ftMax = 76;
                const pct20 = Math.min((totalCbm / container20ftMax) * 100, 100).toFixed(1);
                const pct40 = Math.min((totalCbm / container40ftMax) * 100, 100).toFixed(1);

                return (
                    <div className="dashboard-content-box">
                        <div className="box-header">
                            <h2>CBM Container Calculator</h2>
                            <p className="subtitle">Plan your logistics effectively by estimating container load</p>
                        </div>
                        <div className="cbm-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
                            <div className="form-group">
                                <label>Length (cm)</label>
                                <input type="number" value={cbmData.length} onChange={(e) => setCbmData({...cbmData, length: e.target.value})} placeholder="0" />
                            </div>
                            <div className="form-group">
                                <label>Width (cm)</label>
                                <input type="number" value={cbmData.width} onChange={(e) => setCbmData({...cbmData, width: e.target.value})} placeholder="0" />
                            </div>
                            <div className="form-group">
                                <label>Height (cm)</label>
                                <input type="number" value={cbmData.height} onChange={(e) => setCbmData({...cbmData, height: e.target.value})} placeholder="0" />
                            </div>
                            <div className="form-group">
                                <label>Quantity</label>
                                <input type="number" value={cbmData.quantity} onChange={(e) => setCbmData({...cbmData, quantity: e.target.value})} min="1" />
                            </div>
                        </div>
                        
                        <div className="cbm-results" style={{ background: '#f8fafc', padding: '30px', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                            <div className="cbm-total-card" style={{ marginBottom: '30px', textAlign: 'center' }}>
                                <h3 style={{ margin: '0 0 10px', color: 'var(--color-primary-dark)' }}>Total Order Volume</h3>
                                <div className="large-cbm" style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                                    {totalCbm.toFixed(3)} <span style={{ fontSize: '1.2rem', color: '#64748b' }}>CBM (m³)</span>
                                </div>
                            </div>
                            
                            <div className="container-visualizer">
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <h4 style={{ margin: 0 }}>20FT Container (33 CBM Max)</h4>
                                        <span style={{ fontWeight: 800, color: pct20 > 90 ? '#ef4444' : 'var(--color-primary)' }}>{pct20}%</span>
                                    </div>
                                    <div style={{ width: '100%', background: '#e2e8f0', height: '24px', borderRadius: '12px', overflow: 'hidden' }}>
                                        <div style={{ width: `${pct20}%`, background: pct20 > 90 ? '#ef4444' : 'var(--color-primary)', height: '100%', transition: 'width 0.5s ease' }}></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <h4 style={{ margin: 0 }}>40FT HQ Container (76 CBM Max)</h4>
                                        <span style={{ fontWeight: 800, color: pct40 > 90 ? '#ef4444' : 'var(--color-primary)' }}>{pct40}%</span>
                                    </div>
                                    <div style={{ width: '100%', background: '#e2e8f0', height: '24px', borderRadius: '12px', overflow: 'hidden' }}>
                                        <div style={{ width: `${pct40}%`, background: pct40 > 90 ? '#ef4444' : 'var(--color-primary)', height: '100%', transition: 'width 0.5s ease' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                        <button
                            className={activeTab === 'calculator' ? 'active' : ''}
                            onClick={() => setActiveTab('calculator')}
                        >
                            <Calculator size={20} /> CBM Calculator
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

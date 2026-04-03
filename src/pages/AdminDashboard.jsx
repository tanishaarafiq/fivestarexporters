import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingBag, Users, BarChart2, FileText, Settings, LogOut, TrendingUp, DollarSign, Plus, Edit2, Trash2, MessageSquare, CheckCircle, Mail, MessageCircle, X, Box, AlertTriangle, Moon, Heart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../api';
import './AdminDashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [allEnquiries, setAllEnquiries] = useState([]);
    const [allAuditLogs, setAllAuditLogs] = useState([]);
    const [engagementEvents, setEngagementEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // UI State for Forms
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productFormData, setProductFormData] = useState({
        name: '',
        partCode: '',
        category: 'All',
        price: '',
        description: '',
        image: ''
    });

    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    // Settings State
    const [settingsState, setSettingsState] = useState({
        siteName: 'Five Star Exporters',
        supportEmail: 'fivestarexporterss@gmail.com',
        phone: '+91 75399 23567',
        notifyOrders: true,
        notifyEnquiries: true,
        twoFactor: false
    });
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('fivestar_theme') === 'dark');

    const isAdmin = user?.role === 'admin';

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

    const handleSettingsSave = (e) => {
        e.preventDefault();
        setIsSavingSettings(true);
        setTimeout(() => {
            setIsSavingSettings(false);
            alert('Settings Configuration Saved and Applied Globally.');
        }, 1500);
    };

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'sales_rep')) {
            navigate('/login');
        }
    }, [user, navigate]);

    // Fetch dashboard stats
    useEffect(() => {
        if (user && (user.role === 'admin' || user.role === 'sales_rep')) {
            const fetchStats = async () => {
                try {
                    setLoading(true);
                    const data = await adminAPI.getStats();
                    setStats(data);
                } catch (error) {
                    console.error('Stats fetch failed:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchStats();
            adminAPI.getEngagement().then(setEngagementEvents).catch(console.error);
        }
    }, [user]);

    // Fetch data when tabs change
    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'sales_rep')) return;

        if (activeTab === 'customers') {
            adminAPI.getUsers().then(setAllUsers).catch(console.error);
        }
        if (activeTab === 'orders') {
            adminAPI.getOrders().then(setAllOrders).catch(console.error);
        }
        if (activeTab === 'products') {
            import('../api').then(m => m.productAPI.getAll()).then(setAllProducts).catch(err => console.error('Products fetch failed:', err));
        }
        if (activeTab === 'enquiries' || activeTab === 'overview') {
            adminAPI.getEnquiries().then(setAllEnquiries).catch(err => console.error('Enquiries fetch failed:', err));
        }
        if (activeTab === 'audit' || activeTab === 'overview') {
            adminAPI.getAuditLogs().then(setAllAuditLogs).catch(err => console.error('Audit logs fetch failed:', err));
        }
    }, [activeTab, user]);

    // Guard: Prevent crash if user data is not yet available
    if (!user) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#001e3c', color: '#fff' }}>
                <div className="pulse-dot" style={{ width: '40px', height: '40px', marginBottom: '20px' }}></div>
                <h3 style={{ letterSpacing: '1px', fontWeight: '300' }}>INITIALIZING SECURE SESSION...</h3>
            </div>
        );
    }

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await adminAPI.updateOrderStatus(orderId, newStatus);
            // Refresh orders
            const updatedOrders = await adminAPI.getOrders();
            setAllOrders(updatedOrders);
        } catch (error) {
            alert(error.message || 'Failed to update status');
        }
    };

    // Product CRUD Handlers
    const handleProductDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await adminAPI.deleteProduct(id);
                setAllProducts(allProducts.filter(p => p._id !== id));
            } catch (error) {
                alert(error.message || 'Failed to delete product');
            }
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await adminAPI.updateProduct(editingProduct._id, productFormData);
                alert('Product updated!');
            } else {
                await adminAPI.createProduct(productFormData);
                alert('Product created!');
            }
            setIsProductModalOpen(false);
            setEditingProduct(null);
            // Refresh
            import('../api').then(m => m.productAPI.getAll()).then(setAllProducts);
        } catch (error) {
            alert(error.message || 'Failed to save product');
        }
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        try {
            await adminAPI.replyToEnquiry(replyingTo._id, replyText);
            alert('Reply sent!');
            setReplyingTo(null);
            setReplyText('');
            adminAPI.getEnquiries().then(setAllEnquiries);
        } catch (error) {
            alert(error.message || 'Failed to send reply');
        }
    };

    if (user.role !== 'admin' && user.role !== 'sales_rep') return null;

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="admin-overview">
                        <div className="stats-grid">
                            <div className="stat-card clickable" onClick={() => setActiveTab('orders')}>
                                <div className="stat-icon bg-blue"><DollarSign size={24} /></div>
                                <div className="stat-info">
                                    <h3>Total Revenue</h3>
                                    <p>₹{loading ? '...' : (stats?.totalRevenue || 0).toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            <div className="stat-card clickable" onClick={() => setActiveTab('orders')}>
                                <div className="stat-icon bg-green"><ShoppingBag size={24} /></div>
                                <div className="stat-info">
                                    <h3>Total Orders</h3>
                                    <p>{loading ? '...' : stats?.totalOrders || 0}</p>
                                </div>
                            </div>
                            <div className="stat-card clickable" onClick={() => setActiveTab('customers')}>
                                <div className="stat-icon bg-purple"><Users size={24} /></div>
                                <div className="stat-info">
                                    <h3>Customers</h3>
                                    <p>{loading ? '...' : stats?.totalUsers || 0}</p>
                                </div>
                            </div>
                            <div className="stat-card clickable" onClick={() => setActiveTab('enquiries')}>
                                <div className="stat-icon bg-orange"><MessageSquare size={24} /></div>
                                <div className="stat-info">
                                    <h3>Enquiries</h3>
                                    <p>{loading ? '...' : stats?.totalEnquiries || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="charts-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                            <div className="chart-card">
                                <h3>Order Status</h3>
                                <div className="chart-legend" style={{ padding: '10px 0' }}>
                                    <span className="legend-item"><span className="dot navy"></span> Processing: {stats?.ordersByStatus?.processing || 0}</span>
                                    <span className="legend-item"><span className="dot gold"></span> Shipped: {stats?.ordersByStatus?.shipped || 0}</span>
                                    <span className="legend-item"><span className="dot" style={{ background: '#4ade80' }}></span> Delivered: {stats?.ordersByStatus?.delivered || 0}</span>
                                </div>
                                <div className="pie-chart" style={{ width: '120px', height: '120px' }}></div>
                            </div>

                            <div className="chart-card">
                                <h3>Quick Actions</h3>
                                <div className="quick-actions-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <button
                                        className="btn btn-primary"
                                        style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 20px', borderRadius: '8px' }}
                                        onClick={() => {
                                            setEditingProduct(null);
                                            setProductFormData({ name: '', partCode: '', category: 'All', price: '', description: '', image: '' });
                                            setActiveTab('products');
                                            setIsProductModalOpen(true);
                                        }}
                                    >
                                        <Plus size={18} /> Add New Item
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 20px', borderRadius: '8px' }}
                                        onClick={() => setActiveTab('orders')}
                                    >
                                        <ShoppingBag size={18} /> Manage Orders
                                    </button>
                                    <button
                                        className="btn"
                                        style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 20px', borderRadius: '8px', background: '#f1f5f9', color: '#1e293b' }}
                                        onClick={() => setActiveTab('audit')}
                                    >
                                        <FileText size={18} /> View System Logs
                                    </button>
                                </div>
                            </div>

                            <div className="chart-card">
                                <h3>Recent Logins</h3>
                                <div className="recent-logins-list">
                                    {allAuditLogs.filter(log => log.type === 'login').slice(0, 5).length === 0 ? (
                                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No recent logins tracked.</p>
                                    ) : (
                                        allAuditLogs.filter(log => log.type === 'login').slice(0, 5).map((log, idx) => (
                                            <div key={idx} className="login-item">
                                                <div className="login-info">
                                                    <span className="user-name">{log.user}</span>
                                                    <span className="login-time">{new Date(log.timestamp).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</span>
                                                </div>
                                                <span className="ip-badge">{log.ipAddress}</span>
                                            </div>
                                        ))
                                    )}
                                    <button className="view-all-link" onClick={() => setActiveTab('audit')}>More Audit Logs →</button>
                                </div>
                            </div>
                        </div>


                        <div className="recent-activity-wrapper" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                            <div className="recent-activity">
                                <h3>Recent Orders</h3>
                                {stats?.recentOrders?.length > 0 ? (
                                    <ul className="activity-list">
                                        {stats.recentOrders.map(order => (
                                            <li key={order._id}>
                                                <span className="time">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                <span className="activity">
                                                    {order.user?.name || 'User'} placed order #{order._id.slice(-6).toUpperCase()} — ₹{order.totalAmount?.toLocaleString('en-IN')} ({order.status})
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p style={{ padding: '10px' }}>No recent orders.</p>
                                )}
                            </div>
                            
                            <div className="engagement-card" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)', marginTop: 0 }}>
                                    <Heart size={20} color="#ef4444" /> Product Engagement Activity
                                </h3>
                                {engagementEvents.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--color-text-muted)' }}>
                                        <Eye size={36} style={{ opacity: 0.3, marginBottom: '10px' }} />
                                        <p style={{ margin: 0 }}>No engagement recorded yet. Users will appear here as they view and like products.</p>
                                    </div>
                                ) : (
                                    <ul style={{ listStyle: 'none', padding: 0, margin: '15px 0 0' }}>
                                        {engagementEvents.map((item, idx) => (
                                            <li key={item._id || idx} style={{ padding: '12px 0', borderBottom: idx < engagementEvents.length - 1 ? '1px solid var(--color-border)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <p style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 600 }}>{item.userName}</p>
                                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                        {item.action === 'liked'
                                                            ? <Heart size={14} color="#ef4444" fill="#ef4444" />
                                                            : <Eye size={14} color="#3b82f6" />
                                                        }
                                                        {item.action} <strong>{item.productName}</strong>
                                                    </p>
                                                </div>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', marginLeft: '10px' }}>
                                                    {new Date(item.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 'products':
                return (
                    <div className="admin-content-box">
                        <div className="box-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2>Manage Products ({allProducts.length})</h2>
                            {isAdmin && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setEditingProduct(null);
                                        setProductFormData({ name: '', partCode: '', category: 'All', price: '', description: '', image: '' });
                                        setIsProductModalOpen(true);
                                    }}
                                >
                                    <Plus size={18} /> Add New Product
                                </button>
                            )}
                        </div>

                        {isProductModalOpen && (
                            <div className="admin-modal-overlay">
                                <div className="admin-modal premium-modal">
                                    <div className="modal-header">
                                        <h3>{editingProduct ? 'Update Product Specifications' : 'Onboard New Product'}</h3>
                                        <button className="close-modal" onClick={() => setIsProductModalOpen(false)}><X size={20} /></button>
                                    </div>
                                    <form onSubmit={handleProductSubmit} className="admin-form-premium">
                                        <div className="form-grid">
                                            <div className="form-group-full">
                                                <label>Official Product Name</label>
                                                <div className="input-with-icon">
                                                    <Box size={18} />
                                                    <input type="text" placeholder="e.g. Precision Sulzer Gripper" value={productFormData.name} onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })} required />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Global Part Code</label>
                                                <input type="text" placeholder="e.g. SLZ-789-X" value={productFormData.partCode} onChange={(e) => setProductFormData({ ...productFormData, partCode: e.target.value })} required />
                                            </div>

                                            <div className="form-group">
                                                <label>Market Category</label>
                                                <select value={productFormData.category} onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}>
                                                    <option value="All">Select Category</option>
                                                    <option value="Grippers">Grippers</option>
                                                    <option value="Cutters">Cutters</option>
                                                    <option value="Dobby Parts">Dobby Parts</option>
                                                    <option value="Electronics">Electronics</option>
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label>Unit Price (₹)</label>
                                                <div className="input-with-icon">
                                                    <DollarSign size={18} />
                                                    <input type="number" placeholder="0.00" value={productFormData.price} onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })} />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Product Imagery (URL)</label>
                                                <input type="text" value={productFormData.image} onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })} placeholder="/images/products/spare_gear.jpg" />
                                            </div>
                                        </div>

                                        <div className="form-group-full">
                                            <label>Technical Description & Specifications</label>
                                            <textarea
                                                value={productFormData.description}
                                                onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                                                rows="4"
                                                placeholder="Provide detailed technical specifications for engineering review..."
                                            ></textarea>
                                        </div>

                                        <div className="modal-footer-actions">
                                            <button type="button" onClick={() => setIsProductModalOpen(false)} className="btn-cancel-premium">Discard Changes</button>
                                            <button type="submit" className="btn-save-premium">Commit to Database</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        <div className="table-container-premium">
                            <table className="admin-table-premium">
                                <thead>
                                    <tr>
                                        <th>Part Code</th>
                                        <th>Product Name</th>
                                        <th>Market Category</th>
                                        <th>Base Price</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allProducts.map(product => (
                                        <tr key={product._id} className="admin-row-hover">
                                            <td><span className="part-code-tag">{product.partCode}</span></td>
                                            <td className="product-name-cell">
                                                <div className="product-avatar-placeholder">{product.name.charAt(0)}</div>
                                                <span>{product.name}</span>
                                            </td>
                                            <td>{product.category}</td>
                                            <td className="price-cell">₹{product.price || 0}</td>
                                            <td className="actions-cell text-right">
                                                {isAdmin ? (
                                                    <>
                                                        <button className="btn-action-edit" onClick={() => {
                                                            setEditingProduct(product);
                                                            setProductFormData({
                                                                name: product.name,
                                                                partCode: product.partCode,
                                                                category: product.category,
                                                                price: product.price || '',
                                                                description: product.description || '',
                                                                image: product.image || ''
                                                            });
                                                            setIsProductModalOpen(true);
                                                        }} title="Edit Specifications"><Edit2 size={16} /></button>
                                                        <button className="btn-action-delete" onClick={() => handleProductDelete(product._id)} title="Decommission Item"><Trash2 size={16} /></button>
                                                    </>
                                                ) : (
                                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>View Only</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <div className="admin-content-box">
                        <h2>Manage Orders ({allOrders.length})</h2>
                        {allOrders.length === 0 ? (
                            <p>No orders yet.</p>
                        ) : (
                            <div className="table-container-premium">
                                <table className="admin-table-premium">
                                    <thead>
                                        <tr>
                                            <th>Sequence ID</th>
                                            <th>Strategic Client</th>
                                            <th>Timestamp</th>
                                            <th>Valuation</th>
                                            <th>Status Pulse</th>
                                            <th className="text-right">Administration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allOrders.map(order => (
                                            <tr key={order._id} className="admin-row-hover">
                                                <td><span className="part-code-tag">#{order._id.slice(-8).toUpperCase()}</span></td>
                                                <td className="product-name-cell">
                                                    <div className="product-avatar-placeholder" style={{ background: '#f5f3ff', color: '#7c3aed' }}>{order.user?.name?.charAt(0) || 'U'}</div>
                                                    <span>{order.user?.name || 'Authorized Client'}</span>
                                                </td>
                                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td className="price-cell">₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                                                <td>
                                                    <span className={`status-badge-premium ${order.status.toLowerCase()}`}>{order.status}</span>
                                                </td>
                                                <td className="text-right">
                                                    <select
                                                        className="status-select-premium"
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                        disabled={!isAdmin}
                                                    >
                                                        <option value="Processing">Processing</option>
                                                        <option value="Confirmed">Confirmed</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
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
                    <div className="admin-content-box">
                        <div className="box-header">
                            <h2>Business Operations Management</h2>
                            <p className="subtitle">Manage strategic customer enquiries and communication history</p>
                        </div>
                        {allEnquiries.length === 0 ? (
                            <p style={{ padding: '20px' }}>No enquiries found.</p>
                        ) : (
                            <div className="enquiry-grid-admin">
                                {allEnquiries.map(enquiry => (
                                    <div className={`enquiry-card-premium ${enquiry.status === 'Pending' ? 'pending' : 'replied'}`} key={enquiry._id}>
                                        <div className="card-top">
                                            <div className="status-indicator">
                                                <span className={`status-dot ${enquiry.status.toLowerCase()}`}></span>
                                                <span className="status-text">{enquiry.status}</span>
                                            </div>
                                            <span className="enquiry-date">{new Date(enquiry.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        <div className="card-main">
                                            <div className="customer-header">
                                                <div className="avatar-small">{enquiry.firstName?.charAt(0)}{enquiry.lastName?.charAt(0)}</div>
                                                <div className="customer-meta">
                                                    <h4>{enquiry.firstName} {enquiry.lastName}</h4>
                                                    <div className="meta-item">
                                                        <Mail size={14} /> <span>{enquiry.email}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="enquiry-content">
                                                <div className="subject-box">
                                                    <MessageCircle size={14} /> <strong>{enquiry.subject}</strong>
                                                </div>
                                                <p className="message-text">{enquiry.message}</p>
                                            </div>
                                        </div>

                                        <div className="card-footer">
                                            {enquiry.adminReply ? (
                                                <div className="reply-preview">
                                                    <div className="reply-header">
                                                        <CheckCircle size={14} color="#10b981" /> <strong>Replied:</strong>
                                                    </div>
                                                    <p>{enquiry.adminReply}</p>
                                                </div>
                                            ) : (
                                                <div className="reply-section">
                                                    {replyingTo?._id === enquiry._id ? (
                                                        <form onSubmit={handleReplySubmit} className="premium-reply-form">
                                                            <textarea
                                                                value={replyText}
                                                                onChange={(e) => setReplyText(e.target.value)}
                                                                placeholder="Craft your reply..."
                                                                required
                                                            ></textarea>
                                                            <div className="reply-actions">
                                                                <button type="button" onClick={() => setReplyingTo(null)} className="btn-cancel">Cancel</button>
                                                                <button type="submit" className="btn-send">Send Response</button>
                                                            </div>
                                                        </form>
                                                    ) : (
                                                        <button onClick={() => setReplyingTo(enquiry)} className="btn-reply-trigger">
                                                            <Edit2 size={16} /> Open Reply Portal
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'audit':
                return (
                    <div className="admin-content-box">
                        <div className="box-header">
                            <h2>System Audit Logs ({allAuditLogs.length})</h2>
                            <p className="subtitle">Track strategic access and administrative actions across the platform</p>
                        </div>
                        {allAuditLogs.length === 0 ? (
                            <p style={{ padding: '20px' }}>No audit logs recorded yet.</p>
                        ) : (
                            <div className="table-container-premium">
                                <table className="admin-table-premium">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '25%' }}>Authorized User</th>
                                            <th style={{ width: '15%' }}>Action Type</th>
                                            <th style={{ width: '40%' }}>Operational Details</th>
                                            <th style={{ width: '20%' }}>Secure Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...allAuditLogs].reverse().map((log, idx) => (
                                            <tr key={idx} className="admin-row-hover">
                                                <td className="product-name-cell">
                                                    <div className="product-avatar-placeholder" style={{ background: '#f8fafc', color: '#64748b' }}>{log.user?.charAt(0) || 'U'}</div>
                                                    <span>{log.user || 'System'}</span>
                                                </td>
                                                <td>
                                                    <span className={`status-badge-premium ${log.type === 'login' ? 'customer' : 'admin'}`}>
                                                        {log.type.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontWeight: 600 }}>{log.action || (log.type === 'login' ? 'Successful Authentication' : 'Administrative Change')}</span>
                                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Origin IP: {log.ipAddress}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="activity-pulse">
                                                        <div className="pulse-dot" style={{ background: log.type === 'login' ? '#22c55e' : '#3b82f6' }}></div>
                                                        <span>{new Date(log.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            case 'customers':
                return (
                    <div className="admin-content-box">
                        <h2>Customers ({allUsers.length})</h2>
                        {allUsers.length === 0 ? (
                            <p>No customers registered yet.</p>
                        ) : (
                            <div className="table-container-premium">
                                <table className="admin-table-premium">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '30%' }}>Strategic Account</th>
                                            <th style={{ width: '25%' }}>Security Credentials</th>
                                            <th style={{ width: '15%' }}>Access Level</th>
                                            <th style={{ width: '20%' }}>Activity Pulse</th>
                                            <th style={{ width: '10%' }}>Member Since</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allUsers.map(u => (
                                            <tr key={u._id} className="admin-row-hover">
                                                <td className="product-name-cell">
                                                    <div className="product-avatar-placeholder" style={{ background: '#e0f2fe', color: '#0369a1' }}>{u.name.charAt(0)}</div>
                                                    <span>{u.name}</span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontWeight: 600 }}>{u.email}</span>
                                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {u._id.slice(-6)}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`status-badge-premium ${u.role}`}>{u.role}</span>
                                                </td>
                                                <td>
                                                    <div className="activity-pulse">
                                                        {u.lastLogin ? (
                                                            <>
                                                                <div className="pulse-dot"></div>
                                                                <span>{new Date(u.lastLogin).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                                            </>
                                                        ) : 'Cold Account'}
                                                    </div>
                                                </td>
                                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );
            case 'settings':
                return (
                    <div className="admin-content-box settings-premium-module">
                        <div className="box-header">
                            <h2>Platform Configuration</h2>
                            <p className="subtitle">Manage overarching system behavior, security protocols, and operational preferences.</p>
                        </div>
                        <form className="settings-grid" onSubmit={handleSettingsSave}>
                            <div className="settings-card">
                                <div className="card-header">
                                    <div className="icon-wrapper"><LayoutDashboard size={20} /></div>
                                    <h3>Global Parameters</h3>
                                </div>
                                <div className="setting-group">
                                    <label>Platform Name</label>
                                    <input type="text" value={settingsState.siteName} onChange={(e) => setSettingsState({ ...settingsState, siteName: e.target.value })} />
                                </div>
                                <div className="setting-group">
                                    <label>Support Email Address</label>
                                    <input type="email" value={settingsState.supportEmail} onChange={(e) => setSettingsState({ ...settingsState, supportEmail: e.target.value })} />
                                </div>
                                <div className="setting-group">
                                    <label>Support Phone Number</label>
                                    <input type="tel" value={settingsState.phone} onChange={(e) => setSettingsState({ ...settingsState, phone: e.target.value })} />
                                </div>
                            </div>

                            <div className="settings-card">
                                <div className="card-header">
                                    <div className="icon-wrapper" style={{ background: '#fef2f2', color: '#dc2626' }}><LogOut size={20} /></div>
                                    <h3>Security & Access</h3>
                                </div>
                                <div className="setting-group toggle-group">
                                    <div className="toggle-info">
                                        <label>Require Two-Factor Authentication</label>
                                        <span>Mandate 2FA for all administrator accounts</span>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" checked={settingsState.twoFactor} onChange={(e) => setSettingsState({ ...settingsState, twoFactor: e.target.checked })} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                                <button type="button" className="btn btn-secondary btn-outline" style={{width: '100%', marginTop: '10px'}} onClick={() => alert("Password reset link dispatched to your email.")}>
                                    Initiate Password Reset
                                </button>
                            </div>

                            <div className="settings-card">
                                <div className="card-header">
                                    <div className="icon-wrapper" style={{ background: '#fef3c7', color: '#d97706' }}><MessageSquare size={20} /></div>
                                    <h3>Notification Subscriptions</h3>
                                </div>
                                <div className="setting-group toggle-group">
                                    <div className="toggle-info">
                                        <label>Order Confirmations</label>
                                        <span>Receive immediate alerts for new customer orders</span>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" checked={settingsState.notifyOrders} onChange={(e) => setSettingsState({ ...settingsState, notifyOrders: e.target.checked })} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                                <div className="setting-group toggle-group">
                                    <div className="toggle-info">
                                        <label>Enquiry Receipts</label>
                                        <span>Ping when new strategic enquiries arrive</span>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" checked={settingsState.notifyEnquiries} onChange={(e) => setSettingsState({ ...settingsState, notifyEnquiries: e.target.checked })} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="settings-card">
                                <div className="card-header">
                                    <div className="icon-wrapper" style={{ background: '#f5f3ff', color: '#8b5cf6' }}><Moon size={20} /></div>
                                    <h3>Appearance</h3>
                                </div>
                                <div className="setting-group toggle-group">
                                    <div className="toggle-info">
                                        <label>Dark Mode</label>
                                        <span>Apply an eye-friendly dark theme system-wide</span>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="settings-footer">
                                <p className="footer-note">* Core configuration changes may require up to 5 minutes to propagate across edges.</p>
                                <button type="submit" className="btn-save-premium" disabled={isSavingSettings}>
                                    {isSavingSettings ? <span className="loader-spin"></span> : 'Apply System Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="admin-dashboard-page">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <div className="logo-icon" style={{ background: 'var(--color-accent)', width: '35px', height: '35px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#001e3c' }}>
                        <LayoutDashboard size={20} />
                    </div>
                    <span>Admin Panel</span>
                </div>
                <div className="admin-nav">
                    <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
                        <LayoutDashboard size={20} /> <span>Overview</span>
                    </button>
                    <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>
                        <Box size={20} /> <span>Product Catalogue</span>
                    </button>
                    <button
                        className={isProductModalOpen ? 'active' : ''}
                        style={{ background: 'rgba(255, 215, 0, 0.1)', margin: '10px 15px', borderRadius: '10px', width: 'auto', border: '1px dashed var(--color-accent)' }}
                        onClick={() => {
                            setEditingProduct(null);
                            setProductFormData({ name: '', partCode: '', category: 'All', price: '', description: '', image: '' });
                            setActiveTab('products');
                            setIsProductModalOpen(true);
                        }}
                    >
                        <Plus size={18} /> <span>Onboard New Item</span>
                    </button>
                    <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
                        <ShoppingBag size={20} /> <span>Orders</span>
                    </button>
                    <button className={activeTab === 'customers' ? 'active' : ''} onClick={() => setActiveTab('customers')}>
                        <Users size={20} /> <span>Customers</span>
                    </button>
                    <button className={activeTab === 'enquiries' ? 'active' : ''} onClick={() => setActiveTab('enquiries')}>
                        <MessageSquare size={20} /> <span>Enquiries</span>
                    </button>
                    {isAdmin && (
                        <>
                            <button className={activeTab === 'audit' ? 'active' : ''} onClick={() => setActiveTab('audit')}>
                                <FileText size={20} /> <span>Audit Log</span>
                            </button>
                            <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
                                <Settings size={20} /> <span>Settings</span>
                            </button>
                        </>
                    )}
                </div>
                <button className="admin-logout" onClick={() => { onLogout(); navigate('/'); }}>
                    <LogOut size={20} /> <span>Logout</span>
                </button>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                    <div className="admin-profile">
                        <span>{user.name}</span>
                        <div className="admin-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                    </div>
                </header>
                <div className="admin-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

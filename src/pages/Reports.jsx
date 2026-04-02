import React, { useEffect } from 'react';
import { Download, Eye, ShoppingCart, Users, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Reports.css';

const Reports = ({ user }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login'); // Redirect to login if not admin
        }
    }, [user, navigate]);

    if (!user || user.role !== 'admin') return null; // Prevent flash of content

    return (
        <div className="reports-page container section">
            <div className="page-header-flex">
                <div>
                    <h1 className="page-title">Reports & Analytics</h1>
                    <p className="page-subtitle">Detailed insights into system performance and business metrics.</p>
                </div>
                <button className="btn btn-primary">
                    <Download size={18} /> Export Report
                </button>
            </div>

            <div className="analytics-grid">
                {/* Order Analytics */}
                <div className="analytics-card large">
                    <h3>Order Analytics</h3>
                    <div className="chart-container">
                        <div className="mock-line-chart">
                            <svg viewBox="0 0 500 150" className="line-chart-svg">
                                <polyline
                                    points="0,120 50,100 100,110 150,80 200,90 250,50 300,60 350,40 400,30 450,20 500,10"
                                    fill="none"
                                    stroke="var(--color-navy)"
                                    strokeWidth="3"
                                />
                                <circle cx="50" cy="100" r="4" fill="var(--color-gold)" />
                                <circle cx="150" cy="80" r="4" fill="var(--color-gold)" />
                                <circle cx="250" cy="50" r="4" fill="var(--color-gold)" />
                                <circle cx="350" cy="40" r="4" fill="var(--color-gold)" />
                                <circle cx="450" cy="20" r="4" fill="var(--color-gold)" />
                            </svg>
                            <div className="chart-months">
                                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Views */}
                <div className="analytics-card">
                    <h3>Product View Statistics</h3>
                    <div className="stat-list">
                        <div className="stat-item">
                            <span className="stat-label">Powerloom Shuttle</span>
                            <div className="progress-bar"><div className="progress" style={{ width: '85%' }}></div></div>
                            <span className="stat-value">1,240</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Weft Fork</span>
                            <div className="progress-bar"><div className="progress" style={{ width: '65%' }}></div></div>
                            <span className="stat-value">850</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Electronic Dropper</span>
                            <div className="progress-bar"><div className="progress" style={{ width: '45%' }}></div></div>
                            <span className="stat-value">620</span>
                        </div>
                    </div>
                </div>

                {/* User Activity */}
                <div className="analytics-card">
                    <h3>User Activity Breakdown</h3>
                    <div className="pie-chart-simple">
                        <div className="pie-segment-simple" style={{ background: 'conic-gradient(var(--color-navy) 0% 70%, #eee 70% 100%)' }}></div>
                        <div className="pie-legend-center">
                            <span>70%</span>
                            <small>Active</small>
                        </div>
                    </div>
                    <p className="text-center mt-20">70% of registered users were active this month.</p>
                </div>
            </div>

            {/* Audit Log */}
            <div className="audit-section">
                <h3>System Audit Log</h3>
                <table className="audit-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>IP Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2024-02-17 10:45:22</td>
                            <td>Admin</td>
                            <td>Updated stock for "Powerloom Shuttle"</td>
                            <td>192.168.1.50</td>
                        </tr>
                        <tr>
                            <td>2024-02-17 09:30:15</td>
                            <td>John Doe</td>
                            <td>Placed Order #ORD-9283</td>
                            <td>10.0.0.12</td>
                        </tr>
                        <tr>
                            <td>2024-02-16 16:20:10</td>
                            <td>System</td>
                            <td>Automated Backup Completed</td>
                            <td>Localhost</td>
                        </tr>
                        <tr>
                            <td>2024-02-16 14:10:05</td>
                            <td>Sarah Smith</td>
                            <td>Failed Login Attempt</td>
                            <td>10.0.0.15</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Reports;

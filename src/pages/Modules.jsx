import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ShoppingCart, Truck, Activity, Database, Key, Search } from 'lucide-react';
import './Modules.css';

const Modules = ({ user }) => {
    const navigate = useNavigate();

    const handleModuleClick = (link) => {
        if (!user) {
            alert("🔒 Access Restricted\n\nPlease Login to access System Modules.");
            navigate('/login');
            return;
        }

        // Admin Only Restriction
        if ((link === '/admin' || link === '/reports') && user.role !== 'admin') {
            alert("⛔ Admin Access Only\n\nYou do not have permission to view this module.");
            return;
        }

        navigate(link);
    };

    const modules = [
        {
            title: "Platform Access & User Control",
            icon: <Key size={40} />,
            link: "/login", // This one might be an exception if we want them to login, but logic handles it
            features: [
                "Customer Account Creation",
                "Secure Login Validation",
                "Role-Based Access Control (RBAC)",
                "Password Recovery System",
                "Automated Session Timeout"
            ]
        },
        {
            title: "Spare Parts Catalogue Engine",
            icon: <Search size={40} />,
            link: "/catalogue",
            features: [
                "Comprehensive Parts Listing",
                "Imported Parts Identification",
                "Category-Wise Classification",
                "Detailed Product Specifications",
                "Real-time Availability Status"
            ]
        },
        {
            title: "Purchase & Order System",
            icon: <ShoppingCart size={40} />,
            link: "/cart",
            features: [
                "Interactive Cart Management",
                "Seamless Order Submission",
                "Instant Order Confirmation",
                "Live Order Status Tracking",
                "Digital Payment Records"
            ]
        },
        {
            title: "Business Operations Management",
            icon: <Database size={40} />,
            link: "/admin",
            features: [
                "Product Inventory Management",
                "Customer Data Handling",
                "Order Processing Workflow",
                "Website Content Updates",
                "Supplier Information Managment"
            ]
        },
        {
            title: "Analytics & Report Panel",
            icon: <Activity size={40} />,
            link: "/reports",
            features: [
                "User Activity Tracking",
                "Sales & Order Analytics",
                "Most Viewed Products Analysis",
                "System Usage Reports",
                "Exportable Data Audits"
            ]
        }
    ];

    return (
        <div className="modules-page">
            <section className="page-header">
                <div className="container">
                    <h1 className="page-title">System Modules</h1>
                    <p className="page-subtitle">Comprehensive breakdown of the platform's core functionalities</p>
                </div>
            </section>

            <section className="section bg-light">
                <div className="container">
                    <div className="modules-list">
                        {modules.map((module, index) => (
                            <div
                                onClick={() => handleModuleClick(module.link)}
                                className="module-detailed-card-link animate-fade-up"
                                key={index}
                                style={{ cursor: 'pointer', animationDelay: `${index * 0.15}s` }}
                            >
                                <div className="module-detailed-card">
                                    <div className="module-header">
                                        <div className="module-icon-wrapper">
                                            {module.icon}
                                        </div>
                                        <h2>{module.title}</h2>
                                    </div>
                                    <div className="module-body">
                                        <ul className="feature-list">
                                            {module.features.map((feature, idx) => (
                                                <li key={idx}>
                                                    <div className="feature-dot"></div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="module-footer">
                                        <span className="launch-btn">Initialize Module &rarr;</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Modules;

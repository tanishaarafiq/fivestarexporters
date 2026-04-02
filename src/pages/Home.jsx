import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Settings, Globe, Shield, BarChart, Activity, Truck } from 'lucide-react';
import './Home.css';

const Home = ({ user }) => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="container hero-content animate-fade-up">
                    <h1 className="hero-title">
                        Precision Engineered Success for Global Powerloom Exports
                    </h1>
                    <p className="hero-description">
                        Empowering Five Star Exporters with a state-of-the-art digital ecosystem for
                        seamless catalogue integration, real-time enquiry tracking, and global order management.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/catalogue" className="btn btn-primary">Explore Catalogue</Link>
                        {user ? (
                            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn btn-secondary">Command Center</Link>
                        ) : (
                            <Link to="/login" className="btn btn-secondary">Get Started</Link>
                        )}
                        <Link to="/contact" className="btn btn-outline">Consult Our Experts</Link>
                    </div>
                </div>
                <div className="hero-visual animate-float">
                    <Settings size={120} strokeWidth={1} />
                </div>
            </section>

            {/* About Project Section */}
            <section className="section bg-white">
                <div className="container">
                    <div className="animate-fade-up">
                        <h2 className="section-title">Bridging Quality with Global Standards</h2>
                    </div>
                    <div className="about-grid">
                        <div className="about-text animate-fade-up">
                            <p>
                                Five Star Exporters stands at the pinnacle of powerloom spare parts consultancy.
                                Our digital transformation initiative replaces legacy manual workflows with a
                                high-performance platform designed for the modern industrial age.
                            </p>
                            <p>
                                Through precision engineering of our digital tools, we ensure that every enquiry,
                                every part, and every shipment meets the exacting standards our international
                                partners expect.
                            </p>
                        </div>
                        <div className="about-stats animate-zoom">
                            <div className="stat-card">
                                <h3>500+</h3>
                                <p>Precision Parts</p>
                            </div>
                            <div className="stat-card">
                                <h3>50+</h3>
                                <p>Global Partners</p>
                            </div>
                            <div className="stat-card">
                                <h3>100%</h3>
                                <p>Digital Integrity</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Objectives Section */}
            <section className="section bg-light">
                <div className="container">
                    <h2 className="section-title animate-fade-up">Core Strategic Objectives</h2>
                    <div className="objectives-grid">
                        {[
                            { icon: <Globe size={40} />, title: "Global Market Superiority", desc: "Projecting Indian manufacturing excellence to every corner of the textile world." },
                            { icon: <Settings size={40} />, title: "Intelligent Automation", desc: "Leveraging smart algorithms to synchronize inventory with global demand." },
                            { icon: <Shield size={40} />, title: "Uncompromising Security", desc: "Military-grade data protection for your commercial and proprietary transitions." },
                            { icon: <BarChart size={40} />, title: "Predictive Analytics", desc: "Transforming raw data into strategic intelligence for business growth." },
                            { icon: <Activity size={40} />, title: "Technical Consultancy", desc: "Deep-domain expertise provided to clients for complex mechanical troubleshooting." },
                            { icon: <Truck size={40} />, title: "Export Compliance", desc: "Ensuring every shipment adheres to international standards and trade regulations." }
                        ].map((obj, i) => (
                            <div className="objective-card animate-fade-up" key={i} style={{ animationDelay: `${i * 0.2}s` }}>
                                <div className="obj-icon-wrapper">{obj.icon}</div>
                                <h3>{obj.title}</h3>
                                <p>{obj.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack Section */}
            <section className="section tech-section text-white">
                <div className="container">
                    <h2 className="section-title title-white animate-fade-up">Engineered with Precision</h2>
                    <div className="tech-grid">
                        {[
                            { name: "MongoDB", role: "Scalable Data Engine" },
                            { name: "Express.js", role: "High-Performance API" },
                            { name: "React", role: "Dynamic Interface" },
                            { name: "Node.js", role: "Robust Ecosystem" },
                            { name: "Razorpay", role: "Global Pay Gateway" },
                            { name: "Vercel", role: "Edge-Level Deployment" }
                        ].map((tech, i) => (
                            <div className="tech-card animate-zoom" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                                <h3>{tech.name}</h3>
                                <p>{tech.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modules Overview */}
            <section className="section bg-white">
                <div className="container">
                    <h2 className="section-title animate-fade-up">Operational Ecosystem</h2>
                    <div className="modules-grid-home">
                        {[
                            { title: 'Secure Gateway', link: '/login' },
                            { title: 'Global Catalogue', link: '/catalogue' },
                            { title: 'Procurement Suite', link: '/cart' },
                            { title: 'Command Center', link: '/admin' },
                            { title: 'Intelligence Panel', link: '/reports' }
                        ].map((module, index) => (
                            <Link to={module.link} className="module-card-home animate-fade-up" key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                                <CheckCircle className="module-icon" size={24} />
                                <h3>{module.title}</h3>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-40 animate-fade-up">
                        <Link to="/modules" className="btn btn-primary">Architecture Overview <ArrowRight size={16} /></Link>
                    </div>
                </div>
            </section>

            {/* Consultant Info */}
            <section className="section consultant-section animate-fade-up">
                <div className="container">
                    <div className="consultant-box">
                        <h2>Strategic Consultant: Five Star Exporters</h2>
                        <p>Academic Partnership: Dept of CT-PG, Kongu Engineering College</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

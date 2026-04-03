import React, { useEffect } from 'react';
import { Globe, Truck, ShieldCheck, Award, Compass, Users } from 'lucide-react';
import './About.css';

const About = () => {
    useEffect(() => {
        const cards = document.querySelectorAll('.glow-card');
        const handleMouseMove = (e) => {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        };

        cards.forEach(card => card.addEventListener('mousemove', handleMouseMove));
        return () => cards.forEach(card => card.removeEventListener('mousemove', handleMouseMove));
    }, []);

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container hero-container">
                    <div className="hero-content animate-fade-up">
                        <div className="badge">Leading Exporters Since 1995</div>
                        <h1 className="hero-title">Pioneering the Global <br/>Powerloom Industry</h1>
                        <p className="hero-subtitle">Based in Perundurai, Tamil Nadu, Five Star Exporters bridges high-precision engineering with worldwide manufacturing markets.</p>
                    </div>
                    <div className="hero-graphics animate-zoom">
                        <div className="globe-graphic">
                            <Globe size={180} strokeWidth={0.5} className="globe-icon" color="var(--color-primary-light)" />
                            <div className="orbit orbit-1"></div>
                            <div className="orbit orbit-2"></div>
                            <div className="data-node node-1"></div>
                            <div className="data-node node-2"></div>
                            <div className="data-node node-3"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Legacy */}
            <section className="legacy-section section">
                <div className="container">
                    <div className="legacy-grid">
                        <div className="legacy-text animate-fade-up">
                            <h2 className="section-title text-left" style={{ margin: 0, padding: 0 }}>Our Industrial Legacy</h2>
                            <div className="title-underline"></div>
                            <p style={{ marginTop: '20px', fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
                                For decades, <strong>Five Star Exporters</strong> has been the cornerstone of the powerloom spare parts industry. What began as a localized sourcing operation in Tamil Nadu has rapidly evolved into a global logistics powerhouse.
                            </p>
                            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
                                We don't just export products; we engineer international supply chains. Our rigorous quality benchmarks ensure that every precision gripper, cutter, and dobby part meets the exacting standards of our elite international clientele.
                            </p>
                            <div className="stats-row">
                                <div className="stat">
                                    <span className="stat-number">50+</span>
                                    <span className="stat-label">Countries Served</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-number">10k+</span>
                                    <span className="stat-label">Strategic Parts</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-number">25+</span>
                                    <span className="stat-label">Years Expertise</span>
                                </div>
                            </div>
                        </div>
                        <div className="legacy-visual animate-zoom" style={{ animationDelay: '0.2s' }}>
                            <div className="image-placeholder float-animation">
                                <ShieldCheck size={80} color="var(--color-primary)" />
                                <h3>Engineered for Precision</h3>
                                <div className="tech-ring"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="values-section section bg-light">
                <div className="container">
                    <h2 className="section-title text-center animate-fade-up" style={{ padding: 0, margin: '0 auto 40px', maxWidth: 'max-content' }}>Core Competencies</h2>
                    <div className="values-grid">
                        <div className="value-card glow-card animate-fade-up">
                            <div className="glow-overlay"></div>
                            <div className="icon-pulse-wrapper parallax-icon">
                                <Award size={36} color="var(--color-accent-dark)" />
                            </div>
                            <h3>Uncompromising Quality</h3>
                            <p>Advanced metallurgical testing and strict dimensional tolerance checks guarantee that our spare parts outperform standard OEM benchmarks under heavy industrial loads.</p>
                        </div>
                        <div className="value-card glow-card animate-fade-up" style={{ animationDelay: '0.2s' }}>
                            <div className="glow-overlay"></div>
                            <div className="icon-pulse-wrapper parallax-icon">
                                <Truck size={36} color="var(--color-primary)" />
                            </div>
                            <h3>Global Logistics</h3>
                            <p>Strategic partnerships with premier oceanic and aerial freight companies enable us to deliver massive container payloads with absolutely zero-latency efficiency worldwide.</p>
                        </div>
                        <div className="value-card glow-card animate-fade-up" style={{ animationDelay: '0.4s' }}>
                            <div className="glow-overlay"></div>
                            <div className="icon-pulse-wrapper parallax-icon">
                                <Compass size={36} color="#10b981" />
                            </div>
                            <h3>Strategic Sourcing</h3>
                            <p>We heavily leverage localized manufacturing excellence in South India to provide globally competitive pricing models without ever sacrificing engineering integrity.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Operations Team */}
            <section className="team-section section">
                <div className="container">
                    <h2 className="section-title text-center animate-fade-up" style={{ padding: 0, margin: '0 auto 10px', maxWidth: 'max-content' }}>Global Operations Command</h2>
                    <p className="subtitle-text text-center animate-fade-up" style={{ color: 'var(--color-text-muted)', marginBottom: '50px' }}>Dedicated divisions ensuring seamless international execution and absolute client success.</p>
                    
                    <div className="book-cards-grid">
                        <div className="book-card animate-fade-up">
                            <div className="book-card-inner">
                                <div className="book-card-front" style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))' }}>
                                    <div className="book-spine"></div>
                                    <div className="book-card-icon-wrapper">
                                        <Users size={48} color="rgba(255,255,255,0.9)" />
                                    </div>
                                    <h3>Global Sourcing &amp; Procurement</h3>
                                    <span className="book-tag">Vendor Management</span>
                                </div>
                                <div className="book-card-back">
                                    <div className="book-spine" style={{ background: 'var(--color-primary)' }}></div>
                                    <p>Securing the highest-grade raw materials and industrial spare parts through a curated network of trusted manufacturers across South India.</p>
                                    <ul className="book-details">
                                        <li>✦ 200+ Vendor Relationships</li>
                                        <li>✦ Real-Time Inventory Sync</li>
                                        <li>✦ Bulk Discount Negotiation</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="book-card animate-fade-up" style={{ animationDelay: '0.2s' }}>
                            <div className="book-card-inner">
                                <div className="book-card-front" style={{ background: 'linear-gradient(135deg, #d97706, var(--color-accent-dark))' }}>
                                    <div className="book-spine" style={{ background: 'rgba(0,0,0,0.2)' }}></div>
                                    <div className="book-card-icon-wrapper">
                                        <ShieldCheck size={48} color="rgba(0,0,0,0.8)" />
                                    </div>
                                    <h3 style={{ color: '#1e1e1e' }}>Quality Assurance Directorate</h3>
                                    <span className="book-tag" style={{ background: 'rgba(0,0,0,0.15)', color: '#333' }}>ISO Compliance</span>
                                </div>
                                <div className="book-card-back">
                                    <div className="book-spine" style={{ background: '#d97706' }}></div>
                                    <p>Rigorous industrial stress-testing and dimensional tolerance checks ensure every component dispatched meets exacting international standards.</p>
                                    <ul className="book-details">
                                        <li>✦ ISO 9001:2015 Aligned</li>
                                        <li>✦ Pre-Dispatch Inspections</li>
                                        <li>✦ Zero-Defect Policy</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="book-card animate-fade-up" style={{ animationDelay: '0.4s' }}>
                            <div className="book-card-inner">
                                <div className="book-card-front" style={{ background: 'linear-gradient(135deg, #065f46, #10b981)' }}>
                                    <div className="book-spine" style={{ background: 'rgba(0,0,0,0.2)' }}></div>
                                    <div className="book-card-icon-wrapper">
                                        <Truck size={48} color="rgba(255,255,255,0.9)" />
                                    </div>
                                    <h3>International Freight Logistics</h3>
                                    <span className="book-tag">Route Optimization</span>
                                </div>
                                <div className="book-card-back">
                                    <div className="book-spine" style={{ background: '#10b981' }}></div>
                                    <p>Expert customs clearing, freight forwarding, and complete oceanic container management for on-time delivery across 50+ countries.</p>
                                    <ul className="book-details">
                                        <li>✦ 20FT &amp; 40FT Container Mgmt</li>
                                        <li>✦ Customs Documentation</li>
                                        <li>✦ Real-Time Cargo Tracking</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;

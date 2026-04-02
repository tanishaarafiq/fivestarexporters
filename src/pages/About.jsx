import React from 'react';
import { User, BookOpen, Target, Lightbulb, TrendingUp, Users } from 'lucide-react';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            {/* Page Header */}
            <section className="page-header animate-fade-up">
                <div className="container">
                    <h1 className="page-title">Our Strategic Legacy</h1>
                    <p className="page-subtitle">Pioneering Excellence in Powerloom Engineering</p>
                </div>
            </section>

            {/* Institution & Consultant Info */}
            <section className="section bg-white">
                <div className="container">
                    <div className="grid-2-col">
                        <div className="info-card animate-zoom">
                            <div className="info-icon"><BookOpen size={40} /></div>
                            <h2>Academic Foundation</h2>
                            <p className="info-text">
                                <strong>Kongu Engineering College</strong><br />
                                Department of Software Systems / CT-PG<br />
                                A synergy of academic brilliance and industrial application.
                            </p>
                        </div>
                        <div className="info-card animate-zoom" style={{ animationDelay: '0.2s' }}>
                            <div className="info-icon"><Users size={40} /></div>
                            <h2>Industrial Consultant</h2>
                            <p className="info-text">
                                <strong>Five Star Exporters</strong><br />
                                The global standard in powerloom spare parts export.<br />
                                Perundurai, Tamil Nadu — Bridging global markets.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision, Mission, Problem */}
            <section className="section bg-light">
                <div className="container">
                    <div className="vision-mission-grid">
                        <div className="vm-card animate-fade-up">
                            <Target className="vm-icon" size={48} />
                            <h3>Vision 2030</h3>
                            <p>To redefine the global powerloom resource landscape through decentralized digital intelligence and precision logistics.</p>
                        </div>
                        <div className="vm-card animate-fade-up" style={{ animationDelay: '0.2s' }}>
                            <Lightbulb className="vm-icon" size={48} />
                            <h3>The Mission</h3>
                            <p>Engineering a high-integrity procurement ecosystem that guarantees zero-latency export management and technical fidelity.</p>
                        </div>
                        <div className="vm-card animate-fade-up" style={{ animationDelay: '0.4s' }}>
                            <TrendingUp className="vm-icon" size={48} />
                            <h3>Industrial Imperative</h3>
                            <p>Transitioning from antiquated manual workflows to a 100% digital, predictive infrastructure to meet global industrial demand.</p>
                        </div>
                    </div>

                    <div className="problem-statement mt-50 animate-fade-up">
                        <h3>Strategic Problem Statement</h3>
                        <p>
                            Historically, Five Star Exporters operated on localized, manual systems prone to operational
                            asymmetry and data fragmentation. The global textile market demands real-time responsiveness.
                            Our platform serves as the central intelligence node to resolve these legacy inefficiencies.
                        </p>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="section bg-white team-section-container">
                <div className="container">
                    <h2 className="section-title animate-fade-up">Project Command Team</h2>
                    <div className="team-grid">
                        {/* Guide */}
                        <div className="team-card guide-card animate-zoom">
                            <div className="member-avatar">
                                <User size={70} />
                            </div>
                            <h3>Mrs. Karthika K</h3>
                            <p className="member-role">Strategic Lead / Asst. Professor</p>
                            <p className="member-dept">Knowledge Partner: Dept of CT-PG</p>
                        </div>

                        {/* Team Members */}
                        {[
                            { name: "Akshaya J", role: "Specialist (23ISR003)", dept: "Software Systems" },
                            { name: "Tanisha Hafnaa H M", role: "Specialist (23ISR058)", dept: "Software Systems" },
                            { name: "Dharani Dharan P", role: "Specialist (23ISR011)", dept: "Software Systems" }
                        ].map((m, i) => (
                            <div className="team-card animate-fade-up" key={i} style={{ animationDelay: `${(i + 1) * 0.2}s` }}>
                                <div className="member-avatar">
                                    <User size={60} />
                                </div>
                                <h3>{m.name}</h3>
                                <p className="member-role">{m.role}</p>
                                <p className="member-dept">{m.dept}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;

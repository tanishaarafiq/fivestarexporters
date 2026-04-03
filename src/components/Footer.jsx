import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-column">
                    <h3 className="footer-title">Five Star Exporters</h3>
                    <p className="footer-desc">
                        The global benchmark in powerloom spare parts consultancy.
                        Engineering high-performance connections between precision manufacturers
                        and the international textile industry.
                    </p>
                    <div className="social-icons">
                        <a href="#" className="social-icon"><Facebook size={20} /></a>
                        <a href="#" className="social-icon"><Twitter size={20} /></a>
                        <a href="#" className="social-icon"><Linkedin size={20} /></a>
                        <a href="#" className="social-icon"><Instagram size={20} /></a>
                    </div>
                </div>

                <div className="footer-column">
                    <h3 className="footer-title">Quick Links</h3>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/catalogue">Catalogue</Link></li>
                        <li><Link to="/modules">Our Modules</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3 className="footer-title">Contact Info</h3>
                    <ul className="footer-contact">
                        <li>
                            <a href="https://maps.app.goo.gl/FCd92VEV4n3S3YZT9" target="_blank" rel="noopener noreferrer" className="footer-contact-link">
                                <MapPin size={18} className="contact-icon" />
                                <span>Perundurai, Erode, Tamil Nadu, India</span>
                            </a>
                        </li>
                        <li>
                            <a href="tel:+917539923567" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'inherit', textDecoration: 'none' }}>
                                <Phone size={18} className="contact-icon" />
                                <span>+91 75399 23567</span>
                            </a>
                        </li>
                        <li>
                            <a href="sms:+917539923567" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'inherit', textDecoration: 'none', opacity: 0.8 }}>
                                <MessageCircle size={16} className="contact-icon" />
                                <span style={{ fontSize: '0.85rem' }}>Send a Text Message</span>
                            </a>
                        </li>
                        <li>
                            <Mail size={18} className="contact-icon" />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span>fivestarexporterss@gmail.com</span>
                                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Alt: 5starexporters@gmail.com</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Five Star Exporters. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

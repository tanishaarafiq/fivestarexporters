import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
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
                            <Phone size={18} className="contact-icon" />
                            <span>+91 98765 43210</span>
                        </li>
                        <li>
                            <Mail size={18} className="contact-icon" />
                            <span>info@fivestarexporters.com</span>
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

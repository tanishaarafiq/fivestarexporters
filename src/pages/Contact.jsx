import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, ChevronDown, Send } from 'lucide-react';
import { enquiryAPI } from '../api';
import './Contact.css';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = {
            firstName: e.target.firstName.value,
            lastName: e.target.lastName.value,
            email: e.target.email.value,
            subject: e.target.subject.value,
            message: e.target.message.value,
        };

        try {
            await enquiryAPI.submit(formData);
            setSubmitted(true);
            e.target.reset();
        } catch (err) {
            setError(err.message || 'Failed to submit enquiry');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page container section">
            <div className="contact-grid">
                {/* Contact Info */}
                <div className="contact-info-panel animate-fade-up">
                    <h1 className="page-title">Direct Strategic Support</h1>
                    <p className="contact-desc">
                        Our specialized textile engineering consultants are ready to assist with your global
                        spare parts requirements and technical specifications.
                    </p>

                    <div className="contact-details">
                        <a href="https://maps.app.goo.gl/FCd92VEV4n3S3YZT9" target="_blank" rel="noopener noreferrer" className="contact-item link-item">
                            <div className="icon-box"><MapPin size={24} /></div>
                            <div>
                                <h3>Operational Headquarters</h3>
                                <p>Five Star Exporters,<br />123 Industrial Estate,<br />Perundurai, Erode - 638052,<br />Tamil Nadu, India.</p>
                            </div>
                        </a>

                        <div className="contact-item">
                            <div className="icon-box"><Phone size={24} /></div>
                            <div>
                                <h3>Global Export Hotlines</h3>
                                <p>+91 98765 43210 (International Sales)<br />+91 98765 43211 (Technical Support)</p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <div className="icon-box"><Mail size={24} /></div>
                            <div>
                                <h3>Strategic Communication</h3>
                                <p>sales@fivestarexporters.com<br />logistics@fivestarexporters.com</p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <div className="icon-box"><Clock size={24} /></div>
                            <div>
                                <h3>Business Operations</h3>
                                <p>Monday - Saturday: 09:00 - 18:00 IST<br />Digital Support: 24/7</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enquiry Form */}
                <div className="enquiry-form-panel animate-zoom">
                    <h2>Submit Strategic Enquiry</h2>

                    {submitted && (
                        <div className="submission-success">
                            ✅ Strategic enquiry transmitted. Our experts will respond within 24 business hours.
                        </div>
                    )}

                    {error && (
                        <div className="submission-error">
                            ❌ Transmission error: {error}
                        </div>
                    )}

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name</label>
                                <input type="text" name="firstName" placeholder="e.g. Rahul" required />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input type="text" name="lastName" placeholder="e.g. Sharma" required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Corporate Email</label>
                            <input type="email" name="email" placeholder="rahul@enterprise.com" required />
                        </div>
                        <div className="form-group">
                            <label>Strategic Subject</label>
                            <select name="subject">
                                <option>Bulk Procurement Enquiry</option>
                                <option>Technical OEM Support</option>
                                <option>Logistic & Export Routing</option>
                                <option>Strategic Partnership</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Detailed Message</label>
                            <textarea name="message" placeholder="Provide technical details or specific part requirements..." rows="5" required></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            <Send size={18} /> {loading ? 'Transmitting...' : 'Initiate Enquiry'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Google Maps Embed */}
            <div className="map-section animate-fade-up">
                <div className="map-container-live">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15654.556481156!2d77.581566!3d11.2721!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba9131651717469%3A0xc3af87c47d770f6d!2sPerundurai%20SIPCOT%20Industrial%20Estate!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                        width="100%"
                        height="450"
                        style={{ border: 0, borderRadius: '20px' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Five Star Exporters Headquarters"
                    ></iframe>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="faq-section">
                <h2 className="section-title text-center animate-fade-up">Expert Knowledge Base</h2>
                <div className="faq-grid">
                    {[
                        { q: "Global Export Reach", a: "We facilitate precision-grade exports to over 50 nations with specialized logistics for industrial components." },
                        { q: "Technical Interoperability", a: "Our spare parts are engineered for seamless integration with OEM powerloom machinery globally." },
                        { q: "Financial Compliance", a: "We utilize internationally recognized payment gateways ensuring regulatory transparency and transaction security." },
                        { q: "Custom Engineering", a: "Our strategic manufacturing division can execute bespoke part production based on specific industrial blueprints." }
                    ].map((faq, index) => (
                        <div className="faq-card animate-fade-up" key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="faq-question">
                                <h3><MessageCircle size={20} className="faq-icon" /> {faq.q}</h3>
                            </div>
                            <p className="faq-answer">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Contact;

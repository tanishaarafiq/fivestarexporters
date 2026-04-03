import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { authAPI } from '../api';
import './Login.css'; // Reuse login styles

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authAPI.forgotPassword(email);
            setSubmitted(true);
        } catch (err) {
            setError(err.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="login-page">
                <div className="login-container">
                    <div className="login-card text-center" style={{ padding: '40px' }}>
                        <div className="success-icon" style={{ color: '#10b981', marginBottom: '20px' }}>
                            <CheckCircle size={60} />
                        </div>
                        <h2 className="login-title">Check Your Email</h2>
                        <p className="login-subtitle">
                           If an account exists for <strong>{email}</strong>, we've sent instructions to reset your strategic password.
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '15px' }}>
                            Please check your spam folder if you don't receive it within a few minutes.
                        </p>
                        <Link to="/login" className="btn btn-primary" style={{ width: '100%', marginTop: '30px' }}>
                            Return to Command Center
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h2 className="login-title">Strategic Recovery</h2>
                        <p className="login-subtitle">Enter your email to initiate password reset protocol</p>
                    </div>

                    {error && <div className="login-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label>Registered Email Address</label>
                            <div className="input-with-icon">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            style={{ width: '100%', marginTop: '10px' }}
                            disabled={loading}
                        >
                            {loading ? <span className="loader-spin"></span> : (
                                <>
                                    <Send size={18} /> Send Reset Link
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <Link to="/login" className="back-link">
                            <ArrowLeft size={16} /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

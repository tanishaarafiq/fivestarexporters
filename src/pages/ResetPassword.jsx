import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle } from 'lucide-react';
import { authAPI } from '../api';
import './Login.css'; // Use unified auth styling

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Strategic passwords must match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters for security.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await authAPI.resetPassword(token, password);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Token expired or invalid protocol.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="login-page">
                <div className="login-container">
                    <div className="login-card text-center" style={{ padding: '40px' }}>
                        <div className="success-icon" style={{ color: '#10b981', marginBottom: '20px' }}>
                            <CheckCircle size={60} />
                        </div>
                        <h2 className="login-title">Protocol Complete</h2>
                        <p className="login-subtitle">
                            Your password has been successfully reset. You can now access your Command Center with the new credentials.
                        </p>
                        <Link to="/login" className="btn btn-primary" style={{ width: '100%', marginTop: '30px' }}>
                            Return to Login
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
                        <h2 className="login-title">Reset Strategic Password</h2>
                        <p className="login-subtitle">Securing your access with new credentials</p>
                    </div>

                    {error && <div className="login-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label>New Strategic Password</label>
                            <div className="input-with-icon">
                                <Lock size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <div className="input-with-icon">
                                <Lock size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                                    <ShieldCheck size={18} /> Update Strategic Access
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;

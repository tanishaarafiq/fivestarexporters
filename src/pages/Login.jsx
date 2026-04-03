import React, { useState } from 'react';
import { Mail, Lock, User, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import './Login.css';

const Login = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            if (isLogin) {
                // LOGIN — call backend API
                const data = await authAPI.login({ email, password });
                onLogin(data);

                if (data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                // REGISTRATION — call backend API
                const name = e.target.name.value;
                const company = e.target.company ? e.target.company.value : '';

                await authAPI.register({ name, email, password, company });

                alert("Registration Successful! Please Login.");
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page section">
            <div className="login-container">
                <div className="login-header">
                    <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                    <p>{isLogin ? 'Login to access your dashboard' : 'Join us to start exporting'}</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-with-icon">
                                <User size={18} />
                                <input type="text" name="name" placeholder="John Doe" required />
                            </div>
                        </div>
                    )}

                    {!isLogin && (
                        <div className="form-group">
                            <label>Company Name</label>
                            <div className="input-with-icon">
                                <Briefcase size={18} />
                                <input type="text" name="company" placeholder="Exports Ltd." />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={18} />
                            <input type="email" name="email" placeholder="you@example.com" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} />
                            <input type="password" name="password" placeholder="••••••••" required minLength={6} />
                        </div>
                    </div>

                    {error && <p className="error-text" style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

                    {isLogin && (
                        <div className="forgot-password" style={{ marginBottom: '15px' }}>
                            <Link to="/forgot-password" style={{ color: 'var(--color-accent-dark)', fontSize: '0.85rem', fontWeight: '600' }}>Forgot Strategic Password?</Link>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button className="toggle-btn" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

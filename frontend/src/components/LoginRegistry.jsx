import React, { useState } from 'react';
import { authService } from '../services/api';
import { X, Mail, Lock, User, LogIn, UserPlus, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

const LoginRegistry = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'CUSTOMER'
    });
    const [successMsg, setSuccessMsg] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                const response = await authService.login({
                    email: formData.email,
                    password: formData.password
                });
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user || response.data));
                setSuccessMsg('Login successful! Redirecting...');
                setTimeout(() => {
                    onLoginSuccess(response.data.user || response.data);
                }, 1000);
            } else {
                await authService.register(formData);
                setSuccessMsg('Registration successful! You can now login.');
                setIsLogin(true);
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.response?.data?.message || err.response?.data || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay animate-fade-in" onClick={onClose}>
            <div className="auth-modal card glass" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}><X size={20} /></button>

                <div className="auth-header">
                    <div className="icon-badge">
                        {isLogin ? <LogIn size={24} /> : <UserPlus size={24} />}
                    </div>
                    <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p>{isLogin ? 'Login to manage your bookings' : 'Join Tikitt for a premium experience'}</p>
                </div>

                {error && (
                    <div className="auth-error animate-shake">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {successMsg && (
                    <div className="auth-success animate-fade-in">
                        <ShieldCheck size={16} />
                        <span>{successMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="input-group">
                            <label><User size={14} /> Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    )}
                    <div className="input-group">
                        <label><Mail size={14} /> Email Address</label>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label><Lock size={14} /> Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="input-group">
                            <label><User size={14} /> Phone Number</label>
                            <input
                                type="tel"
                                placeholder="Enter 10-digit number"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>
                    )}

                    <button type="submit" className="btn-primary w-full" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button className="btn-text" onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                            setSuccessMsg('');
                        }}>
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginRegistry;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Shield, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Agent');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
                role
            });

            if (res.data.success) {
                setSuccess('Registration successful! Redirecting to login page...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            if (!err.response) {
                setError('Cannot connect to API server. Please ensure the backend is running at http://localhost:5000.');
            } else {
                setError(err.response.data?.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5 col-xl-4">
                        
                        {/* Simple Branding */}
                        <div className="text-center mb-4">
                            <h2 className="fw-bold mb-1" style={{ color: '#212529' }}>
                                LeadFlow
                            </h2>
                            <p className="text-muted small">
                                Create a New Account
                            </p>
                        </div>

                        {/* Simple Card */}
                        <div className="card shadow-sm border p-4 bg-white">
                            <div className="card-body p-0">
                                <h5 className="fw-bold mb-4 text-center">
                                    Register
                                </h5>

                                {error && (
                                    <div className="alert alert-danger d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                                        <AlertCircle size={18} className="flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {success && (
                                    <div className="alert alert-success d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                                        <CheckCircle size={18} className="flex-shrink-0" />
                                        <span>{success}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label mb-1">Full Name</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <User size={18} className="text-muted" />
                                            </span>
                                            <input 
                                                type="text" 
                                                className="form-control border-start-0" 
                                                required 
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label mb-1">Email Address</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <Mail size={18} className="text-muted" />
                                            </span>
                                            <input 
                                                type="email" 
                                                className="form-control border-start-0" 
                                                required 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label mb-1">Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <Lock size={18} className="text-muted" />
                                            </span>
                                            <input 
                                                type="password" 
                                                className="form-control border-start-0" 
                                                required 
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label mb-1">Account Role</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <Shield size={18} className="text-muted" />
                                            </span>
                                            <select
                                                className="form-select border-start-0"
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                            >
                                                <option value="Agent">Agent</option>
                                                <option value="Manager">Manager</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                                                <span>Registering...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Register Account</span>
                                                <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-4 pt-3 border-top text-center">
                                    <p className="text-muted small mb-0">
                                        Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Sign In</Link>
                                    </p>
                                </div>

                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

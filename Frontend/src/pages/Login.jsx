import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, Cpu, Sparkles, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            if (!err.response) {
                setError('Cannot connect to API server. Please ensure the backend is running at http://localhost:5000 and your MySQL database is online.');
            } else {
                setError(err.response.data?.message || 'Invalid email or password.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="position-relative min-vh-100 d-flex align-items-center justify-content-center overflow-hidden py-5">
            {/* Animated Bright Mesh gradient blobs - No Black Background */}
            <div className="mesh-bg"></div>
            <div className="orb orb-indigo"></div>
            <div className="orb orb-teal"></div>

            <div className="container position-relative" style={{ zIndex: 1 }}>
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 col-xl-5">
                        
                        {/* Premium Light-Themed AI Branding */}
                        <div className="text-center mb-4">
                            <div className="d-inline-flex p-3 rounded-circle bg-white shadow-sm mb-3 border border-white border-opacity-75">
                                <Cpu size={36} className="text-gradient" />
                            </div>
                            <h2 className="fw-extrabold mb-1" style={{ color: '#1e293b', fontSize: '2.2rem' }}>
                                LeadFlow <span className="text-gradient fw-bold">AI</span>
                            </h2>
                            <p className="text-secondary mb-0" style={{ fontSize: '1.05rem', fontWeight: '500' }}>
                                Next-Gen Intelligent Routing & Lead Orchestration
                            </p>
                        </div>

                        {/* White Glassmorphism Card (No Black/Dark Elements) */}
                        <div className="card glass-panel border-0 rounded-4 shadow-lg p-4 p-md-5">
                            <div className="card-body p-0">
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <Sparkles size={20} className="text-gradient" />
                                    <span className="text-uppercase tracking-wider fw-bold text-secondary" style={{ fontSize: '0.95rem' }}>
                                        Secure Access Console
                                    </span>
                                </div>

                                {error && (
                                    <div className="alert alert-danger d-flex align-items-center gap-2 bg-danger bg-opacity-10 border-danger border-opacity-25 text-danger rounded-3 p-3 mb-4" style={{ fontSize: '1.05rem' }}>
                                        <AlertCircle size={22} className="flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="form-label small fw-bold mb-2">Email Address</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0 border-opacity-75 border-light" style={{ borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                                                <Mail size={20} className="text-secondary" />
                                            </span>
                                            <input 
                                                type="email" 
                                                className="form-control cyber-input border-start-0" 
                                                required 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="admin@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label small fw-bold mb-2">Security Keyphrase</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0 border-opacity-75 border-light" style={{ borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                                                <Lock size={20} className="text-secondary" />
                                            </span>
                                            <input 
                                                type="password" 
                                                className="form-control cyber-input border-start-0" 
                                                required 
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        className="btn btn-gradient w-100 py-3 rounded-3 d-flex align-items-center justify-content-center gap-2 shadow"
                                        disabled={loading}
                                        style={{ fontSize: '1.05rem' }}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                                                <span>Accessing Node...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Initialize Session</span>
                                                <ArrowRight size={20} />
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Interactive Demo Credentials with bright elements */}
                                <div className="mt-4 pt-4 border-top border-light text-center">
                                    <p className="text-secondary small mb-3" style={{ fontSize: '0.95rem', fontWeight: '500' }}>
                                        Quick Verification Environments
                                    </p>
                                    <div className="d-flex flex-wrap justify-content-center gap-2">
                                        <button 
                                            type="button"
                                            className="btn btn-light bg-white border border-opacity-50 border-secondary-subtle px-3 py-2 text-secondary rounded-pill"
                                            onClick={() => { setEmail('admin@example.com'); setPassword('pass123'); }}
                                            style={{ fontSize: '0.95rem', fontWeight: '600' }}
                                        >
                                            Demo Admin
                                        </button>
                                        <button 
                                            type="button"
                                            className="btn btn-light bg-white border border-opacity-50 border-secondary-subtle px-3 py-2 text-secondary rounded-pill"
                                            onClick={() => { setEmail('manager1@example.com'); setPassword('pass123'); }}
                                            style={{ fontSize: '0.95rem', fontWeight: '600' }}
                                        >
                                            Demo Manager
                                        </button>
                                        <button 
                                            type="button"
                                            className="btn btn-light bg-white border border-opacity-50 border-secondary-subtle px-3 py-2 text-secondary rounded-pill"
                                            onClick={() => { setEmail('agent1@example.com'); setPassword('pass123'); }}
                                            style={{ fontSize: '0.95rem', fontWeight: '600' }}
                                        >
                                            Demo Agent
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Lock, Shield, PlusCircle, AlertCircle, CheckCircle, Search, Users, Calendar } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    // User Creation Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Agent');
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setFormLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/users', {
                name,
                email,
                password,
                role
            });

            if (res.data.success) {
                setSuccess(`${role} registered successfully!`);
                setName('');
                setEmail('');
                setPassword('');
                setRole('Agent');
                fetchUsers();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user. Please try again.');
        } finally {
            setFormLoading(false);
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ color: '#212529' }}>
            <div className="mb-4">
                <h3 className="fw-bold text-dark">User Management</h3>
                <p className="text-muted">Create and manage your organization's Managers and Agents.</p>
            </div>

            <div className="row g-4">
                {/* Users List Column */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border h-100">
                        <div className="card-body p-4 p-md-5">
                            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                                <h5 className="m-0 fw-bold d-flex align-items-center gap-2">
                                    <Users size={20} className="text-primary" /> Active Users
                                </h5>
                                <div className="input-group style-search" style={{ maxWidth: '300px' }}>
                                    <span className="input-group-text bg-white border-end-0 border-opacity-75">
                                        <Search size={18} className="text-secondary" />
                                    </span>
                                    <input 
                                        type="text" 
                                        className="form-control border-start-0" 
                                        placeholder="Search users..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="text-secondary text-uppercase small" style={{ borderBottom: '2px solid rgba(99,102,241,0.1)' }}>
                                        <tr>
                                            <th style={{ fontSize: '0.9rem', fontWeight: '700' }}>Name</th>
                                            <th style={{ fontSize: '0.9rem', fontWeight: '700' }}>Email Address</th>
                                            <th style={{ fontSize: '0.9rem', fontWeight: '700' }}>Account Role</th>
                                            <th style={{ fontSize: '0.9rem', fontWeight: '700' }}>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-secondary">
                                                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                                                    Loading users list...
                                                </td>
                                            </tr>
                                        ) : filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-secondary">
                                                    No users found matching your search.
                                                </td>
                                            </tr>
                                        ) : filteredUsers.map(u => (
                                            <tr key={u.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                                <td>
                                                    <span className="fw-bold" style={{ fontSize: '1.05rem', color: '#1e293b' }}>{u.name}</span>
                                                </td>
                                                <td>
                                                    <span className="text-secondary" style={{ fontSize: '1rem' }}>{u.email}</span>
                                                </td>
                                                <td>
                                                    <span className={`badge px-3 py-2 ${
                                                        u.role === 'Admin' ? 'bg-danger bg-opacity-10 text-danger' : 
                                                        u.role === 'Manager' ? 'bg-warning bg-opacity-10 text-warning' : 
                                                        'bg-success bg-opacity-10 text-success'
                                                    }`} style={{ fontSize: '0.85rem', fontWeight: '600' }}>{u.role}</span>
                                                </td>
                                                <td className="small text-secondary" style={{ fontSize: '0.95rem' }}>
                                                    <div className="d-flex align-items-center gap-1">
                                                        <Calendar size={14} />
                                                        {new Date(u.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create User Column */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                <PlusCircle size={20} className="text-primary" /> Create User
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

                            <form onSubmit={handleCreateUser}>
                                <div className="mb-3">
                                    <label className="form-label mb-1 small fw-bold">Full Name</label>
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
                                            placeholder="Jane Doe"
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label mb-1 small fw-bold">Email Address</label>
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
                                            placeholder="jane@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label mb-1 small fw-bold">Password</label>
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
                                    <label className="form-label mb-1 small fw-bold">Account Role</label>
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
                                        </select>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-bold"
                                    disabled={formLoading}
                                >
                                    {formLoading ? (
                                        <>
                                            <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                                            <span>Creating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Create User Account</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;

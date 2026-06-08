import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Save, X, Phone, Mail, User, Shield, MessageSquare, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LeadForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [agents, setAgents] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        source: 'Website',
        status: 'New',
        notes: '',
        assigned_to: ''
    });

    useEffect(() => {
        if (id) {
            const fetchLead = async () => {
                try {
                    const res = await axios.get(`http://localhost:5000/api/leads/${id}`);
                    setFormData({
                        name: res.data.name || '',
                        email: res.data.email || '',
                        phone: res.data.phone || '',
                        source: res.data.source || 'Website',
                        status: res.data.status || 'New',
                        notes: res.data.notes || '',
                        assigned_to: res.data.assigned_to || ''
                    });
                } catch (error) {
                    console.error('Error fetching lead:', error);
                }
            };
            fetchLead();
        }

        if (user?.role === 'Manager') {
            const fetchAgents = async () => {
                try {
                    const res = await axios.get('http://localhost:5000/api/users/agents');
                    setAgents(res.data);
                } catch (error) {
                    console.error('Error fetching agents:', error);
                }
            };
            fetchAgents();
        }
    }, [id, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let payload = { ...formData };
            // Agents can only submit status changes
            if (user?.role === 'Agent') {
                payload = { status: formData.status };
            } else {
                // If assigned_to is empty string, make it null
                if (payload.assigned_to === '') {
                    payload.assigned_to = null;
                }
            }

            if (id) {
                await axios.put(`http://localhost:5000/api/leads/${id}`, payload);
            } else {
                await axios.post('http://localhost:5000/api/leads', payload);
            }
            navigate('/leads');
        } catch (error) {
            alert('Error saving lead: ' + error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-lg-8">
                <div className="card border shadow-sm">
                    <div className="card-header bg-white border-bottom py-3">
                        <h4 className="m-0 fw-bold">{id ? 'Edit Lead' : 'Create New Lead'}</h4>
                    </div>
                    <div className="card-body p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Full Name</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><User size={18} className="text-muted"/></span>
                                        <input 
                                            type="text" className="form-control" required
                                            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            disabled={user?.role === 'Agent'}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Email Address</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><Mail size={18} className="text-muted"/></span>
                                        <input 
                                            type="email" className="form-control" required
                                            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            disabled={user?.role === 'Agent'}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Phone Number</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><Phone size={18} className="text-muted"/></span>
                                        <input 
                                            type="text" className="form-control" required
                                            value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            disabled={user?.role === 'Agent'}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Lead Source</label>
                                    <select 
                                        className="form-select bg-light"
                                        value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})}
                                        disabled={user?.role === 'Agent'}
                                    >
                                        <option value="Website">Website</option>
                                        <option value="Referral">Referral</option>
                                        <option value="Cold Call">Cold Call</option>
                                        <option value="Social Media">Social Media</option>
                                    </select>
                                </div>
                                {id && (
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Status</label>
                                        <select 
                                            className="form-select bg-light"
                                            value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
                                        >
                                            <option value="New">New</option>
                                            <option value="Contacted">Contacted</option>
                                            <option value="Qualified">Qualified</option>
                                            <option value="Lost">Lost</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                    </div>
                                )}
                                {user?.role === 'Manager' && (
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Assigned Agent</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light"><Shield size={18} className="text-muted"/></span>
                                            <select 
                                                className="form-select bg-light"
                                                value={formData.assigned_to || ''} 
                                                onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
                                            >
                                                <option value="">Unassigned (Round-Robin Auto Assign)</option>
                                                {agents.map(agent => (
                                                    <option key={agent.id} value={agent.id}>
                                                        {agent.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                                <div className="col-12">
                                    <label className="form-label small fw-bold">Internal Notes</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><MessageSquare size={18} className="text-muted"/></span>
                                        <textarea 
                                            className="form-control" rows="4"
                                            value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                            disabled={user?.role === 'Agent'}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 d-flex gap-2">
                                <button type="submit" className="btn btn-primary px-4 fw-bold d-flex align-items-center gap-2" disabled={loading}>
                                    <Save size={18}/> {loading ? 'Saving...' : 'Save Lead'}
                                </button>
                                <button type="button" className="btn btn-light px-4 fw-bold d-flex align-items-center gap-2" onClick={() => navigate('/leads')}>
                                    <X size={18}/> Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadForm;

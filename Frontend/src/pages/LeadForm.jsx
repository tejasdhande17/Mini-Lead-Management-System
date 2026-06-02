import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Save, X, Phone, Mail, User, Info, MessageSquare } from 'lucide-react';

const LeadForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        source: 'Website',
        status: 'New',
        notes: ''
    });

    useEffect(() => {
        if (id) {
            const fetchLead = async () => {
                const res = await axios.get(`http://localhost:5000/api/leads/${id}`);
                setFormData(res.data);
            };
            fetchLead();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await axios.put(`http://localhost:5000/api/leads/${id}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/leads', formData);
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
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0 py-3">
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
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Lead Source</label>
                                    <select 
                                        className="form-select bg-light"
                                        value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})}
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
                                <div className="col-12">
                                    <label className="form-label small fw-bold">Internal Notes</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><MessageSquare size={18} className="text-muted"/></span>
                                        <textarea 
                                            className="form-control" rows="4"
                                            value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}
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

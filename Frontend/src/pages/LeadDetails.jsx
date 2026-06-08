import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User, Phone, Mail, Clock, Calendar, Edit2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LeadDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeadDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/leads/${id}`);
                setLead(res.data);
            } catch (error) {
                console.error('Error fetching lead details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeadDetails();
    }, [id]);

    if (loading) return <div className="text-center py-5">Loading lead details...</div>;
    if (!lead) return <div className="alert alert-danger">Lead not found.</div>;

    return (
        <div>
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <Link to="/leads" className="btn btn-link text-decoration-none d-flex align-items-center gap-2 p-0 text-muted fw-semibold">
                    <ArrowLeft size={18}/> Back to Leads
                </Link>
                {(user?.role === 'Manager' || (user?.role === 'Agent' && lead.assigned_to === user.id)) && (
                    <Link to={`/leads/edit/${lead.id}`} className="btn btn-primary d-flex align-items-center gap-2 fw-bold">
                        <Edit2 size={16}/> Edit Lead
                    </Link>
                )}
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card border shadow-sm mb-4">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                                <div>
                                    <h3 className="fw-bold mb-1">{lead.name}</h3>
                                    <span className="badge bg-light text-dark border">{lead.source}</span>
                                </div>
                                <span className={`badge rounded-pill px-3 py-2 ${
                                    lead.status === 'New' ? 'bg-info' : 
                                    lead.status === 'Closed' ? 'bg-success' : 
                                    'bg-secondary'
                                }`}>{lead.status}</span>
                            </div>

                            <h5 className="fw-bold mb-3 text-secondary small text-uppercase">Contact Information</h5>
                            <div className="row g-3 mb-4">
                                <div className="col-sm-6 d-flex align-items-center gap-3">
                                    <div className="p-2 bg-light rounded"><Mail size={18} className="text-muted"/></div>
                                    <div>
                                        <small className="text-muted d-block">Email</small>
                                        <span className="fw-semibold">{lead.email}</span>
                                    </div>
                                </div>
                                <div className="col-sm-6 d-flex align-items-center gap-3">
                                    <div className="p-2 bg-light rounded"><Phone size={18} className="text-muted"/></div>
                                    <div>
                                        <small className="text-muted d-block">Phone</small>
                                        <span className="fw-semibold">{lead.phone}</span>
                                    </div>
                                </div>
                            </div>

                            <h5 className="fw-bold mb-3 text-secondary small text-uppercase">Notes</h5>
                            <div className="p-3 bg-light rounded-3 mb-2">
                                <p className="mb-0 text-dark" style={{ whiteSpace: 'pre-line' }}>
                                    {lead.notes || 'No internal notes added yet.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card border shadow-sm">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                <Clock size={20} className="text-primary"/> Activity Logs
                            </h5>
                            <div className="position-relative ps-3 border-start">
                                {lead.activityLogs && lead.activityLogs.length > 0 ? (
                                    lead.activityLogs.map((log, idx) => (
                                        <div key={log.id} className="mb-4 position-relative">
                                            <div className="position-absolute bg-primary rounded-circle" style={{ left: '-22px', top: '4px', width: '10px', height: '10px' }}></div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h6 className="fw-bold mb-1">{log.action}</h6>
                                                <small className="text-muted">{new Date(log.created_at).toLocaleString()}</small>
                                            </div>
                                            <p className="text-muted mb-0 small">By {log.user_name || 'System'}</p>
                                            {log.details && (
                                                <div className="mt-2 p-2 bg-light rounded small">
                                                    <code className="text-dark">{log.details}</code>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted mb-0">No recorded activities.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border shadow-sm mb-4">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3 small text-uppercase text-secondary">Assignment & Ownership</h5>
                            <div className="d-flex align-items-center gap-3 py-2 border-bottom">
                                <div className="p-2 bg-primary bg-opacity-10 text-primary rounded"><User size={20}/></div>
                                <div>
                                    <small className="text-muted d-block">Assigned Agent</small>
                                    <span className="fw-bold">{lead.agent_name || 'Unassigned'}</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-3 py-2 mt-2">
                                <div className="p-2 bg-light rounded"><Calendar size={20} className="text-muted"/></div>
                                <div>
                                    <small className="text-muted d-block">Created On</small>
                                    <span className="fw-semibold">{new Date(lead.created_at).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDetails;

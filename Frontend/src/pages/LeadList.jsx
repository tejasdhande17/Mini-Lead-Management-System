import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Edit2, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LeadList = () => {
    const { user } = useAuth();
    const [leads, setLeads] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [filters, setFilters] = useState({ search: '', status: '', source: '' });
    const [loading, setLoading] = useState(true);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/leads', {
                params: { ...filters, page: pagination.page, limit: pagination.limit }
            });
            setLeads(res.data.leads);
            setPagination(prev => ({ ...prev, total: res.data.pagination.total, pages: res.data.pagination.pages }));
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [pagination.page, filters]);

    const handleSearchChange = (e) => {
        setFilters({ ...filters, search: e.target.value });
        setPagination({ ...pagination, page: 1 });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this lead?')) {
            try {
                await axios.delete(`http://localhost:5000/api/leads/${id}`);
                fetchLeads();
            } catch (error) {
                alert('Action failed: ' + error.response?.data?.message);
            }
        }
    };

    return (
        <div className="card shadow-sm border" style={{ color: '#212529' }}>
            <div className="card-body p-4 p-md-5">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                    <h4 className="m-0 fw-bold" style={{ color: '#212529' }}>Leads Management</h4>
                    <div className="d-flex gap-2 w-auto">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 border-opacity-75 border-light" style={{ borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                                <Search size={18} className="text-secondary" />
                            </span>
                            <input 
                                type="text" 
                                className="form-control border-start-0" 
                                placeholder="Search leads..." 
                                value={filters.search}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle" style={{ color: '#1e293b' }}>
                        <thead className="text-secondary text-uppercase small" style={{ borderBottom: '2px solid rgba(99,102,241,0.1)' }}>
                            <tr>
                                <th style={{ fontSize: '0.9rem', fontWeight: '700' }}>Name</th>
                                <th style={{ fontSize: '0.9rem', fontWeight: '700' }}>Contact</th>
                                <th style={{ fontSize: '0.9rem', fontWeight: '700' }}>Source</th>
                                <th style={{ fontSize: '0.9rem', fontWeight: '700' }}>Status</th>
                                <th style={{ fontSize: '0.9rem', fontWeight: '700' }}>Assigned To</th>
                                <th style={{ fontSize: '0.9rem', fontWeight: '700' }}>Created At</th>
                                <th className="text-end" style={{ fontSize: '0.9rem', fontWeight: '700' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="text-center py-5 text-secondary">Loading database records...</td></tr>
                            ) : leads.map(lead => (
                                <tr key={lead.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                    <td>
                                        <div className="fw-bold" style={{ fontSize: '1.05rem', color: '#1e293b' }}>{lead.name}</div>
                                        <small className="text-secondary" style={{ fontSize: '0.95rem' }}>{lead.email}</small>
                                    </td>
                                    <td className="text-secondary" style={{ fontSize: '1.05rem' }}>{lead.phone}</td>
                                    <td><span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-3 py-2 rounded" style={{ fontSize: '0.9rem' }}>{lead.source}</span></td>
                                    <td>
                                        <span className={`badge rounded-pill px-3 py-2 ${
                                            lead.status === 'New' ? 'bg-info bg-opacity-10 text-info' : 
                                            lead.status === 'Closed' ? 'bg-success bg-opacity-10 text-success' : 
                                            'bg-secondary bg-opacity-10 text-secondary'
                                        }`} style={{ fontSize: '0.9rem' }}>{lead.status}</span>
                                    </td>
                                    <td className="text-secondary" style={{ fontSize: '1.05rem' }}>{lead.agent_name || 'Unassigned'}</td>
                                    <td className="small text-secondary" style={{ fontSize: '1.05rem' }}>{new Date(lead.created_at).toLocaleDateString()}</td>
                                    <td className="text-end">
                                        <div className="btn-group">
                                            <Link to={`/leads/${lead.id}`} className="btn btn-sm btn-outline-primary px-3 py-2"><Eye size={16}/></Link>
                                            {(user?.role === 'Manager' || (user?.role === 'Agent' && lead.assigned_to === user.id)) && (
                                                <Link to={`/leads/edit/${lead.id}`} className="btn btn-sm btn-outline-secondary px-3 py-2"><Edit2 size={16}/></Link>
                                            )}
                                            {user?.role === 'Admin' && (
                                                <button onClick={() => handleDelete(lead.id)} className="btn btn-sm btn-outline-danger px-3 py-2"><Trash2 size={16}/></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4">
                    <small className="text-secondary" style={{ fontSize: '1.05rem', fontWeight: '500' }}>Showing {leads.length} of {pagination.total} leads</small>
                    <nav>
                        <ul className="pagination m-0 gap-1">
                            <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                                <button className="page-link bg-white border border-opacity-50 border-secondary-subtle text-secondary px-3 py-2 rounded-3" onClick={() => setPagination({...pagination, page: pagination.page - 1})}><ChevronLeft size={18}/></button>
                            </li>
                            <li className="page-item active"><span className="page-link bg-primary border-0 text-white px-3 py-2 rounded-3" style={{ fontSize: '1.05rem' }}>{pagination.page}</span></li>
                            <li className={`page-item ${pagination.page >= pagination.pages ? 'disabled' : ''}`}>
                                <button className="page-link bg-white border border-opacity-50 border-secondary-subtle text-secondary px-3 py-2 rounded-3" onClick={() => setPagination({...pagination, page: pagination.page + 1})}><ChevronRight size={18}/></button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default LeadList;

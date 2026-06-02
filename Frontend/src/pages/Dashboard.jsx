import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardCard = ({ title, value, icon: Icon, color }) => (
    <div className="card glass-panel border-0 shadow-sm h-100" style={{ color: '#1e293b' }}>
        <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h6 className="text-secondary small text-uppercase mb-2 fw-bold" style={{ fontSize: '0.9rem', trackingSpacing: '1px' }}>{title}</h6>
                    <h3 className="mb-0 fw-extrabold" style={{ fontSize: '1.8rem' }}>{value}</h3>
                </div>
                <div className={`p-3 rounded-3 bg-${color} bg-opacity-10 text-${color}`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total: 0, new: 0, closed: 0, qualified: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/leads');
                const leads = res.data.leads;
                setStats({
                    total: res.data.pagination.total,
                    new: leads.filter(l => l.status === 'New').length,
                    closed: leads.filter(l => l.status === 'Closed').length,
                    qualified: leads.filter(l => l.status === 'Qualified').length
                });
            } catch (error) {
                console.error(error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <div className="mb-4">
                <h3 className="fw-extrabold" style={{ color: '#1e293b', fontSize: '1.8rem' }}>
                    Welcome back, <span className="text-gradient">{user.name}</span>
                </h3>
                <p className="text-secondary" style={{ fontSize: '1.05rem', fontWeight: '500' }}>
                    Here is what's happening with your leads database today.
                </p>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-md-3">
                    <DashboardCard title="Total Leads" value={stats.total} icon={Users} color="primary" />
                </div>
                <div className="col-md-3">
                    <DashboardCard title="New Leads" value={stats.new} icon={Clock} color="info" />
                </div>
                <div className="col-md-3">
                    <DashboardCard title="Qualified" value={stats.qualified} icon={TrendingUp} color="warning" />
                </div>
                <div className="col-md-3">
                    <DashboardCard title="Closed Won" value={stats.closed} icon={CheckCircle} color="success" />
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card glass-panel border-0 shadow-sm p-4" style={{ color: '#1e293b' }}>
                        <h5 className="fw-bold mb-4" style={{ fontSize: '1.2rem' }}>Activity Overview</h5>
                        {/* Dynamic status helper */}
                        <p className="text-secondary" style={{ fontSize: '1.05rem' }}>
                            Lead routing pipeline metrics are synchronized. Active round-robin queue monitors are online.
                        </p>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card glass-panel border-0 shadow-sm p-4" style={{ color: '#1e293b' }}>
                        <h5 className="fw-bold mb-4" style={{ fontSize: '1.2rem' }}>Pending Actions</h5>
                        <ul className="list-group list-group-flush bg-transparent">
                            <li className="list-group-item bg-transparent border-light px-0 py-3 d-flex align-items-center gap-3" style={{ color: '#1e293b' }}>
                                <div className="p-2 bg-info bg-opacity-10 text-info rounded-circle"><Clock size={16}/></div>
                                <div>
                                    <p className="mb-0 small fw-bold" style={{ fontSize: '1.05rem' }}>Follow up with John Doe</p>
                                    <small className="text-secondary">2 hours ago</small>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

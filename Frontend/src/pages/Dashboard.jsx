import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardCard = ({ title, value, icon: Icon, color }) => (
    <div className="card border shadow-sm h-100">
        <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h6 className="text-muted small text-uppercase mb-2" style={{ fontSize: '0.85rem' }}>{title}</h6>
                    <h3 className="mb-0 fw-bold">{value}</h3>
                </div>
                <div className={`p-3 rounded bg-${color} bg-opacity-10 text-${color}`}>
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
                <h3 className="fw-bold text-dark">
                    Welcome back, {user.name}
                </h3>
                <p className="text-muted">
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
                    <div className="card shadow-sm border p-4 bg-white">
                        <h5 className="fw-bold mb-3">Activity Overview</h5>
                        <p className="text-muted mb-0">
                            Lead routing pipeline metrics are synchronized. Active round-robin queue monitors are online.
                        </p>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card shadow-sm border p-4 bg-white">
                        <h5 className="fw-bold mb-3">Pending Actions</h5>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item px-0 py-2 d-flex align-items-center gap-3 border-0 bg-transparent">
                                <div className="p-2 bg-info bg-opacity-10 text-info rounded"><Clock size={16}/></div>
                                <div>
                                    <p className="mb-0 fw-semibold text-dark">Follow up with John Doe</p>
                                    <small className="text-muted">2 hours ago</small>
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

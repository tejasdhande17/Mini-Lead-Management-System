import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, LogOut, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light glass-panel rounded-4 mt-3 mb-4 py-3 border border-white border-opacity-50">
      <div className="container">
        <Link className="navbar-brand fw-extrabold" to="/" style={{ color: '#1e293b', fontSize: '1.25rem' }}>
          LeadFlow <span className="text-gradient fw-bold">AI</span>
        </Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2">
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center gap-2 fw-semibold text-secondary" to="/dashboard" style={{ fontSize: '1.05rem' }}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center gap-2 fw-semibold text-secondary" to="/leads" style={{ fontSize: '1.05rem' }}>
                <Users size={18} /> Leads
              </Link>
            </li>
            {(user.role === 'Admin' || user.role === 'Manager') && (
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center gap-2 fw-semibold text-secondary" to="/leads/create" style={{ fontSize: '1.05rem' }}>
                  <PlusCircle size={18} /> Create Lead
                </Link>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center gap-3">
            <span className="fw-semibold text-secondary" style={{ fontSize: '1.05rem' }}>
              {user.name} <small className="badge bg-primary bg-opacity-10 text-primary ms-1" style={{ fontSize: '0.85rem' }}>{user.role}</small>
            </span>
            <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2 fw-semibold px-3 py-2 rounded-3" onClick={handleLogout} style={{ fontSize: '0.95rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

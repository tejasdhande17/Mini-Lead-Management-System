import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeadList from './pages/LeadList';
import LeadForm from './pages/LeadForm';
import LeadDetails from './pages/LeadDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Layout/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-vh-100 bg-transparent">
          <Navbar />
          <div className="container py-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/leads" element={
                <ProtectedRoute>
                  <LeadList />
                </ProtectedRoute>
              } />
              <Route path="/leads/create" element={
                <ProtectedRoute roles={['Admin', 'Manager']}>
                  <LeadForm />
                </ProtectedRoute>
              } />
              <Route path="/leads/edit/:id" element={
                <ProtectedRoute>
                  <LeadForm />
                </ProtectedRoute>
              } />
              <Route path="/leads/:id" element={
                <ProtectedRoute>
                  <LeadDetails />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

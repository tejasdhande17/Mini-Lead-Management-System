import React from 'react';

// Disabling route security/guard for development & testing as requested
const ProtectedRoute = ({ children }) => {
  return children;
};

export default ProtectedRoute;

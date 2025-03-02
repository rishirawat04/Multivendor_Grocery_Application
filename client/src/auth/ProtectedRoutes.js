import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, role, loading } = useContext(AuthContext);
  
  
  const location = useLocation();

  if (loading) return null;  // Show loading spinner if needed

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    switch (role) {
      case 'Admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'Vendor':
        return <Navigate to="/vendor/dashboard" replace />;
      case 'User':
        return <Navigate to="/" replace />;
      default:
        return <Navigate to="/404" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;

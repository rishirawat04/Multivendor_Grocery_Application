import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const RedirectIfAuthenticated = ({ children }) => {
  const { user, role } = useContext(AuthContext);
  // console.log("link", user, role );
   
  if (user) {
    switch (role) {
      case 'Admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'Vendor':
        return <Navigate to="/vendor/dashboard" replace />;
      case 'User':
        return <Navigate to="/" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children; // If no user is logged in, allow access to login/register page
};

export default RedirectIfAuthenticated;

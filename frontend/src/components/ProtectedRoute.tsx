import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional: restrict this route to specific roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('jwt_token');

  // 1. If there is no token at all, kick them to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken: any = jwtDecode(token);
    
    // 2. Check if the token is expired
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      localStorage.removeItem('jwt_token'); // Clear the expired token
      return <Navigate to="/login" replace />;
    }

    // 3. If specific roles are required, check if the user has permission
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = decodedToken.role || decodedToken.authorities || '';
      if (!allowedRoles.includes(userRole)) {
        // User is logged in but trying to access a page they shouldn't (e.g. Buyer trying to access Admin)
        // Send them to their default layout or an unauthorized page
        return <Navigate to="/login" replace />; 
      }
    }

    // If they pass all checks, render the page!
    return <>{children}</>;

  } catch (error) {
    // If the token is somehow corrupted, kick them to login
    localStorage.removeItem('jwt_token');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
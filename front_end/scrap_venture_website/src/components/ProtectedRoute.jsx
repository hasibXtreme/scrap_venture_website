import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getStoredUser } from '../utils/api.js';

/**
 * ProtectedRoute Guard
 * Ensures only authenticated users with matching roles can view protected portal routes.
 * If unauthenticated or role unauthorized, redirects immediately to the appropriate login page.
 */
export default function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectPath = '/admin-login',
}) {
  const location = useLocation();
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getStoredUser());
    };

    window.addEventListener('authchange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('authchange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  if (!user) {
    // Save current path to state so login can redirect back if needed
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If logged in under the wrong role, redirect to appropriate login or dashboard
    if (user.role === 'admin' || user.role === 'moderator') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'scrap_collector' || user.role === 'collector') {
      return <Navigate to="/collector/dashboard" replace />;
    } else if (user.role === 'customer') {
      return <Navigate to="/customer/dashboard" replace />;
    }
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

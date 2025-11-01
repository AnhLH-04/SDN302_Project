import { Navigate } from 'react-router-dom';
import { isAdmin } from '../utils/auth';

// If current user is admin, force them to admin area
export default function AdminRedirect({ children }) {
  if (isAdmin()) return <Navigate to="/admin" replace />;
  return children;
}

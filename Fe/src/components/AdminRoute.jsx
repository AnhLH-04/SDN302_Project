import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../utils/auth';

function AdminRoute({ children }) {
  return isAuthenticated() && isAdmin() ? children : <Navigate to="/login" />;
}

export default AdminRoute;

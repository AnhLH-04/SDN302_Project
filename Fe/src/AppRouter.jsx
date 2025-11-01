import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/guest/HomePage';
import ProductsPage from './pages/guest/ProductsPage';
import ProductDetailPage from './pages/guest/ProductDetailPage';
import LoginPage from './pages/member/LoginPage';
import RegisterPage from './pages/member/RegisterPage';
import ProfilePage from './pages/member/ProfilePage';
import AddProductPage from './pages/member/AddProductPage';
import MyPostsPage from './pages/member/MyPostsPage';
import TransactionsPage from './pages/member/TransactionsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminPostsPage from './pages/admin/AdminPostsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminLayout from './pages/admin/AdminLayout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* Guest */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:type/:id" element={<ProductDetailPage />} />
          {/* Member */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <PrivateRoute>
                <AddProductPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-posts"
            element={
              <PrivateRoute>
                <MyPostsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <PrivateRoute>
                <TransactionsPage />
              </PrivateRoute>
            }
          />
          {/* Admin (nested with admin navbar) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="posts" element={<AdminPostsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
          </Route>
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;

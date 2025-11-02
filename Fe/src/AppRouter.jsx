import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/guest/HomePage';
import ProductsPage from './pages/guest/ProductsPage';
import ProductDetailPage from './pages/guest/ProductDetailPage';
import CompareVehiclesPage from './pages/guest/CompareVehiclesPage';
import CompareBatteriesPage from './pages/guest/CompareBatteriesPage';
import LoginPage from './pages/member/LoginPage';
import RegisterPage from './pages/member/RegisterPage';
import ProfilePage from './pages/member/ProfilePage';
import AddProductPage from './pages/member/AddProductPage';
import MyPostsPage from './pages/member/MyPostsPage';
import TransactionsPage from './pages/member/TransactionsPage';
import MyReviewsPage from './pages/member/MyReviewsPage';
import PaymentConfirmationPage from './pages/member/PaymentConfirmationPage';
import FavoritesPage from './pages/member/FavoritesPage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminPostsPage from './pages/admin/AdminPostsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminInventoryPage from './pages/admin/AdminInventoryPage';
import AdminBrandsPage from './pages/admin/AdminBrandsPage';
import AdminLayout from './pages/admin/AdminLayout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminRedirect from './components/AdminRedirect';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* Guest */}
          <Route
            path="/"
            element={
              <AdminRedirect>
                <HomePage />
              </AdminRedirect>
            }
          />
          <Route
            path="/products"
            element={
              <AdminRedirect>
                <ProductsPage />
              </AdminRedirect>
            }
          />
          <Route
            path="/product/:type/:id"
            element={
              <AdminRedirect>
                <ProductDetailPage />
              </AdminRedirect>
            }
          />
          <Route
            path="/compare/vehicles"
            element={
              <AdminRedirect>
                <CompareVehiclesPage />
              </AdminRedirect>
            }
          />
          <Route
            path="/compare/batteries"
            element={
              <AdminRedirect>
                <CompareBatteriesPage />
              </AdminRedirect>
            }
          />
          {/* Member */}
          <Route
            path="/login"
            element={
              <AdminRedirect>
                <LoginPage />
              </AdminRedirect>
            }
          />
          <Route
            path="/register"
            element={
              <AdminRedirect>
                <RegisterPage />
              </AdminRedirect>
            }
          />
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
              <AdminRedirect>
                <PrivateRoute>
                  <AddProductPage />
                </PrivateRoute>
              </AdminRedirect>
            }
          />
          <Route
            path="/my-posts"
            element={
              <AdminRedirect>
                <PrivateRoute>
                  <MyPostsPage />
                </PrivateRoute>
              </AdminRedirect>
            }
          />
          <Route
            path="/transactions"
            element={
              <AdminRedirect>
                <PrivateRoute>
                  <TransactionsPage />
                </PrivateRoute>
              </AdminRedirect>
            }
          />
          <Route
            path="/favorites"
            element={
              <AdminRedirect>
                <PrivateRoute>
                  <FavoritesPage />
                </PrivateRoute>
              </AdminRedirect>
            }
          />
          <Route
            path="/my-reviews"
            element={
              <PrivateRoute>
                <MyReviewsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment-confirmation"
            element={
              <PrivateRoute>
                <PaymentConfirmationPage />
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
            <Route path="profile" element={<ProfilePage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="posts" element={<AdminPostsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="inventory" element={<AdminInventoryPage />} />
            <Route path="brands" element={<AdminBrandsPage />} />
          </Route>
          {/* Alias: direct /inventory route redirects to admin inventory */}
          <Route path="/inventory" element={<Navigate to="/admin/inventory" replace />} />
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;

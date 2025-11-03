import { NavLink, Outlet } from 'react-router-dom';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.brand}>👑 Admin Panel</div>
        <div className={styles.links}>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/profile"
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            Hồ sơ của tôi
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            Người dùng
          </NavLink>
          <NavLink
            to="/admin/posts"
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            Tin đăng
          </NavLink>
          <NavLink
            to="/admin/brands"
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            Thương hiệu
          </NavLink>
          <NavLink
            to="/admin/reports"
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            Báo cáo
          </NavLink>
          <NavLink
            to="/admin/inventory"
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            Tồn kho
          </NavLink>
        </div>
      </nav>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

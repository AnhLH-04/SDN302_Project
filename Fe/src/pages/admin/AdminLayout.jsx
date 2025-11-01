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
            to="/admin/reports"
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            Báo cáo
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

import { useEffect, useState } from 'react';
import { fetchUsers, updateUserStatus, deleteUser } from '../../services/adminService';
import styles from './AdminUsersPage.module.css';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setLoading(true);
    setError('');
    fetchUsers()
      .then((res) => setUsers(res.data.data.users || []))
      .catch(() => setError('Không lấy được danh sách người dùng'))
      .finally(() => setLoading(false));
  };

  const handleBlock = async (id, isActive) => {
    try {
      await updateUserStatus(id, { isActive });
      setSuccess(`${isActive ? 'Mở khóa' : 'Khóa'} người dùng thành công!`);
      setTimeout(() => setSuccess(''), 3000);
      loadUsers();
    } catch {
      setError('Cập nhật trạng thái thất bại');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('⚠️ Bạn chắc chắn muốn xóa người dùng này?')) return;
    try {
      await deleteUser(id);
      setSuccess('Xóa người dùng thành công!');
      setTimeout(() => setSuccess(''), 3000);
      loadUsers();
    } catch {
      setError('Xóa người dùng thất bại');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className={styles['admin-users-container']}>
      <h1 className={styles['admin-users-title']}>👥 Quản lý người dùng</h1>
      <p className={styles['admin-users-subtitle']}>Quản lý và kiểm soát tài khoản người dùng</p>

      {error && <div className={styles['error-message']}>⚠️ {error}</div>}
      {success && <div className={styles['success-message']}>✅ {success}</div>}

      {loading ? (
        <div className={styles['loading-container']}>
          <span className={styles['loading-spinner']}></span>
          <p>Đang tải danh sách người dùng...</p>
        </div>
      ) : users.length === 0 ? (
        <div className={styles['empty-state']}>
          <p>😔 Không có người dùng nào</p>
        </div>
      ) : (
        <div className={styles['table-wrapper']}>
          <table className={styles['admin-users-table']}>
            <thead>
              <tr>
                <th>👤 Họ tên</th>
                <th>📧 Email</th>
                <th>🎭 Role</th>
                <th>📊 Trạng thái</th>
                <th>⚙️ Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className={styles['user-name']}>{u.name}</div>
                  </td>
                  <td>
                    <div className={styles['user-email']}>{u.email}</div>
                  </td>
                  <td>
                    <span
                      className={
                        u.role === 'admin' ? styles['role-badge-admin'] : styles['role-badge-user']
                      }
                    >
                      {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td>
                    <span
                      className={u.isActive ? styles['status-active'] : styles['status-blocked']}
                    >
                      {u.isActive ? '✅ Hoạt động' : '🚫 Bị khóa'}
                    </span>
                  </td>
                  <td>
                    <div className={styles['action-buttons']}>
                      <button
                        className={u.isActive ? styles['btn-block'] : styles['btn-unblock']}
                        onClick={() => handleBlock(u._id, !u.isActive)}
                      >
                        {u.isActive ? '🔒 Khóa' : '🔓 Mở khóa'}
                      </button>
                      <button className={styles['btn-delete']} onClick={() => handleDelete(u._id)}>
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles['users-summary']}>
        <p>
          Tổng số người dùng: <span>{users.length}</span>
        </p>
        <p>
          Đang hoạt động: <span>{users.filter((u) => u.isActive).length}</span>
        </p>
        <p>
          Bị khóa: <span>{users.filter((u) => !u.isActive).length}</span>
        </p>
      </div>
    </div>
  );
};

export default AdminUsersPage;

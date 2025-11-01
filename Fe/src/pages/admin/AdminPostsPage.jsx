import { useEffect, useState } from 'react';
import { verifyVehicle, verifyBattery } from '../../services/adminService';
import { fetchVehicles, fetchBatteries } from '../../services/productService';
import styles from './AdminPostsPage.module.css';

const AdminPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      // Admin có token -> vehicles/batteries không bị filter status 'available' mặc định
      fetchVehicles({ sort: '-createdAt', limit: 100 }),
      fetchBatteries({ sort: '-createdAt', limit: 100 }),
    ])
      .then(([vRes, bRes]) => {
        const vehicles = (vRes?.data?.data?.vehicles || []).map((v) => ({ ...v, type: 'vehicle' }));
        const batteries = (bRes?.data?.data?.batteries || []).map((b) => ({
          ...b,
          type: 'battery',
        }));
        setPosts([...vehicles, ...batteries]);
      })
      .catch(() => setError('Không lấy được tin đăng'))
      .finally(() => setLoading(false));
  }, []);

  const handleVerify = async (post, isVerified) => {
    try {
      if (post.type === 'vehicle') await verifyVehicle(post._id, { isVerified });
      else await verifyBattery(post._id, { isVerified });
      // Cập nhật local state thay vì reload
      setPosts((prev) => prev.map((p) => (p._id === post._id ? { ...p, isVerified } : p)));
    } catch {
      alert('Cập nhật thất bại');
    }
  };

  return (
    <div className={styles['admin-posts-container']}>
      <h1 className={styles['admin-posts-title']}>Duyệt tin đăng</h1>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <table className={styles['admin-posts-table']} border="1" cellPadding={6}>
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Người bán</th>
              <th>Loại</th>
              <th>Xác minh</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p._id}>
                <td>{p.title || p.model || p.name}</td>
                <td>{p.sellerId?.name}</td>
                <td>{p.type}</td>
                <td>
                  <button onClick={() => handleVerify(p, !p.isVerified)}>
                    {p.isVerified ? 'Bỏ xác minh' : 'Xác minh'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default AdminPostsPage;

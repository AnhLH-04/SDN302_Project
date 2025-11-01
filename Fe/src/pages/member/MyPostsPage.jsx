import { useEffect, useState } from 'react';
import {
  fetchMyVehicles,
  fetchMyBatteries,
  deleteVehicle,
  deleteBattery,
} from '../../services/productService';
import styles from './MyPostsPage.module.css';

const MyPostsPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchMyVehicles(), fetchMyBatteries()])
      .then(([v, b]) => {
        setVehicles(v.data.data.vehicles || []);
        setBatteries(b.data.data.batteries || []);
      })
      .catch(() => setError('Không lấy được tin đăng'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, type) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa?')) return;
    try {
      if (type === 'vehicle') await deleteVehicle(id);
      else await deleteBattery(id);
      window.location.reload();
    } catch {
      alert('Xóa thất bại');
    }
  };

  return (
    <div className={styles['my-posts-container']}>
      <h1 className={styles['my-posts-title']}>Tin đăng của tôi</h1>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <>
          <h2>Xe điện</h2>
          <ul className={styles['my-posts-list']}>
            {vehicles.map((v) => (
              <li key={v._id} className={styles['my-post-card']}>
                <b>{v.name || v.model}</b> - Giá: {v.price?.toLocaleString()}đ
                <button onClick={() => handleDelete(v._id, 'vehicle')}>Xóa</button>
              </li>
            ))}
          </ul>
          <h2>Pin</h2>
          <ul className={styles['my-posts-list']}>
            {batteries.map((b) => (
              <li key={b._id} className={styles['my-post-card']}>
                <b>{b.name || b.model}</b> - Giá: {b.price?.toLocaleString()}đ
                <button onClick={() => handleDelete(b._id, 'battery')}>Xóa</button>
              </li>
            ))}
          </ul>
        </>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default MyPostsPage;

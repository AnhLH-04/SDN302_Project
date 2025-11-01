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
        const vList = (v && (v.data?.data?.vehicles ?? v.data?.vehicles)) || [];
        const bList = (b && (b.data?.data?.batteries ?? b.data?.batteries)) || [];
        setVehicles(Array.isArray(vList) ? vList : []);
        setBatteries(Array.isArray(bList) ? bList : []);
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
        <div className={styles.loading}>Đang tải...</div>
      ) : (
        <>
          <h2>Xe điện</h2>
          {vehicles.length === 0 ? (
            <div className={styles.empty}>Chưa có tin đăng xe.</div>
          ) : (
            <ul className={styles['my-posts-list']}>
              {vehicles.map((v) => (
                <li key={v._id} className={styles['my-post-card']}>
                  <div className={styles['my-post-thumb']}>
                    <img
                      src={(v.images && v.images[0]) || '/placeholder/vehicle.svg'}
                      alt={v.title || v.model || 'Xe điện'}
                      onError={(e) => (e.currentTarget.src = '/placeholder/vehicle.svg')}
                    />
                  </div>
                  <div className={styles['card-title']} style={{ marginTop: 8, marginBottom: 6 }}>
                    {v.title || v.model || 'Không có tiêu đề'}
                  </div>
                  <div className={styles['card-status']}>
                    Trạng thái: <strong>{v.status}</strong>
                    {typeof v.isVerified === 'boolean' && (
                      <span
                        className={`${styles.verified} ${
                          v.isVerified ? styles['verified-yes'] : styles['verified-no']
                        }`}
                      >
                        {v.isVerified ? 'Đã duyệt' : 'Chờ duyệt'}
                      </span>
                    )}
                  </div>
                  <div className={styles['card-price']}>
                    Giá: <span>{v.price?.toLocaleString()}đ</span>
                  </div>
                  <button
                    className={styles['delete-btn']}
                    onClick={() => handleDelete(v._id, 'vehicle')}
                  >
                    Xóa
                  </button>
                </li>
              ))}
            </ul>
          )}
          <h2>Pin</h2>
          {batteries.length === 0 ? (
            <div className={styles.empty}>Chưa có tin đăng pin.</div>
          ) : (
            <ul className={styles['my-posts-list']}>
              {batteries.map((b) => (
                <li key={b._id} className={styles['my-post-card']}>
                  <div className={styles['my-post-thumb']}>
                    <img
                      src={(b.images && b.images[0]) || '/placeholder/battery.svg'}
                      alt={b.title || b.model || 'Pin'}
                      onError={(e) => (e.currentTarget.src = '/placeholder/battery.svg')}
                    />
                  </div>
                  <div className={styles['card-title']} style={{ marginTop: 8, marginBottom: 6 }}>
                    {b.title || b.model || 'Không có tiêu đề'}
                  </div>
                  <div className={styles['card-status']}>
                    Trạng thái: <strong>{b.status}</strong>
                    {typeof b.isVerified === 'boolean' && (
                      <span
                        className={`${styles.verified} ${
                          b.isVerified ? styles['verified-yes'] : styles['verified-no']
                        }`}
                      >
                        {b.isVerified ? 'Đã duyệt' : 'Chờ duyệt'}
                      </span>
                    )}
                  </div>
                  <div className={styles['card-price']}>
                    Giá: <span>{b.price?.toLocaleString()}đ</span>
                  </div>
                  <button
                    className={styles['delete-btn']}
                    onClick={() => handleDelete(b._id, 'battery')}
                  >
                    Xóa
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default MyPostsPage;

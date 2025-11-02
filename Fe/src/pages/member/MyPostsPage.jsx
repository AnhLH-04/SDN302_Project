import { useEffect, useState } from 'react';
import {
  fetchMyVehicles,
  fetchMyBatteries,
  deleteVehicle,
  deleteBattery,
} from '../../services/productService';
import styles from './MyPostsPage.module.css';

const MyPostsPage = () => {
  const [vehicles, setVehicles] = useState({ available: [], pending: [], sold: [] });
  const [batteries, setBatteries] = useState({ available: [], pending: [], sold: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchMyVehicles(), fetchMyBatteries()])
      .then(([v, b]) => {
        const vList = (v && (v.data?.data?.vehicles ?? v.data?.vehicles)) || [];
        const bList = (b && (b.data?.data?.batteries ?? b.data?.batteries)) || [];

        // Phân loại xe theo trạng thái
        const vAvailable = Array.isArray(vList) ? vList.filter(item => item.status === 'available') : [];
        const vPending = Array.isArray(vList) ? vList.filter(item => item.status === 'pending') : [];
        const vSold = Array.isArray(vList) ? vList.filter(item => item.status === 'sold') : [];

        // Phân loại pin theo trạng thái
        const bAvailable = Array.isArray(bList) ? bList.filter(item => item.status === 'available') : [];
        const bPending = Array.isArray(bList) ? bList.filter(item => item.status === 'pending') : [];
        const bSold = Array.isArray(bList) ? bList.filter(item => item.status === 'sold') : [];

        setVehicles({ available: vAvailable, pending: vPending, sold: vSold });
        setBatteries({ available: bAvailable, pending: bPending, sold: bSold });
      })
      .catch(() => setError('Không lấy được tin đăng'))
      .finally(() => setLoading(false));
  }, []);

  const isLockedStatus = (status) => status === 'pending' || status === 'sold';

  const handleDelete = async (id, type, status) => {
    if (isLockedStatus(status)) {
      alert('Không thể xóa tin khi đang giao dịch (pending) hoặc đã bán.');
      return;
    }
    if (!window.confirm('Bạn chắc chắn muốn xóa?')) return;
    try {
      if (type === 'vehicle') await deleteVehicle(id);
      else await deleteBattery(id);
      window.location.reload();
    } catch {
      alert('Xóa thất bại');
    }
  };

  const renderItemList = (items, type) => {
    if (items.length === 0) {
      return <div className={styles.muted}>Không có tin đăng ở trạng thái này.</div>;
    }

    return (
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item._id} className={styles.itemRow}>
            <div className={styles.thumb}>
              <img
                src={(item.images && item.images[0]) || `/placeholder/${type}.svg`}
                alt={item.title || item.model || type === 'vehicle' ? 'Xe điện' : 'Pin'}
                onError={(e) => (e.currentTarget.src = `/placeholder/${type}.svg`)}
              />
            </div>
            <div className={styles.meta}>
              <div className={styles.title}>
                {item.title || item.model || 'Không có tiêu đề'}
              </div>
              <div className={styles.sub}>
                Giá: {item.price?.toLocaleString()}đ
                {typeof item.isVerified === 'boolean' && (
                  <span
                    className={`${styles.verified} ${
                      item.isVerified ? styles['verified-yes'] : styles['verified-no']
                    }`}
                    style={{ marginLeft: 8 }}
                  >
                    {item.isVerified ? 'Đã duyệt' : 'Chờ duyệt'}
                  </span>
                )}
              </div>
              {!isLockedStatus(item.status) && (
                <button
                  className={styles['delete-btn']}
                  onClick={() => handleDelete(item._id, type, item.status)}
                >
                  Xóa
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tin đăng của tôi</h1>
      {loading ? (
        <div className={styles.loading}>Đang tải...</div>
      ) : (
        <>
          {/* Xe điện Section */}
          <h2 className={styles.sectionTitle}>Xe điện</h2>
          <div className={styles.listsSection}>
            <div className={styles.listBlock}>
              <h3>Chưa bán (Available)</h3>
              {renderItemList(vehicles.available, 'vehicle')}
            </div>

            <div className={styles.listBlock}>
              <h3>Đang giao dịch (Pending)</h3>
              {renderItemList(vehicles.pending, 'vehicle')}
            </div>

            <div className={styles.listBlock}>
              <h3>Đã bán (Sold)</h3>
              {renderItemList(vehicles.sold, 'vehicle')}
            </div>
          </div>

          {/* Pin Section */}
          <h2 className={styles.sectionTitle}>Pin</h2>
          <div className={styles.listsSection}>
            <div className={styles.listBlock}>
              <h3>Chưa bán (Available)</h3>
              {renderItemList(batteries.available, 'battery')}
            </div>

            <div className={styles.listBlock}>
              <h3>Đang giao dịch (Pending)</h3>
              {renderItemList(batteries.pending, 'battery')}
            </div>

            <div className={styles.listBlock}>
              <h3>Đã bán (Sold)</h3>
              {renderItemList(batteries.sold, 'battery')}
            </div>
          </div>
        </>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default MyPostsPage;

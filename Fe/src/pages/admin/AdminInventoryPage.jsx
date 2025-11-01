import { useEffect, useState } from 'react';
import { fetchInventoryReport } from '../../services/adminService';
import { fetchVehicles } from '../../services/productService';
import styles from './AdminInventoryPage.module.css';

const StatCard = ({ title, counts }) => {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <div className={styles.grid}>
        <div className={styles.item}>
          <span>Available</span>
          <strong>{counts.available}</strong>
        </div>
        <div className={styles.item}>
          <span>Pending</span>
          <strong>{counts.pending}</strong>
        </div>
        <div className={styles.item}>
          <span>Sold</span>
          <strong>{counts.sold}</strong>
        </div>
        <div className={styles.item}>
          <span>Hidden</span>
          <strong>{counts.hidden}</strong>
        </div>
        <div className={styles.itemWarning}>
          <span>Chờ duyệt</span>
          <strong>{counts.unverified}</strong>
        </div>
      </div>
    </div>
  );
};

const AdminInventoryPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [available, setAvailable] = useState([]);
  const [pending, setPending] = useState([]);
  const [sold, setSold] = useState([]);

  useEffect(() => {
    setLoading(true);
    // Lấy tổng quan + danh sách xe theo trạng thái
    Promise.all([
      fetchInventoryReport(),
      fetchVehicles({ status: 'available', sort: '-createdAt', limit: 100 }),
      fetchVehicles({ status: 'pending', sort: '-createdAt', limit: 100 }),
      fetchVehicles({ status: 'sold', sort: '-createdAt', limit: 100 }),
    ])
      .then(([reportRes, avRes, peRes, soRes]) => {
        setData(reportRes?.data?.data || null);
        const av = (avRes?.data?.data?.vehicles ?? avRes?.data?.vehicles) || [];
        const pe = (peRes?.data?.data?.vehicles ?? peRes?.data?.vehicles) || [];
        const so = (soRes?.data?.data?.vehicles ?? soRes?.data?.vehicles) || [];
        setAvailable(Array.isArray(av) ? av : []);
        setPending(Array.isArray(pe) ? pe : []);
        setSold(Array.isArray(so) ? so : []);
      })
      .catch(() => setError('Không tải được báo cáo/tồn kho'))
      .finally(() => setLoading(false));
  }, []);

  const totalVehicles = data
    ? data.vehicles.available + data.vehicles.pending + data.vehicles.sold
    : 0;
  const totalBatteries = data
    ? data.batteries.available + data.batteries.pending + data.batteries.sold
    : 0;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Báo cáo tồn kho (Đã bán vs Còn lại)</h1>
      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <>
          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <span>Xe điện (Total)</span>
              <strong>{totalVehicles}</strong>
            </div>
            <div className={styles.summaryItem}>
              <span>Pin (Total)</span>
              <strong>{totalBatteries}</strong>
            </div>
          </div>

          <div className={styles.cards}>
            <StatCard title="Xe điện" counts={data.vehicles} />
            <StatCard title="Pin" counts={data.batteries} />
          </div>

          <div className={styles.listsSection}>
            <div className={styles.listBlock}>
              <h3>Xe chưa bán (Available)</h3>
              {available.length === 0 ? (
                <div className={styles.muted}>Không có xe ở trạng thái này.</div>
              ) : (
                <ul className={styles.list}>
                  {available.map((v) => (
                    <li key={v._id} className={styles.itemRow}>
                      <div className={styles.thumb}>
                        <img
                          src={(v.images && v.images[0]) || '/placeholder/vehicle.svg'}
                          alt={v.title || v.model || 'Xe điện'}
                          onError={(e) => (e.currentTarget.src = '/placeholder/vehicle.svg')}
                        />
                      </div>
                      <div className={styles.meta}>
                        <div className={styles.title}>
                          {v.title || v.model || 'Không có tiêu đề'}
                        </div>
                        <div className={styles.sub}>
                          Người bán: {v.sellerId?.name || '—'} · Giá: {v.price?.toLocaleString()}đ
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.listBlock}>
              <h3>Xe đang giao dịch (Pending)</h3>
              {pending.length === 0 ? (
                <div className={styles.muted}>Không có xe ở trạng thái này.</div>
              ) : (
                <ul className={styles.list}>
                  {pending.map((v) => (
                    <li key={v._id} className={styles.itemRow}>
                      <div className={styles.thumb}>
                        <img
                          src={(v.images && v.images[0]) || '/placeholder/vehicle.svg'}
                          alt={v.title || v.model || 'Xe điện'}
                          onError={(e) => (e.currentTarget.src = '/placeholder/vehicle.svg')}
                        />
                      </div>
                      <div className={styles.meta}>
                        <div className={styles.title}>
                          {v.title || v.model || 'Không có tiêu đề'}
                        </div>
                        <div className={styles.sub}>
                          Người bán: {v.sellerId?.name || '—'} · Giá: {v.price?.toLocaleString()}đ
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.listBlock}>
              <h3>Xe đã bán (Sold)</h3>
              {sold.length === 0 ? (
                <div className={styles.muted}>Không có xe ở trạng thái này.</div>
              ) : (
                <ul className={styles.list}>
                  {sold.map((v) => (
                    <li key={v._id} className={styles.itemRow}>
                      <div className={styles.thumb}>
                        <img
                          src={(v.images && v.images[0]) || '/placeholder/vehicle.svg'}
                          alt={v.title || v.model || 'Xe điện'}
                          onError={(e) => (e.currentTarget.src = '/placeholder/vehicle.svg')}
                        />
                      </div>
                      <div className={styles.meta}>
                        <div className={styles.title}>
                          {v.title || v.model || 'Không có tiêu đề'}
                        </div>
                        <div className={styles.sub}>
                          Người bán: {v.sellerId?.name || '—'} · Giá: {v.price?.toLocaleString()}đ
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminInventoryPage;

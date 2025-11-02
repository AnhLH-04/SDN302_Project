import { useEffect, useState } from 'react';
import { fetchStats } from '../../services/adminService';
import styles from './AdminDashboardPage.module.css';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchStats()
      .then((res) => setStats(res.data.data.stats))
      .catch(() => setError('Không lấy được thống kê'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles['admin-dashboard-container']}>
      <h1 className={styles['admin-dashboard-title']}> Admin Dashboard</h1>
      <p className={styles['admin-dashboard-subtitle']}>Tổng quan và thống kê hệ thống</p>

      {loading ? (
        <div className={styles['loading-container']}>
          <span className={styles['loading-spinner']}></span>
          <p>Đang tải thống kê...</p>
        </div>
      ) : error ? (
        <div className={styles['error-message']}>⚠️ {error}</div>
      ) : (
        stats && (
          <div className={styles['stats-grid']}>
            {/* Thống kê người dùng */}
            <div className={styles['stat-section']}>
              <h2 className={styles['section-title']}> Người dùng</h2>
              <div className={styles['stat-cards']}>
                <div className={styles['stat-card']}>
                  <div className={styles['stat-icon']}>👤</div>
                  <div className={styles['stat-info']}>
                    <p className={styles['stat-label']}>Tổng người dùng</p>
                    <p className={styles['stat-value']}>{stats.totalUsers}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thống kê sản phẩm */}
            <div className={styles['stat-section']}>
              <h2 className={styles['section-title']}> Sản phẩm</h2>
              <div className={styles['stat-cards']}>
                <div className={styles['stat-card']}>
                  <div className={styles['stat-icon']}>🚗</div>
                  <div className={styles['stat-info']}>
                    <p className={styles['stat-label']}>Tổng xe điện</p>
                    <p className={styles['stat-value']}>{stats.totalVehicles}</p>
                  </div>
                </div>
                <div className={styles['stat-card']}>
                  <div className={styles['stat-icon']}>🔋</div>
                  <div className={styles['stat-info']}>
                    <p className={styles['stat-label']}>Tổng pin</p>
                    <p className={styles['stat-value']}>{stats.totalBatteries}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thống kê giao dịch */}
            <div className={styles['stat-section']}>
              <h2 className={styles['section-title']}> Giao dịch</h2>
              <div className={styles['stat-cards']}>
                <div className={styles['stat-card']}>
                  <div className={styles['stat-icon']}>📋</div>
                  <div className={styles['stat-info']}>
                    <p className={styles['stat-label']}>Tổng giao dịch</p>
                    <p className={styles['stat-value']}>{stats.totalTransactions}</p>
                  </div>
                </div>
                <div className={styles['stat-card']}>
                  <div className={styles['stat-icon']}>✅</div>
                  <div className={styles['stat-info']}>
                    <p className={styles['stat-label']}>Hoàn thành</p>
                    <p className={styles['stat-value-success']}>{stats.completedTransactions}</p>
                  </div>
                </div>
                <div className={styles['stat-card']}>
                  <div className={styles['stat-icon']}>⏳</div>
                  <div className={styles['stat-info']}>
                    <p className={styles['stat-label']}>Đang chờ</p>
                    <p className={styles['stat-value-pending']}>{stats.pendingTransactions}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thống kê tài chính */}
            <div className={styles['stat-section']}>
              <h2 className={styles['section-title']}>Tài chính</h2>
              <div className={styles['stat-cards']}>
                <div className={styles['stat-card-large']}>
                  <div className={styles['stat-icon-large']}>💵</div>
                  <div className={styles['stat-info']}>
                    <p className={styles['stat-label']}>Tổng doanh thu</p>
                    <p className={styles['stat-value-money']}>
                      {stats.totalRevenue?.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>
                <div className={styles['stat-card-large']}>
                  <div className={styles['stat-icon-large']}>🎯</div>
                  <div className={styles['stat-info']}>
                    <p className={styles['stat-label']}>Tổng hoa hồng</p>
                    <p className={styles['stat-value-money']}>
                      {stats.totalCommission?.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AdminDashboardPage;

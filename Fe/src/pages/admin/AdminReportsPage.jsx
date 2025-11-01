import { useEffect, useState } from 'react';
import { fetchReports, resolveReport } from '../../services/adminService';
import styles from './AdminReportsPage.module.css';

const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchReports()
      .then((res) => setReports(res.data.data.reports || []))
      .catch(() => setError('Không lấy được báo cáo'))
      .finally(() => setLoading(false));
  }, []);

  const handleResolve = async (reportId, status) => {
    try {
      setUpdatingId(reportId);
      await resolveReport(reportId, { status });
      setReports((prev) => prev.map((r) => (r._id === reportId ? { ...r, status } : r)));
    } catch {
      setError('Cập nhật báo cáo thất bại');
      setTimeout(() => setError(''), 3000);
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <div className={styles['admin-reports-container']}>
      <h1 className={styles['admin-reports-title']}>Thống kê & Báo cáo</h1>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <table className={styles['admin-reports-table']} border="1" cellPadding={6}>
          <thead>
            <tr>
              <th>Người báo cáo</th>
              <th>Người bị báo cáo</th>
              <th>Lý do</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id}>
                <td>{r.reporterId?.name}</td>
                <td>{r.reportedUserId?.name}</td>
                <td>{r.reason}</td>
                <td>{r.status}</td>
                <td>
                  <div className={styles['action-buttons']}>
                    <button
                      disabled={updatingId === r._id}
                      onClick={() => handleResolve(r._id, 'reviewing')}
                    >
                      Đang xem xét
                    </button>
                    <button
                      disabled={updatingId === r._id}
                      onClick={() => handleResolve(r._id, 'resolved')}
                    >
                      Đã xử lý
                    </button>
                    <button
                      disabled={updatingId === r._id}
                      onClick={() => handleResolve(r._id, 'rejected')}
                    >
                      Từ chối
                    </button>
                  </div>
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

export default AdminReportsPage;

import { useEffect, useState, useCallback } from 'react';
import { adminFetchBrands, adminCreateBrand, adminUpdateBrand } from '../../services/adminService';
import styles from './AdminBrandsPage.module.css';

const types = [
  { value: 'vehicle', label: 'Xe điện' },
  { value: 'battery', label: 'Pin' },
  // { value: 'both', label: 'Cả hai' },
];

const AdminBrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ name: '', type: 'vehicle', isActive: true });
  const [submitting, setSubmitting] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filterType !== 'all') params.type = filterType;
      const res = await adminFetchBrands(params);
      setBrands(res?.data?.data?.brands || []);
    } catch {
      setError('Không tải được danh sách thương hiệu');
    }
    setLoading(false);
  }, [filterType]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await adminCreateBrand(form);
      setForm({ name: '', type: 'vehicle', isActive: true });
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || 'Tạo thương hiệu thất bại');
    }
    setSubmitting(false);
  };

  const toggleActive = async (brand) => {
    try {
      await adminUpdateBrand(brand._id, { isActive: !brand.isActive });
      await load();
    } catch {
      setError('Cập nhật trạng thái thất bại');
    }
  };

  const getTypeClass = (type) => {
    if (type === 'vehicle') return styles['type-vehicle'];
    if (type === 'battery') return styles['type-battery'];
    return styles['type-both'];
  };

  const getTypeLabel = (type) => {
    if (type === 'vehicle') return 'Xe điện';
    if (type === 'battery') return 'Pin';
    return 'Cả hai';
  };

  return (
    <div className={styles['admin-brands-container']}>
      <h1 className={styles['admin-brands-title']}>Quản lý thương hiệu</h1>
      <p className={styles['admin-brands-subtitle']}>
        Thêm mới và quản lý các thương hiệu xe điện và pin
      </p>

      <div className={styles['create-form-wrapper']}>
        <h2 className={styles['form-title']}>Thêm thương hiệu mới</h2>
        <form onSubmit={handleCreate} className={styles['create-form']}>
          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Tên thương hiệu</label>
            <input
              name="name"
              placeholder="Nhập tên thương hiệu"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              className={styles['form-input']}
            />
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Loại thương hiệu</label>
            <select
              name="type"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className={styles['form-select']}
            >
              {types.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles['checkbox-wrapper']}>
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className={styles['checkbox-input']}
            />
            <label htmlFor="isActive" className={styles['checkbox-label']}>
              Kích hoạt ngay
            </label>
          </div>

          <button type="submit" disabled={submitting} className={styles['submit-button']}>
            {submitting ? 'Đang tạo...' : 'Thêm thương hiệu'}
          </button>
        </form>
      </div>

      {/* Filter Bar */}
      <div className={styles['create-form-wrapper']} style={{ marginTop: 16 }}>
        <h2 className={styles['form-title']}>Bộ lọc</h2>
        <div className={styles['create-form']} style={{ display: 'flex', gap: 16 }}>
          <div className={styles['form-group']} style={{ maxWidth: 260 }}>
            <label className={styles['form-label']}>Lọc theo loại thương hiệu</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={styles['form-select']}
            >
              <option value="all">Tất cả</option>
              <option value="vehicle">Xe điện</option>
              <option value="battery">Pin</option>
              {/* <option value="both">Cả hai</option> */}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles['loading-container']}>
          <div className={styles['loading-spinner']}></div>
          <p className={styles['loading-text']}>Đang tải danh sách thương hiệu...</p>
        </div>
      ) : error ? (
        <div className={styles['error-message']}>{error}</div>
      ) : brands.length === 0 ? (
        <div className={styles['table-wrapper']}>
          <div className={styles['empty-state']}>
            <p className={styles['empty-state-text']}>Chưa có thương hiệu nào</p>
          </div>
        </div>
      ) : (
        <div className={styles['table-wrapper']}>
          <table className={styles['brands-table']}>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Loại</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b._id}>
                  <td>
                    <span className={styles['brand-name']}>{b.name}</span>
                  </td>
                  <td>
                    <span className={`${styles['brand-type']} ${getTypeClass(b.type)}`}>
                      {getTypeLabel(b.type)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles['status-badge']} ${
                        b.isActive ? styles['status-active'] : styles['status-inactive']
                      }`}
                    >
                      {b.isActive ? 'Đang kích hoạt' : 'Tắt'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleActive(b)}
                      className={`${styles['action-button']} ${
                        b.isActive ? styles['btn-deactivate'] : styles['btn-activate']
                      }`}
                    >
                      {b.isActive ? 'Tắt' : 'Bật'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBrandsPage;

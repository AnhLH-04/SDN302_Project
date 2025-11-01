import React, { useEffect, useMemo, useState } from 'react';
import { useCompare } from '@utils/CompareContext.jsx';
import { fetchVehicleById } from '@services/productService';
import styles from './CompareVehiclesPage.module.css';

const fields = [
  { key: 'brand', label: 'Hãng' },
  { key: 'model', label: 'Model' },
  { key: 'year', label: 'Năm' },
  { key: 'batteryCapacity', label: 'Dung lượng pin (kWh)' },
  { key: 'batteryHealth', label: 'Tình trạng pin (%)' },
  { key: 'range', label: 'Quãng đường (km)' },
  { key: 'mileage', label: 'Số km đã đi' },
  { key: 'price', label: 'Giá (đ)' },
];

const CompareVehiclesPage = () => {
  const { vehicles, clear, remove } = useCompare() || { vehicles: [] };
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await Promise.all((vehicles || []).map((id) => fetchVehicleById(id)));
        setItems(res.map((r) => r?.data?.data?.vehicle || r?.data?.data).filter(Boolean));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [vehicles]);

  const diffKeys = useMemo(() => {
    const set = new Set();
    fields.forEach((f) => {
      const vals = (items || []).map((it) => it?.[f.key]);
      const unique = Array.from(new Set(vals.map((v) => String(v ?? ''))));
      if (unique.length > 1) set.add(f.key);
    });
    return set;
  }, [items]);

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>So sánh xe điện</h2>
        <div className={styles.actions}>
          <span className={styles.pill}>{items.length} mục</span>
          <button className={styles.btn} onClick={() => clear('vehicle')}>
            Xóa danh sách
          </button>
          <a className={`${styles.btn} ${styles.btnPrimary}`} href="/products">
            Thêm xe
          </a>
        </div>
      </div>

      {loading && <p>Đang tải...</p>}
      {!loading && items.length === 0 && (
        <p className={styles.empty}>Chưa chọn xe để so sánh. Hãy nhấn ⚖ trên thẻ xe.</p>
      )}

      {items.length > 0 && (
        <>
          <div className={styles.itemsRow}>
            {items.map((it) => (
              <div className={styles.itemCard} key={it._id}>
                <img
                  className={styles.thumb}
                  src={it.images?.[0] || '/placeholder/vehicle.svg'}
                  alt={it.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/placeholder/vehicle.svg';
                  }}
                />
                <div className={styles.itemMeta}>
                  <div className={styles.itemTitle}>{it.title}</div>
                  <div className={styles.itemSub}>
                    {it.brand} {it.model} ({it.year})
                  </div>
                </div>
                <button className={styles.removeBtn} onClick={() => remove('vehicle', it._id)}>
                  × Bỏ
                </button>
              </div>
            ))}
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th className={`${styles.th} ${styles.thSticky}`}>Thông số</th>
                  {items.map((item) => (
                    <th key={item._id} className={styles.th}>
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fields.map((f) => (
                  <tr
                    key={f.key}
                    className={`${styles.row} ${diffKeys.has(f.key) ? styles.diff : ''}`}
                  >
                    <td className={`${styles.td} ${styles.thSticky}`}>{f.label}</td>
                    {items.map((it, idx) => (
                      <td key={`${it?._id || 'noid'}-${f.key}-${idx}`} className={styles.td}>
                        {f.key === 'price'
                          ? it[f.key]?.toLocaleString?.() + ' đ'
                          : it[f.key] ?? '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default CompareVehiclesPage;

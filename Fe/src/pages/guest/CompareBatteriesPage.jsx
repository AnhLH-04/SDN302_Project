import React, { useEffect, useMemo, useState } from 'react';
import { useCompare } from '@utils/CompareContext.jsx';
import { fetchBatteryById } from '@services/productService';
import styles from './CompareBatteriesPage.module.css';

const fields = [
  { key: 'brand', label: 'Hãng' },
  { key: 'type', label: 'Loại' },
  { key: 'capacity', label: 'Dung lượng (kWh)' },
  { key: 'health', label: 'Tình trạng (%)' },
  { key: 'cycleCount', label: 'Số chu kỳ' },
  { key: 'manufactureYear', label: 'Năm SX' },
  { key: 'condition', label: 'Tình trạng' },
  { key: 'price', label: 'Giá (đ)' },
];

const CompareBatteriesPage = () => {
  const { batteries, clear, remove } = useCompare() || { batteries: [] };
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await Promise.all((batteries || []).map((id) => fetchBatteryById(id)));
        setItems(res.map((r) => r?.data?.data?.battery || r?.data?.data).filter(Boolean));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [batteries]);

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
        <h2 className={styles.title}>So sánh pin</h2>
        <div className={styles.actions}>
          <span className={styles.pill}>{items.length} mục</span>
          <button className={styles.btn} onClick={() => clear('battery')}>
            Xóa danh sách
          </button>
          <a className={`${styles.btn} ${styles.btnPrimary}`} href="/products">
            Thêm pin
          </a>
        </div>
      </div>

      {loading && <p>Đang tải...</p>}
      {!loading && items.length === 0 && (
        <p className={styles.empty}>Chưa chọn pin để so sánh. Hãy nhấn ⚖ trên thẻ pin.</p>
      )}

      {items.length > 0 && (
        <>
          <div className={styles.itemsRow}>
            {items.map((it) => (
              <div className={styles.itemCard} key={it._id}>
                <img
                  className={styles.thumb}
                  src={it.images?.[0] || '/placeholder/battery.svg'}
                  alt={it.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/placeholder/battery.svg';
                  }}
                />
                <div className={styles.itemMeta}>
                  <div className={styles.itemTitle}>{it.title}</div>
                  <div className={styles.itemSub}>
                    {it.brand} — {it.type}
                  </div>
                </div>
                <button className={styles.removeBtn} onClick={() => remove('battery', it._id)}>
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

export default CompareBatteriesPage;

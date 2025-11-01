import React, { useEffect, useState } from 'react';
import { fetchVehicles, fetchBatteries } from '../../services/productService';
import styles from './ProductsPage.module.css';
import VehicleCard from '../../components/VehicleCard';
import BatteryCard from '../../components/BatteryCard';

const ProductsPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ search: '', type: 'all' });

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        let v = [],
          b = [];
        if (filter.type === 'all' || filter.type === 'vehicle') {
          const resV = await fetchVehicles({ search: filter.search });
          v = resV.data.data.vehicles || [];
        }
        if (filter.type === 'all' || filter.type === 'battery') {
          const resB = await fetchBatteries({ search: filter.search });
          b = resB.data.data.batteries || [];
        }
        setVehicles(v);
        setBatteries(b);
      } catch (err) {
        setVehicles([]);
        setBatteries([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [filter]);

  return (
    <div className={styles['products-container']}>
      <h1 className={styles['products-title']}>Danh sách sản phẩm</h1>
      <p className={styles['products-subtitle']}>
        Khám phá các sản phẩm xe điện và pin chất lượng cao
      </p>

      <div className={styles['filter-bar']}>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm xe hoặc pin..."
          value={filter.search}
          onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))}
          className={styles['search-input']}
        />
        <select
          value={filter.type}
          onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value }))}
          className={styles['filter-select']}
        >
          <option value="all">Tất cả</option>
          <option value="vehicle">🚗 Xe điện</option>
          <option value="battery">🔋 Pin</option>
        </select>
      </div>

      {loading ? (
        <div className={styles['loading-container']}>
          <span className={styles['loading-spinner']}></span>
          <p>Đang tải sản phẩm...</p>
        </div>
      ) : (
        <div className={styles['products-content']}>
          {(filter.type === 'all' || filter.type === 'vehicle') && vehicles.length > 0 && (
            <div className={styles['product-section']}>
              <h2 className={styles['section-title']}>🚗 Xe điện</h2>
              <div className={styles['product-grid']}>
                {vehicles.map((v) => (
                  <VehicleCard key={v._id} vehicle={v} />
                ))}
              </div>
            </div>
          )}

          {(filter.type === 'all' || filter.type === 'battery') && batteries.length > 0 && (
            <div className={styles['product-section']}>
              <h2 className={styles['section-title']}>🔋 Pin</h2>
              <div className={styles['product-grid']}>
                {batteries.map((b) => (
                  <BatteryCard key={b._id} battery={b} />
                ))}
              </div>
            </div>
          )}

          {vehicles.length === 0 && batteries.length === 0 && (
            <div className={styles['empty-state']}>
              <p>😔 Không tìm thấy sản phẩm nào</p>
              <p className={styles['empty-subtitle']}>Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;

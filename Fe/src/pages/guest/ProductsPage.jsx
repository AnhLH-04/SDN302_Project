import React, { useEffect, useMemo, useState } from 'react';
import { fetchVehicles, fetchBatteries } from '../../services/productService';
import styles from './ProductsPage.module.css';
import VehicleCard from '../../components/VehicleCard';
import BatteryCard from '../../components/BatteryCard';

const ProductsPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    search: '',
    type: 'all', // all | vehicle | battery
    // Common
    brand: '',
    condition: '',
    priceMin: '',
    priceMax: '',
    // Vehicle specific
    yearMin: '',
    yearMax: '',
    mileageMin: '',
    mileageMax: '',
    vHealthMin: '', // batteryHealth
    vHealthMax: '',
    // Battery specific
    capacityMin: '',
    capacityMax: '',
    bHealthMin: '', // health
    bHealthMax: '',
    mYearMin: '', // manufactureYear
    mYearMax: '',
  });

  const vehicleParams = useMemo(() => {
    const p = {};
    if (filter.search) p.search = filter.search;
    if (filter.brand) p.brand = filter.brand;
    if (filter.condition) p.condition = filter.condition;
    if (filter.priceMin) p['price[gte]'] = filter.priceMin;
    if (filter.priceMax) p['price[lte]'] = filter.priceMax;
    if (filter.yearMin) p['year[gte]'] = filter.yearMin;
    if (filter.yearMax) p['year[lte]'] = filter.yearMax;
    if (filter.mileageMin) p['mileage[gte]'] = filter.mileageMin;
    if (filter.mileageMax) p['mileage[lte]'] = filter.mileageMax;
    if (filter.vHealthMin) p['batteryHealth[gte]'] = filter.vHealthMin;
    if (filter.vHealthMax) p['batteryHealth[lte]'] = filter.vHealthMax;
    return p;
  }, [filter]);

  const batteryParams = useMemo(() => {
    const p = {};
    if (filter.search) p.search = filter.search;
    if (filter.brand) p.brand = filter.brand;
    if (filter.condition) p.condition = filter.condition;
    if (filter.priceMin) p['price[gte]'] = filter.priceMin;
    if (filter.priceMax) p['price[lte]'] = filter.priceMax;
    if (filter.capacityMin) p['capacity[gte]'] = filter.capacityMin;
    if (filter.capacityMax) p['capacity[lte]'] = filter.capacityMax;
    if (filter.bHealthMin) p['health[gte]'] = filter.bHealthMin;
    if (filter.bHealthMax) p['health[lte]'] = filter.bHealthMax;
    if (filter.mYearMin) p['manufactureYear[gte]'] = filter.mYearMin;
    if (filter.mYearMax) p['manufactureYear[lte]'] = filter.mYearMax;
    return p;
  }, [filter]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        let v = [],
          b = [];
        if (filter.type === 'all' || filter.type === 'vehicle') {
          const resV = await fetchVehicles(vehicleParams);
          v = resV.data.data.vehicles || [];
        }
        if (filter.type === 'all' || filter.type === 'battery') {
          const resB = await fetchBatteries(batteryParams);
          b = resB.data.data.batteries || [];
        }
        setVehicles(v);
        setBatteries(b);
      } catch {
        setVehicles([]);
        setBatteries([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [filter, vehicleParams, batteryParams]);

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

      {/* Advanced filters */}
      <div className={styles['advanced-filters']}>
        <h3 className={styles['filter-section-title']}>🎯 Bộ lọc nâng cao</h3>

        {/* Common filters */}
        <div className={styles['filter-group']}>
          <label className={styles['filter-label']}>🏷️ Chung</label>
          <div className={styles['filters-row']}>
            <input
              type="text"
              placeholder="Hãng sản xuất"
              value={filter.brand}
              onChange={(e) => setFilter((f) => ({ ...f, brand: e.target.value }))}
              className={styles['filter-input']}
            />
            <select
              value={filter.condition}
              onChange={(e) => setFilter((f) => ({ ...f, condition: e.target.value }))}
              className={styles['filter-select']}
            >
              <option value="">Tình trạng (tất cả)</option>
              {filter.type !== 'battery' && (
                <>
                  <option value="new">Mới</option>
                  <option value="like-new">Như mới</option>
                  <option value="good">Tốt</option>
                  <option value="fair">Khá</option>
                </>
              )}
              {filter.type !== 'vehicle' && (
                <>
                  <option value="excellent">Xuất sắc</option>
                  <option value="good">Tốt</option>
                  <option value="fair">Khá</option>
                  <option value="poor">Kém</option>
                </>
              )}
            </select>
            <div className={styles['input-group']}>
              <span className={styles['input-label']}>💰 Giá (VNĐ)</span>
              <div className={styles['input-pair']}>
                <input
                  type="number"
                  min="0"
                  placeholder="Từ"
                  value={filter.priceMin}
                  onChange={(e) => setFilter((f) => ({ ...f, priceMin: e.target.value }))}
                  className={styles['filter-input-small']}
                />
                <span className={styles['input-separator']}>→</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Đến"
                  value={filter.priceMax}
                  onChange={(e) => setFilter((f) => ({ ...f, priceMax: e.target.value }))}
                  className={styles['filter-input-small']}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle specific filters */}
        {(filter.type === 'all' || filter.type === 'vehicle') && (
          <div className={styles['filter-group']}>
            <label className={styles['filter-label']}>🚗 Bộ lọc xe điện</label>
            <div className={styles['filters-row']}>
              <div className={styles['input-group']}>
                <span className={styles['input-label']}>📅 Năm sản xuất</span>
                <div className={styles['input-pair']}>
                  <input
                    type="number"
                    placeholder="Từ năm"
                    value={filter.yearMin}
                    onChange={(e) => setFilter((f) => ({ ...f, yearMin: e.target.value }))}
                    className={styles['filter-input-small']}
                  />
                  <span className={styles['input-separator']}>→</span>
                  <input
                    type="number"
                    placeholder="Đến năm"
                    value={filter.yearMax}
                    onChange={(e) => setFilter((f) => ({ ...f, yearMax: e.target.value }))}
                    className={styles['filter-input-small']}
                  />
                </div>
              </div>
              <div className={styles['input-group']}>
                <span className={styles['input-label']}>🛣️ Số km đã đi</span>
                <div className={styles['input-pair']}>
                  <input
                    type="number"
                    min="0"
                    placeholder="Từ km"
                    value={filter.mileageMin}
                    onChange={(e) => setFilter((f) => ({ ...f, mileageMin: e.target.value }))}
                    className={styles['filter-input-small']}
                  />
                  <span className={styles['input-separator']}>→</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Đến km"
                    value={filter.mileageMax}
                    onChange={(e) => setFilter((f) => ({ ...f, mileageMax: e.target.value }))}
                    className={styles['filter-input-small']}
                  />
                </div>
              </div>
              <div className={styles['input-group']}>
                <span className={styles['input-label']}>🔋 Sức khỏe pin (%)</span>
                <div className={styles['input-pair']}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Từ %"
                    value={filter.vHealthMin}
                    onChange={(e) => setFilter((f) => ({ ...f, vHealthMin: e.target.value }))}
                    className={styles['filter-input-small']}
                  />
                  <span className={styles['input-separator']}>→</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Đến %"
                    value={filter.vHealthMax}
                    onChange={(e) => setFilter((f) => ({ ...f, vHealthMax: e.target.value }))}
                    className={styles['filter-input-small']}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Battery specific filters */}
        {(filter.type === 'all' || filter.type === 'battery') && (
          <div className={styles['filter-group']}>
            <label className={styles['filter-label']}>🔋 Bộ lọc pin</label>
            <div className={styles['filters-row']}>
              <div className={styles['input-group']}>
                <span className={styles['input-label']}>⚡ Dung lượng (kWh)</span>
                <div className={styles['input-pair']}>
                  <input
                    type="number"
                    min="0"
                    placeholder="Từ kWh"
                    value={filter.capacityMin}
                    onChange={(e) => setFilter((f) => ({ ...f, capacityMin: e.target.value }))}
                    className={styles['filter-input-small']}
                  />
                  <span className={styles['input-separator']}>→</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Đến kWh"
                    value={filter.capacityMax}
                    onChange={(e) => setFilter((f) => ({ ...f, capacityMax: e.target.value }))}
                    className={styles['filter-input-small']}
                  />
                </div>
              </div>
              <div className={styles['input-group']}>
                <span className={styles['input-label']}>💪 Sức khỏe pin (%)</span>
                <div className={styles['input-pair']}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Từ %"
                    value={filter.bHealthMin}
                    onChange={(e) => setFilter((f) => ({ ...f, bHealthMin: e.target.value }))}
                    className={styles['filter-input-small']}
                  />
                  <span className={styles['input-separator']}>→</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Đến %"
                    value={filter.bHealthMax}
                    onChange={(e) => setFilter((f) => ({ ...f, bHealthMax: e.target.value }))}
                    className={styles['filter-input-small']}
                  />
                </div>
              </div>
              <div className={styles['input-group']}>
                <span className={styles['input-label']}>🏭 Năm sản xuất</span>
                <div className={styles['input-pair']}>
                  <input
                    type="number"
                    placeholder="Từ năm"
                    value={filter.mYearMin}
                    onChange={(e) => setFilter((f) => ({ ...f, mYearMin: e.target.value }))}
                    className={styles['filter-input-small']}
                  />
                  <span className={styles['input-separator']}>→</span>
                  <input
                    type="number"
                    placeholder="Đến năm"
                    value={filter.mYearMax}
                    onChange={(e) => setFilter((f) => ({ ...f, mYearMax: e.target.value }))}
                    className={styles['filter-input-small']}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles['filter-actions']}>
          <button
            className={styles['reset-btn']}
            onClick={() =>
              setFilter((f) => ({
                ...f,
                brand: '',
                condition: '',
                priceMin: '',
                priceMax: '',
                yearMin: '',
                yearMax: '',
                mileageMin: '',
                mileageMax: '',
                vHealthMin: '',
                vHealthMax: '',
                capacityMin: '',
                capacityMax: '',
                bHealthMin: '',
                bHealthMax: '',
                mYearMin: '',
                mYearMax: '',
              }))
            }
          >
            🗑️ Xóa bộ lọc
          </button>
        </div>
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

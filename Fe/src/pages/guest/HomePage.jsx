import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import { fetchVehicles, fetchBatteries } from '../../services/productService';
import VehicleCard from '../../components/VehicleCard';
import BatteryCard from '../../components/BatteryCard';

const HomePage = () => {
  // Sản phẩm nổi bật (dựa vào viewCount)
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [featuredBatteries, setFeaturedBatteries] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [errorFeatured, setErrorFeatured] = useState('');

  // Tin đăng mới (dựa vào createdAt)
  const [latestVehicles, setLatestVehicles] = useState([]);
  const [latestBatteries, setLatestBatteries] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [errorLatest, setErrorLatest] = useState('');

  useEffect(() => {
    // Fetch Sản phẩm nổi bật
    setLoadingFeatured(true);
    Promise.all([
      fetchVehicles({ sort: '-viewCount', limit: 6 }),
      fetchBatteries({ sort: '-viewCount', limit: 6 }),
    ])
      .then(([vRes, bRes]) => {
        setFeaturedVehicles(vRes?.data?.data?.vehicles || []);
        setFeaturedBatteries(bRes?.data?.data?.batteries || []);
      })
      .catch(() => setErrorFeatured('Không tải được danh sách sản phẩm nổi bật'))
      .finally(() => setLoadingFeatured(false));

    // Fetch Tin đăng mới
    setLoadingLatest(true);
    Promise.all([
      fetchVehicles({ sort: '-createdAt', limit: 6 }),
      fetchBatteries({ sort: '-createdAt', limit: 6 }),
    ])
      .then(([vRes, bRes]) => {
        setLatestVehicles(vRes?.data?.data?.vehicles || []);
        setLatestBatteries(bRes?.data?.data?.batteries || []);
      })
      .catch(() => setErrorLatest('Không tải được danh sách tin đăng mới'))
      .finally(() => setLoadingLatest(false));
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles['home-title']}>Nền tảng mua bán EV & Pin</h1>

      {/* Sản phẩm nổi bật */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Sản phẩm nổi bật</h2>
          <Link to="/products" className={styles.viewAll}>
            Xem tất cả
          </Link>
        </div>
        {loadingFeatured ? (
          <div className={styles.loading}>Đang tải sản phẩm...</div>
        ) : errorFeatured ? (
          <div className={styles.error}>{errorFeatured}</div>
        ) : (
          <>
            {featuredVehicles.length > 0 && (
              <div className={styles.subSection}>
                <h3 className={styles.subTitle}>🚗 Xe điện</h3>
                <div className={styles.grid}>
                  {featuredVehicles.map((v) => (
                    <VehicleCard key={v._id} vehicle={v} />
                  ))}
                </div>
              </div>
            )}
            {featuredBatteries.length > 0 && (
              <div className={styles.subSection}>
                <h3 className={styles.subTitle}>🔋 Pin</h3>
                <div className={styles.grid}>
                  {featuredBatteries.map((b) => (
                    <BatteryCard key={b._id} battery={b} />
                  ))}
                </div>
              </div>
            )}
            {featuredVehicles.length === 0 && featuredBatteries.length === 0 && (
              <div className={styles.empty}>Hiện chưa có sản phẩm nổi bật</div>
            )}
          </>
        )}
      </section>

      {/* Tin đăng mới */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Tin đăng mới</h2>
          <Link to="/products" className={styles.viewAll}>
            Xem tất cả
          </Link>
        </div>
        {loadingLatest ? (
          <div className={styles.loading}>Đang tải tin đăng...</div>
        ) : errorLatest ? (
          <div className={styles.error}>{errorLatest}</div>
        ) : (
          <>
            {latestVehicles.length > 0 && (
              <div className={styles.subSection}>
                <h3 className={styles.subTitle}>🚗 Xe điện</h3>
                <div className={styles.grid}>
                  {latestVehicles.map((v) => (
                    <VehicleCard key={v._id} vehicle={v} />
                  ))}
                </div>
              </div>
            )}
            {latestBatteries.length > 0 && (
              <div className={styles.subSection}>
                <h3 className={styles.subTitle}>🔋 Pin</h3>
                <div className={styles.grid}>
                  {latestBatteries.map((b) => (
                    <BatteryCard key={b._id} battery={b} />
                  ))}
                </div>
              </div>
            )}
            {latestVehicles.length === 0 && latestBatteries.length === 0 && (
              <div className={styles.empty}>Hiện chưa có tin đăng mới</div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default HomePage;

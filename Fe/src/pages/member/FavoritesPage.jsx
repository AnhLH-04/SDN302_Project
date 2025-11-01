import React, { useEffect, useState } from 'react';
import { fetchFavorites, removeFavorite as apiRemove } from '@services/favoriteService';
import VehicleCard from '@components/VehicleCard.jsx';
import BatteryCard from '@components/BatteryCard.jsx';
import styles from './FavoritesPage.module.css';

const FavoritesPage = () => {
  const [tab, setTab] = useState('vehicle');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchFavorites({ itemType: tab });
      setItems(res?.data?.data || []);
    } catch (e) {
      setError('Không thể tải danh sách yêu thích');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [tab]);

  const onRemove = async (fav) => {
    await apiRemove(fav.itemType, fav.itemId);
    setItems((prev) => prev.filter((x) => x.itemId !== fav.itemId));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Danh sách yêu thích</h2>
      <div className={styles.tabs}>
        <button
          onClick={() => setTab('vehicle')}
          className={`${styles.tab} ${tab === 'vehicle' ? styles['tab-active'] : ''}`}
        >
          Xe điện
        </button>
        <button
          onClick={() => setTab('battery')}
          className={`${styles.tab} ${tab === 'battery' ? styles['tab-active'] : ''}`}
        >
          Pin
        </button>
      </div>
      {loading && <p className={styles.loading}>Đang tải...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && items.length === 0 && <p className={styles.empty}>Chưa có mục yêu thích.</p>}
      <div className={styles.grid}>
        {items.map((fav) => (
          <div key={`${fav.itemType}-${fav.itemId}`} className={styles['item-wrapper']}>
            <button onClick={() => onRemove(fav)} className={styles['remove-btn']}>
              Bỏ thích
            </button>
            {fav.itemType === 'vehicle' ? (
              <VehicleCard vehicle={fav.item} />
            ) : (
              <BatteryCard battery={fav.item} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;

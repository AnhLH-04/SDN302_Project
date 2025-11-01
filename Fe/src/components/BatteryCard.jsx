import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BatteryCard.module.css';
import { useFavorites } from '@utils/FavoritesContext.jsx';
import { useCompare } from '@utils/CompareContext.jsx';

const BatteryCard = ({ battery }) => {
  const firstImage = battery.images?.[0] || '/placeholder/battery.svg';
  const { isFavorited, toggleFavorite } = useFavorites() || {};
  const { isSelected, toggle } = useCompare() || {};
  const fav = isFavorited?.('battery', battery._id);
  const inCompare = isSelected?.('battery', battery._id);

  return (
    <Link to={`/product/battery/${battery._id}`} className={styles.card}>
      <img
        src={firstImage}
        alt={battery.title || battery.brand || 'Battery'}
        className={styles.image}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/placeholder/battery.svg';
        }}
      />
      <div className={styles.actions} onClick={(e) => e.preventDefault()}>
        <button
          aria-label={fav ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
          className={`${styles.iconBtn} ${fav ? styles.hearted : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite?.('battery', battery._id);
          }}
        >
          {fav ? '❤' : '♡'}
        </button>
        <button
          aria-label={inCompare ? 'Bỏ so sánh' : 'Thêm so sánh'}
          className={`${styles.iconBtn} ${inCompare ? styles.selected : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle?.('battery', battery._id);
          }}
        >
          ⚖
        </button>
      </div>
      <div className={styles.info}>
        <div className={styles.title}>{battery.title}</div>
        <div className={styles.brand}>
          🔋 {battery.brand} — {battery.type}
        </div>
        {/* <div className={styles.capacity}>
          ⚡ Dung lượng: {battery.capacity} kWh — Health: {battery.health}%
        </div> */}
        <div className={styles.price}> {battery.price?.toLocaleString()} đ</div>
        <div className={styles.location}>📍 {battery.location}</div>
        {/* <div className={styles.status}>
          Trạng thái: <strong>{battery.status === 'available' ? 'Còn hàng' : 'Hết hàng'}</strong>
        </div> */}
      </div>
    </Link>
  );
};

export default BatteryCard;

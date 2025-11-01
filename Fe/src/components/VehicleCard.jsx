import React from 'react';
import { Link } from 'react-router-dom';
import styles from './VehicleCard.module.css';
import { useFavorites } from '@utils/FavoritesContext.jsx';
import { useCompare } from '@utils/CompareContext.jsx';

const VehicleCard = ({ vehicle }) => {
  const firstImage = vehicle.images?.[0] || '/placeholder/vehicle.svg';
  const { isFavorited, toggleFavorite } = useFavorites() || {};
  const { isSelected, toggle } = useCompare() || {};
  const fav = isFavorited?.('vehicle', vehicle._id);
  const inCompare = isSelected?.('vehicle', vehicle._id);

  return (
    <Link to={`/product/vehicle/${vehicle._id}`} className={styles.card}>
      <img
        src={firstImage}
        alt={vehicle.title || vehicle.model || 'Vehicle'}
        className={styles.image}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/placeholder/vehicle.svg';
        }}
      />
      <div className={styles.actions} onClick={(e) => e.preventDefault()}>
        <button
          aria-label={fav ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
          className={`${styles.iconBtn} ${fav ? styles.hearted : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite?.('vehicle', vehicle._id);
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
            toggle?.('vehicle', vehicle._id);
          }}
        >
          ⚖
        </button>
      </div>
      <div className={styles.info}>
        <div className={styles.title}>{vehicle.title}</div>
        <div className={styles.brand}>
          {vehicle.brand} {vehicle.model} ({vehicle.year})
        </div>
        <div className={styles.price}> {vehicle.price?.toLocaleString()} đ</div>
        <div className={styles.location}>📍 {vehicle.location}</div>
      </div>
    </Link>
  );
};

export default VehicleCard;

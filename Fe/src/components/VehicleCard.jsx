import React from 'react';
import { Link } from 'react-router-dom';
import styles from './VehicleCard.module.css';

const VehicleCard = ({ vehicle }) => {
  const firstImage = vehicle.images?.[0] || 'https://via.placeholder.com/220x140?text=EV+Image';

  return (
    <Link to={`/product/vehicle/${vehicle._id}`} className={styles.card}>
      <img
        src={firstImage}
        alt={vehicle.title || vehicle.model || 'Vehicle'}
        className={styles.image}
      />
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

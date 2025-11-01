import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BatteryCard.module.css';

const BatteryCard = ({ battery }) => {
  const firstImage =
    battery.images?.[0] || 'https://via.placeholder.com/220x140?text=Battery+Image';

  return (
    <Link to={`/product/battery/${battery._id}`} className={styles.card}>
      <img
        src={firstImage}
        alt={battery.title || battery.brand || 'Battery'}
        className={styles.image}
      />
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

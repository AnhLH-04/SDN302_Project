import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import styles from './ProductDetailPage.module.css';
import { useParams } from 'react-router-dom';
import { fetchVehicleById, fetchBatteryById } from '../../services/productService';
import { createTransaction } from '../../services/transactionService';
import { fetchProductReviews } from '../../services/reviewService';
import ReviewList from '../../components/ReviewList';

const ProductDetailPage = () => {
  // Biến trạng thái mua hàng
  const [buying, setBuying] = useState(false);
  const [buyMsg, setBuyMsg] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // Đổi default thành cash
  const { id, type } = useParams(); // type: 'vehicle' hoặc 'battery'

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    const fetchData = async () => {
      try {
        let res;
        if (type === 'vehicle') {
          res = await fetchVehicleById(id);
          setProduct(res.data.data.vehicle);
        } else if (type === 'battery') {
          res = await fetchBatteryById(id);
          setProduct(res.data.data.battery);
        } else {
          setError('Loại sản phẩm không hợp lệ');
        }
      } catch {
        setError('Không tìm thấy sản phẩm');
      }
      setLoading(false);
    };
    fetchData();

    // Fetch reviews - separate function
    const loadReviews = async () => {
      if (!type || !id) {
        console.log('Skipping reviews - missing type or id');
        return;
      }

      setReviewsLoading(true);
      try {
        console.log(`Fetching reviews for ${type}/${id}`);
        const res = await fetchProductReviews(type, id);
        console.log('Reviews API Full Response:', res);

        // Try multiple possible response structures
        let reviewsData = [];
        let statsData = null;

        if (res?.data?.data) {
          reviewsData = res.data.data.reviews || [];
          statsData = res.data.data.stats || null;
        } else if (res?.data) {
          reviewsData = res.data.reviews || [];
          statsData = res.data.stats || null;
        }

        console.log('Setting reviews:', reviewsData);
        console.log('Setting stats:', statsData);

        setReviews(reviewsData);
        setReviewStats(statsData);
      } catch (err) {
        console.error('Error loading reviews:', err);
        console.error('Error details:', err.response?.data || err.message);
        // Silently fail - don't crash the page
        setReviews([]);
        setReviewStats(null);
      } finally {
        setReviewsLoading(false);
      }
    };

    loadReviews();
  }, [id, type]);

  if (loading) return <div className={styles.loading}>Đang tải...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!product) return <div>Không có dữ liệu sản phẩm</div>;

  const images = product.images && product.images.length > 0 ? product.images : [];
  const seller = product.sellerId || {};
  const createdAt = product.createdAt ? dayjs(product.createdAt).format('DD/MM/YYYY HH:mm') : '';

  const isVehicle = type === 'vehicle';
  const infoRows = isVehicle
    ? [
      { label: 'Hãng', value: product.brand },
      { label: 'Model', value: product.model },
      { label: 'Năm sản xuất', value: product.year },
      { label: 'Tình trạng', value: product.condition },
      {
        label: 'Số km đã đi',
        value: product.mileage != null ? `${product.mileage.toLocaleString()} km` : null,
      },
      {
        label: 'Dung lượng pin',
        value: product.batteryCapacity != null ? `${product.batteryCapacity} kWh` : null,
      },
      {
        label: 'Tình trạng pin',
        value: product.batteryHealth != null ? `${product.batteryHealth}%` : null,
      },
      { label: 'Quãng đường', value: product.range != null ? `${product.range} km` : null },
      { label: 'Màu sắc', value: product.color },
      {
        label: 'Tính năng',
        value:
          Array.isArray(product.features) && product.features.length
            ? product.features.join(', ')
            : null,
      },
      {
        label: 'Giá gợi ý',
        value:
          product.suggestedPrice != null ? `${product.suggestedPrice.toLocaleString()} đ` : null,
      },
      { label: 'Vị trí', value: product.location },
      { label: 'Trạng thái', value: product.status },
      { label: 'Lượt xem', value: product.viewCount != null ? product.viewCount : null },
    ]
    : [
      { label: 'Hãng', value: product.brand },
      { label: 'Loại pin', value: product.type },
      { label: 'Dung lượng', value: product.capacity != null ? `${product.capacity} kWh` : null },
      { label: 'Tình trạng pin', value: product.health != null ? `${product.health}%` : null },
      { label: 'Số chu kỳ sạc', value: product.cycleCount != null ? product.cycleCount : null },
      { label: 'Năm sản xuất', value: product.manufactureYear },
      { label: 'Tình trạng', value: product.condition },
      {
        label: 'Tương thích',
        value:
          Array.isArray(product.compatibleVehicles) && product.compatibleVehicles.length
            ? product.compatibleVehicles.join(', ')
            : null,
      },
      { label: 'Bảo hành', value: product.warranty },
      {
        label: 'Giá gợi ý',
        value:
          product.suggestedPrice != null ? `${product.suggestedPrice.toLocaleString()} đ` : null,
      },
      { label: 'Vị trí', value: product.location },
      { label: 'Trạng thái', value: product.status },
    ];

  const handleBuy = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setBuyMsg('⚠️ Bạn cần đăng nhập để mua hàng!');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      return;
    }

    setBuying(true);
    setBuyMsg('');

    try {
      // Trim để loại bỏ space thừa
      const cleanPaymentMethod = paymentMethod.trim();

      console.log('Creating transaction with:', {
        itemType: type,
        itemId: id,
        paymentMethod: cleanPaymentMethod,
      });

      await createTransaction({
        itemType: type,
        itemId: id,
        paymentMethod: cleanPaymentMethod,
      });

      setBuyMsg('✅ Đặt hàng thành công! Vui lòng kiểm tra trong "Giao dịch của tôi"');

      // Reload để cập nhật status sản phẩm
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error('Buy error:', err);
      const errorMsg = err.response?.data?.message || 'Có lỗi khi mua hàng';
      setBuyMsg('❌ ' + errorMsg);
    }

    setBuying(false);
  };

  return (
    <div className={styles['detail-container']}>
      <h1>Chi tiết sản phẩm</h1>
      <h1 className={styles['detail-title']}>{product.title || product.name || product.model}</h1>
      <div className={styles['detail-price']}>Giá: {product.price?.toLocaleString()} đ</div>

      {images.length > 0 ? (
        <div className={styles.gallery}>
          {images.map((img, idx) => (
            <img key={idx} src={img} alt={`image-${idx}`} className={styles.galleryImg} />
          ))}
        </div>
      ) : (
        <div className={styles.noImage}>Chưa có hình ảnh</div>
      )}

      <div className={styles.metaRow}>
        <div className={styles.badge}>{isVehicle ? 'Xe điện' : 'Pin'}</div>
        {product.isVerified && <div className={styles.badgeSuccess}>Đã xác minh</div>}
        {createdAt && <div className={styles.subtle}>Đăng lúc: {createdAt}</div>}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Thông tin chi tiết</h3>
        <div className={styles.infoGrid}>
          {infoRows
            .filter((r) => r.value !== null && r.value !== undefined && r.value !== '')
            .map((r, i) => (
              <div key={i} className={styles.infoItem}>
                <div className={styles.infoLabel}>{r.label}</div>
                <div className={styles.infoValue}>{r.value}</div>
              </div>
            ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Mô tả</h3>
        <div className={styles['detail-info']}>{product.description || 'Không có mô tả'}</div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Người bán</h3>
        <div className={styles.sellerBox}>
          <div>
            <strong>Tên:</strong> {seller.name || '—'}
          </div>
          <div>
            <strong>Email:</strong> {seller.email || '—'}
          </div>
          <div>
            <strong>Điện thoại:</strong> {seller.phone || '—'}
          </div>
        </div>
      </div>

      {/* Phần mua hàng */}
      {product.status === 'available' && (
        <div className={styles['buy-section']}>
          <h3 className={styles.sectionTitle}>Phương thức thanh toán</h3>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className={styles['payment-select']}
            disabled={buying}
          >
            <option value="cash">� Tiền mặt</option>
            <option value="bank_transfer">🏦 Chuyển khoản ngân hàng</option>
            <option value="stripe">� Thẻ tín dụng (Stripe)</option>
            <option value="paypal">💰 PayPal</option>
          </select>

          <button
            onClick={handleBuy}
            disabled={buying}
            className={styles['detail-buy-btn']}
          >
            {buying ? '⏳ Đang xử lý...' : '🛒 Mua ngay'}
          </button>

          {buyMsg && (
            <div
              className={styles['buy-message']}
              style={{
                color: buyMsg.includes('thành công') ? '#49cc90' : '#ff4444',
                marginTop: '10px',
                padding: '10px',
                borderRadius: '5px',
                backgroundColor: buyMsg.includes('thành công') ? '#e8f5e9' : '#ffebee',
              }}
            >
              {buyMsg}
            </div>
          )}
        </div>
      )}

      {product.status === 'pending' && (
        <div className={styles['status-message']} style={{ color: '#ff9800' }}>
          ⏳ Sản phẩm đang trong giao dịch
        </div>
      )}

      {product.status === 'sold' && (
        <div className={styles['status-message']} style={{ color: '#f44336' }}>
          ❌ Sản phẩm đã được bán
        </div>
      )}

      {/* Reviews Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Đánh giá từ người mua</h3>
        <ReviewList
          reviews={reviews}
          stats={reviewStats}
          loading={reviewsLoading}
          showActions={false}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;

import { useEffect, useState } from 'react';
import { fetchMyTransactions } from '../../services/transactionService';
import {
  createReview,
  updateReview,
  deleteReview,
  fetchTransactionReview,
  respondToReview,
} from '../../services/reviewService';
import styles from './TransactionsPage.module.css';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  // Modals
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currentReview, setCurrentReview] = useState(null);

  // Form states
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [responseForm, setResponseForm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const currentUserId = getUserId();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetchMyTransactions();
      const data = res.data.data?.transactions || res.data?.transactions || [];
      setTransactions(data);
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError(err.response?.data?.message || 'Không lấy được giao dịch');
    } finally {
      setLoading(false);
    }
  };

  // Open detail modal
  const handleOpenDetail = async (transaction) => {
    setSelectedTransaction(transaction);
    setCurrentReview(null); // Reset review state

    // Load review if exists
    if (transaction.status === 'completed') {
      try {
        console.log('🔍 Loading review for transaction:', transaction._id);
        const res = await fetchTransactionReview(transaction._id);
        console.log('✅ Review response:', res.data);

        const reviewData = res.data.data;
        if (reviewData) {
          console.log('✅ Review found:', reviewData);
          setCurrentReview(reviewData);
          setResponseForm(reviewData?.sellerResponse?.comment || '');
        } else {
          console.log('ℹ️ No review found for this transaction');
          setCurrentReview(null);
        }
      } catch (err) {
        console.error('❌ Error loading review:', err);
        console.error('❌ Error response:', err.response?.data);
        setCurrentReview(null);
      }
    }

    setShowDetailModal(true);
  };

  // Open review form modal
  const handleOpenReviewForm = (transaction, existingReview = null) => {
    setSelectedTransaction(transaction);
    setCurrentReview(existingReview);

    if (existingReview) {
      setReviewForm({
        rating: existingReview.rating,
        comment: existingReview.comment || '',
      });
    } else {
      setReviewForm({ rating: 5, comment: '' });
    }

    setShowDetailModal(false);
    setShowReviewModal(true);
  };

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedTransaction) return;

    const isBuyer = selectedTransaction.buyerId?._id === currentUserId;
    const reviewedUserId = isBuyer
      ? selectedTransaction.sellerId._id
      : selectedTransaction.buyerId._id;

    setSubmitting(true);

    try {
      if (currentReview) {
        await updateReview(currentReview._id, reviewForm);
        alert('✅ Cập nhật đánh giá thành công!');
      } else {
        await createReview({
          transactionId: selectedTransaction._id,
          reviewedUserId,
          ...reviewForm,
        });
        alert('✅ Đánh giá thành công!');
      }

      setShowReviewModal(false);
      await loadTransactions();
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('❌ ' + (err.response?.data?.message || 'Không thể gửi đánh giá'));
    } finally {
      setSubmitting(false);
    }
  };

  // Delete review
  const handleDeleteReview = async () => {
    if (!currentReview || !window.confirm('Bạn có chắc muốn xóa đánh giá?')) return;

    setSubmitting(true);
    try {
      await deleteReview(currentReview._id);
      alert('✅ Đã xóa đánh giá');
      setShowDetailModal(false);
      await loadTransactions();
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('❌ ' + (err.response?.data?.message || 'Không thể xóa'));
    } finally {
      setSubmitting(false);
    }
  };

  // Submit seller response
  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!currentReview || !responseForm.trim()) return;

    setSubmitting(true);
    try {
      await respondToReview(currentReview._id, { comment: responseForm });
      alert('✅ Phản hồi thành công!');

      // Reload review
      const res = await fetchTransactionReview(selectedTransaction._id);
      setCurrentReview(res.data.data);
    } catch (err) {
      console.error('Error submitting response:', err);
      alert('❌ ' + (err.response?.data?.message || 'Không thể gửi phản hồi'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles['transactions-container']}>
      <h1 className={styles['transactions-title']}>Lịch sử giao dịch</h1>
      <p className={styles['transactions-subtitle']}>
        Theo dõi tất cả giao dịch mua và bán của bạn
      </p>

      {/* Filter tabs */}
      <div className={styles['filter-tabs']}>
        <button
          className={`${styles['filter-tab']} ${filter === 'all' ? styles['active'] : ''}`}
          onClick={() => setFilter('all')}
        >
          📋 Tất cả ({transactions.length})
        </button>
        <button
          className={`${styles['filter-tab']} ${filter === 'buy' ? styles['active'] : ''}`}
          onClick={() => setFilter('buy')}
        >
          🛒 Đã mua ({transactions.filter((t) => t.buyerId?._id === currentUserId).length})
        </button>
        <button
          className={`${styles['filter-tab']} ${filter === 'sell' ? styles['active'] : ''}`}
          onClick={() => setFilter('sell')}
        >
          💰 Đã bán ({transactions.filter((t) => t.sellerId?._id === currentUserId).length})
        </button>
        <button
          className={`${styles['filter-tab']} ${filter === 'cancelled' ? styles['active'] : ''}`}
          onClick={() => setFilter('cancelled')}
          title="Chỉ hiển thị giao dịch đã hủy mà bạn là người mua"
        >
          ❌ Đã hủy (
          {
            transactions.filter((t) => t.status === 'cancelled' && t.buyerId?._id === currentUserId)
              .length
          }
          )
        </button>
      </div>

      {error && <div className={styles['error-message']}>⚠️ {error}</div>}

      {loading ? (
        <div className={styles['loading-container']}>
          <span className={styles['loading-spinner']}></span>
          <p>Đang tải giao dịch...</p>
        </div>
      ) : getFilteredTransactions().length === 0 ? (
        <div className={styles['empty-state']}>
          <p>
            😔{' '}
            {filter === 'buy'
              ? 'Bạn chưa mua sản phẩm nào'
              : filter === 'sell'
              ? 'Bạn chưa bán sản phẩm nào'
              : filter === 'cancelled'
              ? 'Bạn chưa có giao dịch đã hủy'
              : 'Bạn chưa có giao dịch nào'}
          </p>
          <p className={styles['empty-subtitle']}>
            Hãy bắt đầu{' '}
            {filter === 'buy'
              ? 'mua'
              : filter === 'sell'
              ? 'bán'
              : filter === 'cancelled'
              ? 'mua hoặc bán'
              : 'mua hoặc bán'}{' '}
            sản phẩm để tạo giao dịch
          </p>
        </div>
      ) : (
        <div className={styles['transactions-grid']}>
          {getFilteredTransactions().map((t) => {
            const isBuyer = t.buyerId?._id === currentUserId;

            return (
              <div
                key={t._id}
                className={styles['transaction-card-compact']}
                onClick={() => handleOpenDetail(t)}
              >
                {/* Role badge */}
                <div className={styles['card-header']}>
                  <span className={isBuyer ? styles['badge-buyer'] : styles['badge-seller']}>
                    {isBuyer ? '🛒 Đã mua' : '💰 Đã bán'}
                  </span>
                  <span className={styles['status-badge']}>{getStatusBadge(t.status)}</span>
                </div>

                {/* Product image */}
                {t.itemId?.images?.[0] && (
                  <div className={styles['product-image-container']}>
                    <img
                      src={t.itemId.images[0]}
                      alt={t.itemId.title || 'Product'}
                      className={styles['product-image']}
                    />
                  </div>
                )}

                {/* Product info */}
                <div className={styles['card-body']}>
                  <div className={styles['product-title']}>
                    {t.itemId?.title ||
                      t.itemId?.brand ||
                      (t.itemType === 'vehicle' ? 'Xe điện' : 'Pin')}
                  </div>
                  {t.itemId?.model && (
                    <div className={styles['product-model']}>{t.itemId.model}</div>
                  )}
                  <div className={styles['partner-name']}>
                    {isBuyer ? t.sellerId?.name : t.buyerId?.name}
                  </div>
                  <div className={styles['price-main']}>
                    {isBuyer ? t.totalAmount?.toLocaleString() : t.price?.toLocaleString()}đ
                  </div>
                </div>

                {/* Footer */}
                <div className={styles['card-footer']}>
                  <small>{new Date(t.createdAt).toLocaleDateString('vi-VN')}</small>
                  <button className={styles['btn-view-detail']}>Chi tiết →</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <div className={styles['modal-overlay']} onClick={() => setShowDetailModal(false)}>
          <div className={styles['modal-content-large']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h2>Chi tiết giao dịch</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className={styles['btn-close-modal']}
              >
                ✕
              </button>
            </div>

            <div className={styles['modal-body']}>
              {/* Product Image */}
              {selectedTransaction.itemId?.images?.[0] && (
                <div className={styles['modal-product-image']}>
                  <img
                    src={selectedTransaction.itemId.images[0]}
                    alt={selectedTransaction.itemId.title || 'Product'}
                  />
                </div>
              )}

              {/* Product details */}
              <div className={styles['detail-section']}>
                <h3>Thông tin sản phẩm</h3>
                <div className={styles['detail-grid']}>
                  <div>
                    <strong>Tên:</strong> {selectedTransaction.itemId?.title || 'N/A'}
                  </div>
                  {selectedTransaction.itemId?.brand && (
                    <div>
                      <strong>Hãng:</strong> {selectedTransaction.itemId.brand}
                    </div>
                  )}
                  {selectedTransaction.itemId?.model && (
                    <div>
                      <strong>Model:</strong> {selectedTransaction.itemId.model}
                    </div>
                  )}
                  <div>
                    <strong>Loại:</strong>{' '}
                    {selectedTransaction.itemType === 'vehicle' ? 'Xe điện' : 'Pin'}
                  </div>
                </div>
              </div>

              {/* Transaction details */}
              <div className={styles['detail-section']}>
                <h3>Thông tin giao dịch</h3>
                <div className={styles['detail-grid']}>
                  <div>
                    <strong>Trạng thái:</strong> {getStatusBadge(selectedTransaction.status)}
                  </div>
                  <div>
                    <strong>Giá sản phẩm:</strong> {selectedTransaction.price?.toLocaleString()}đ
                  </div>
                  <div>
                    <strong>Hoa hồng:</strong> {selectedTransaction.commission?.toLocaleString()}đ
                  </div>
                  <div>
                    <strong>Tổng:</strong> {selectedTransaction.totalAmount?.toLocaleString()}đ
                  </div>
                  <div>
                    <strong>Thanh toán:</strong>{' '}
                    {getPaymentMethodLabel(selectedTransaction.paymentMethod)}
                  </div>
                </div>
              </div>

              {/* Partner info */}
              <div className={styles['detail-section']}>
                <h3>
                  {selectedTransaction.buyerId?._id === currentUserId ? 'Người bán' : 'Người mua'}
                </h3>
                <div className={styles['detail-grid']}>
                  <div>
                    <strong>Tên:</strong>{' '}
                    {selectedTransaction.buyerId?._id === currentUserId
                      ? selectedTransaction.sellerId?.name
                      : selectedTransaction.buyerId?.name}
                  </div>
                  <div>
                    <strong>Email:</strong>{' '}
                    {selectedTransaction.buyerId?._id === currentUserId
                      ? selectedTransaction.sellerId?.email
                      : selectedTransaction.buyerId?.email}
                  </div>
                </div>
              </div>

              {/* Review section */}
              {selectedTransaction.status === 'completed' && (
                <div className={styles['detail-section']}>
                  <h3>Đánh giá</h3>

                  {currentReview ? (
                    <div className={styles['review-display']}>
                      <div className={styles['review-header']}>
                        <div>
                          <strong>{currentReview.reviewerId?.name}</strong>
                          <div className={styles['star-rating']}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={
                                  star <= currentReview.rating
                                    ? styles['star-filled']
                                    : styles['star-empty']
                                }
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <small>
                          {new Date(currentReview.createdAt).toLocaleDateString('vi-VN')}
                        </small>
                      </div>

                      {currentReview.comment && (
                        <p className={styles['review-comment']}>{currentReview.comment}</p>
                      )}

                      {/* Seller response */}
                      {currentReview.sellerResponse && (
                        <div className={styles['seller-response']}>
                          <strong>Phản hồi từ người bán:</strong>
                          <p>{currentReview.sellerResponse.comment}</p>
                          <small>
                            {new Date(currentReview.sellerResponse.respondedAt).toLocaleDateString(
                              'vi-VN'
                            )}
                          </small>
                        </div>
                      )}

                      {/* Buyer actions */}
                      {currentReview.reviewerId._id === currentUserId && (
                        <div className={styles['review-actions']}>
                          <button
                            onClick={() => handleOpenReviewForm(selectedTransaction, currentReview)}
                            className={styles['btn-edit']}
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            onClick={handleDeleteReview}
                            className={styles['btn-delete']}
                            disabled={submitting}
                          >
                            🗑️ Xóa
                          </button>
                        </div>
                      )}

                      {/* Seller response form */}
                      {selectedTransaction.sellerId?._id === currentUserId && (
                        <form onSubmit={handleSubmitResponse} className={styles['response-form']}>
                          <label>
                            {currentReview.sellerResponse
                              ? 'Chỉnh sửa phản hồi:'
                              : 'Phản hồi đánh giá:'}
                          </label>
                          <textarea
                            value={responseForm}
                            onChange={(e) => setResponseForm(e.target.value)}
                            placeholder="Viết phản hồi..."
                            rows="3"
                            required
                          />
                          <button type="submit" disabled={submitting || !responseForm.trim()}>
                            {submitting ? 'Đang gửi...' : 'Gửi phản hồi'}
                          </button>
                        </form>
                      )}
                    </div>
                  ) : (
                    // No review yet
                    <div>
                      {selectedTransaction.buyerId?._id === currentUserId ? (
                        <button
                          onClick={() => handleOpenReviewForm(selectedTransaction)}
                          className={styles['btn-create-review']}
                        >
                          ⭐ Đánh giá ngay
                        </button>
                      ) : (
                        <p className={styles['no-review']}>Chưa có đánh giá</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewModal && selectedTransaction && (
        <div className={styles['modal-overlay']} onClick={() => setShowReviewModal(false)}>
          <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
            <h2>{currentReview ? 'Chỉnh sửa đánh giá' : 'Đánh giá'}</h2>

            <form onSubmit={handleSubmitReview} className={styles['review-form']}>
              <div className={styles['form-group']}>
                <label>Đánh giá:</label>
                <div className={styles['star-rating']}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={
                        star <= reviewForm.rating ? styles['star-filled'] : styles['star-empty']
                      }
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      style={{ cursor: 'pointer', fontSize: '32px' }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles['form-group']}>
                <label>Nhận xét:</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Chia sẻ trải nghiệm của bạn..."
                  rows="4"
                />
              </div>

              <div className={styles['form-actions']}>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className={styles['btn-cancel']}
                >
                  Hủy
                </button>
                <button type="submit" className={styles['btn-submit']} disabled={submitting}>
                  {submitting ? 'Đang gửi...' : currentReview ? 'Cập nhật' : 'Gửi đánh giá'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  function getFilteredTransactions() {
    if (filter === 'buy') {
      return transactions.filter((t) => t.buyerId?._id === currentUserId);
    } else if (filter === 'sell') {
      return transactions.filter((t) => t.sellerId?._id === currentUserId);
    } else if (filter === 'cancelled') {
      // Chỉ hiển thị giao dịch đã hủy mà bạn là người mua
      return transactions.filter(
        (t) => t.status === 'cancelled' && t.buyerId?._id === currentUserId
      );
    }
    // Mặc định (Tất cả): ẩn giao dịch đã hủy nếu bạn là người bán
    return transactions.filter(
      (t) => !(t.status === 'cancelled' && t.sellerId?._id === currentUserId)
    );
  }
};

// Helper functions
const getStatusBadge = (status) => {
  const statusMap = {
    pending: { label: '⏳ Chờ xử lý', class: 'status-pending' },
    confirmed: { label: '✅ Đã xác nhận', class: 'status-confirmed' },
    completed: { label: '🎉 Hoàn thành', class: 'status-completed' },
    cancelled: { label: '❌ Đã hủy', class: 'status-cancelled' },
    disputed: { label: '⚠️ Tranh chấp', class: 'status-disputed' },
  };

  const statusInfo = statusMap[status] || { label: status, class: 'status-default' };
  return statusInfo.label;
};

const getPaymentMethodLabel = (method) => {
  const methodMap = {
    stripe: '💳 Thẻ tín dụng',
    paypal: '💰 PayPal',
    cash: '💵 Tiền mặt',
    bank_transfer: '🏦 Chuyển khoản',
  };
  return methodMap[method] || method;
};

// Note: payment status label helper removed due to not being used

const getUserId = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.warn('⚠️ No user found in localStorage');
      return null;
    }

    const user = JSON.parse(userStr);
    console.log('👤 Current user from localStorage:', user);
    console.log('👤 User ID:', user._id || user.id);

    return user._id || user.id;
  } catch (error) {
    console.error('❌ Error parsing user from localStorage:', error);
    return null;
  }
};

export default TransactionsPage;

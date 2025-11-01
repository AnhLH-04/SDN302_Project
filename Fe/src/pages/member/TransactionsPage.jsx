import { useEffect, useState } from 'react';
import { fetchMyTransactions } from '../../services/transactionService';
import styles from './TransactionsPage.module.css';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'buy', 'sell'

  const currentUserId = getUserId();

  useEffect(() => {
    setLoading(true);
    setError('');

    console.log('🔄 Fetching my transactions...');

    fetchMyTransactions()
      .then((res) => {
        console.log('✅ Response:', res);
        console.log('✅ Data:', res.data);

        const transactions = res.data.data?.transactions || res.data?.transactions || [];
        console.log('✅ Transactions:', transactions);

        setTransactions(transactions);
      })
      .catch((err) => {
        console.error('❌ Error:', err);
        console.error('❌ Response:', err.response);

        const errorMsg = err.response?.data?.message || 'Không lấy được giao dịch';
        setError(errorMsg);
      })
      .finally(() => setLoading(false));
  }, []);

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
          🛒 Đã mua ({transactions.filter(t => t.buyerId?._id === currentUserId).length})
        </button>
        <button
          className={`${styles['filter-tab']} ${filter === 'sell' ? styles['active'] : ''}`}
          onClick={() => setFilter('sell')}
        >
          💰 Đã bán ({transactions.filter(t => t.sellerId?._id === currentUserId).length})
        </button>
      </div>

      {error && (
        <div className={styles['error-message']}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className={styles['loading-container']}>
          <span className={styles['loading-spinner']}></span>
          <p>Đang tải giao dịch...</p>
        </div>
      ) : getFilteredTransactions().length === 0 ? (
        <div className={styles['empty-state']}>
          <p>😔 {filter === 'buy' ? 'Bạn chưa mua sản phẩm nào' : filter === 'sell' ? 'Bạn chưa bán sản phẩm nào' : 'Bạn chưa có giao dịch nào'}</p>
          <p className={styles['empty-subtitle']}>
            Hãy bắt đầu {filter === 'buy' ? 'mua' : filter === 'sell' ? 'bán' : 'mua hoặc bán'} sản phẩm để tạo giao dịch
          </p>
        </div>
      ) : (
        <div className={styles['transactions-table']}>
          {getFilteredTransactions().map((t) => {
            const isBuyer = t.buyerId?._id === currentUserId;
            const isSeller = t.sellerId?._id === currentUserId;

            return (
              <div key={t._id} className={styles['transaction-card']}>
                {/* Badge hiển thị vai trò */}
                <div className={styles['role-badge-container']}>
                  {isBuyer && <span className={styles['role-badge-buyer']}>🛒 Người mua</span>}
                  {isSeller && <span className={styles['role-badge-seller']}>💰 Người bán</span>}
                </div>

                <div className={styles['transaction-header']}>
                  <div className={styles['product-info']}>
                    <span className={styles['transaction-type']}>
                      {t.itemType === 'vehicle' ? '🚗 Xe điện' : '🔋 Pin'}
                    </span>
                    <span className={styles['product-id']}>
                      ID: {t.itemId?.slice(-8)}
                    </span>
                  </div>
                  <span className={styles['transaction-status']}>
                    {getStatusBadge(t.status)}
                  </span>
                </div>

                <div className={styles['transaction-details']}>
                  {/* Thông tin đối tác giao dịch */}
                  <div className={styles['partner-info']}>
                    <div className={styles['detail-row-highlight']}>
                      <span className={styles['label']}>
                        {isBuyer ? '👤 Người bán:' : '👤 Người mua:'}
                      </span>
                      <span className={styles['value']}>
                        {isBuyer ? t.sellerId?.name : t.buyerId?.name}
                      </span>
                    </div>
                    <div className={styles['detail-row']}>
                      <span className={styles['label']}>📧 Email:</span>
                      <span className={styles['value']}>
                        {isBuyer ? t.sellerId?.email : t.buyerId?.email}
                      </span>
                    </div>
                    {(isBuyer ? t.sellerId?.phone : t.buyerId?.phone) && (
                      <div className={styles['detail-row']}>
                        <span className={styles['label']}>📱 Điện thoại:</span>
                        <span className={styles['value']}>
                          {isBuyer ? t.sellerId?.phone : t.buyerId?.phone}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className={styles['divider']}></div>

                  {/* Thông tin giá */}
                  <div className={styles['price-info']}>
                    <div className={styles['detail-row']}>
                      <span className={styles['label']}>💵 Giá sản phẩm:</span>
                      <span className={styles['value']}>{t.price?.toLocaleString()}đ</span>
                    </div>

                    <div className={styles['detail-row']}>
                      <span className={styles['label']}>💳 Hoa hồng (5%):</span>
                      <span className={styles['value']}>{t.commission?.toLocaleString()}đ</span>
                    </div>

                    <div className={styles['detail-row-highlight']}>
                      <span className={styles['label']}>
                        {isBuyer ? '💰 Tổng thanh toán:' : '💰 Tổng nhận được:'}
                      </span>
                      <span className={styles['value-highlight']}>
                        {isBuyer
                          ? t.totalAmount?.toLocaleString()
                          : t.price?.toLocaleString()}đ
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className={styles['divider']}></div>

                  {/* Thông tin thanh toán */}
                  <div className={styles['detail-row']}>
                    <span className={styles['label']}>💳 Phương thức thanh toán:</span>
                    <span className={styles['value']}>{getPaymentMethodLabel(t.paymentMethod)}</span>
                  </div>

                  {t.paymentStatus && (
                    <div className={styles['detail-row']}>
                      <span className={styles['label']}>💸 Trạng thái thanh toán:</span>
                      <span className={styles['value']}>{getPaymentStatusLabel(t.paymentStatus)}</span>
                    </div>
                  )}

                  {t.notes && (
                    <div className={styles['notes-section']}>
                      <span className={styles['label']}>📝 Ghi chú:</span>
                      <p className={styles['notes-text']}>{t.notes}</p>
                    </div>
                  )}
                </div>

                <div className={styles['transaction-footer']}>
                  <small>🕒 {new Date(t.createdAt).toLocaleString('vi-VN')}</small>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // Filter transactions based on selected tab
  function getFilteredTransactions() {
    console.log('🔍 Filtering transactions...');
    console.log('🔍 Current filter:', filter);
    console.log('🔍 Current user ID:', currentUserId);
    console.log('🔍 Total transactions:', transactions.length);

    if (filter === 'buy') {
      const buyTransactions = transactions.filter(t => {
        const match = t.buyerId?._id === currentUserId;
        console.log(`  Transaction ${t._id}: buyerId=${t.buyerId?._id}, match=${match}`);
        return match;
      });
      console.log('🔍 Buy transactions:', buyTransactions.length);
      return buyTransactions;
    } else if (filter === 'sell') {
      const sellTransactions = transactions.filter(t => {
        const match = t.sellerId?._id === currentUserId;
        console.log(`  Transaction ${t._id}: sellerId=${t.sellerId?._id}, match=${match}`);
        return match;
      });
      console.log('🔍 Sell transactions:', sellTransactions.length);
      return sellTransactions;
    }
    console.log('🔍 All transactions:', transactions.length);
    return transactions;
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

const getPaymentStatusLabel = (status) => {
  const statusMap = {
    unpaid: '⏳ Chưa thanh toán',
    paid: '✅ Đã thanh toán',
    refunded: '↩️ Đã hoàn tiền',
  };
  return statusMap[status] || status;
};

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

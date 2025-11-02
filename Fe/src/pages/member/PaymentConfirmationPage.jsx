import { useEffect, useState } from 'react';
import { fetchMyTransactions, updateTransactionStatus } from '../../services/transactionService';
import styles from './PaymentConfirmationPage.module.css';

const PaymentConfirmationPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processingId, setProcessingId] = useState(null);

    const currentUserId = getUserId();

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetchMyTransactions();
            const allTransactions = res.data.data?.transactions || res.data?.transactions || [];

            // Lọc chỉ lấy transactions đang pending hoặc confirmed
            const pendingTransactions = allTransactions.filter(
                t => t.status === 'pending' || t.status === 'confirmed'
            );

            setTransactions(pendingTransactions);
        } catch (err) {
            console.error('Error loading transactions:', err);
            setError(err.response?.data?.message || 'Không thể tải giao dịch');
        }
        setLoading(false);
    };

    const handleConfirmPayment = async (transactionId, currentStatus) => {
        if (!confirm('Bạn có chắc muốn xác nhận thanh toán?')) {
            return;
        }

        setProcessingId(transactionId);

        try {
            // Nếu pending -> chuyển sang confirmed
            // Nếu confirmed -> chuyển sang completed
            const newStatus = currentStatus === 'pending' ? 'confirmed' : 'completed';

            await updateTransactionStatus(transactionId, { status: newStatus });

            alert(`✅ Đã xác nhận thành công! Trạng thái: ${getStatusLabel(newStatus)}`);

            // Reload transactions
            loadTransactions();
        } catch (err) {
            console.error('Error confirming payment:', err);
            const errorMsg = err.response?.data?.message || 'Không thể xác nhận thanh toán';
            alert('❌ ' + errorMsg);
        }

        setProcessingId(null);
    };

    const handleCancelTransaction = async (transactionId) => {
        if (!confirm('Bạn có chắc muốn hủy giao dịch này?')) {
            return;
        }

        setProcessingId(transactionId);

        try {
            await updateTransactionStatus(transactionId, { status: 'cancelled' });
            alert('✅ Đã hủy giao dịch');
            loadTransactions();
        } catch (err) {
            console.error('Error cancelling transaction:', err);
            const errorMsg = err.response?.data?.message || 'Không thể hủy giao dịch';
            alert('❌ ' + errorMsg);
        }

        setProcessingId(null);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Đang tải...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>{error}</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>💳 Xác nhận thanh toán</h1>
            <p className={styles.subtitle}>
                Quản lý các giao dịch đang chờ thanh toán và xác nhận hoàn thành
            </p>

            {transactions.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>📭</div>
                    <h3>Không có giao dịch cần xác nhận</h3>
                    <p>Tất cả giao dịch của bạn đã được xử lý hoặc hoàn thành</p>
                </div>
            ) : (
                <div className={styles.transactionsList}>
                    <div className={styles.stats}>
                        <span>📊 Tổng số giao dịch cần xử lý: {transactions.length}</span>
                    </div>

                    {transactions.map((transaction) => {
                        const isBuyer = transaction.buyerId?._id === currentUserId;
                        const isSeller = transaction.sellerId?._id === currentUserId;
                        const item = transaction.itemId;
                        const isProcessing = processingId === transaction._id;

                        return (
                            <div key={transaction._id} className={styles.transactionCard}>
                                {/* Header */}
                                <div className={styles.cardHeader}>
                                    <div className={styles.statusBadge}>
                                        {getStatusBadge(transaction.status)}
                                    </div>
                                    <div className={styles.role}>
                                        {isBuyer ? '🛒 Người mua' : '💼 Người bán'}
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className={styles.productInfo}>
                                    {item?.images?.[0] && (
                                        <img
                                            src={item.images[0]}
                                            alt={item.title || item.model}
                                            className={styles.productImage}
                                        />
                                    )}
                                    <div className={styles.productDetails}>
                                        <h3 className={styles.productName}>
                                            {item?.title || `${item?.brand} ${item?.model}`}
                                        </h3>
                                        <p className={styles.productType}>
                                            {transaction.itemType === 'vehicle' ? '🚗 Xe điện' : '🔋 Pin'}
                                        </p>
                                    </div>
                                </div>

                                {/* Transaction Details */}
                                <div className={styles.details}>
                                    <div className={styles.detailRow}>
                                        <span className={styles.label}>Giá sản phẩm:</span>
                                        <span className={styles.value}>
                                            {transaction.price?.toLocaleString()} đ
                                        </span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.label}>Phí hoa hồng:</span>
                                        <span className={styles.value}>
                                            {transaction.commission?.toLocaleString()} đ
                                        </span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.label}>Tổng cộng:</span>
                                        <span className={styles.valueTotal}>
                                            {transaction.totalAmount?.toLocaleString()} đ
                                        </span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.label}>Phương thức:</span>
                                        <span className={styles.value}>
                                            {getPaymentMethodLabel(transaction.paymentMethod)}
                                        </span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.label}>
                                            {isBuyer ? 'Người bán:' : 'Người mua:'}
                                        </span>
                                        <span className={styles.value}>
                                            {isBuyer
                                                ? transaction.sellerId?.name
                                                : transaction.buyerId?.name}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className={styles.actions}>
                                    {isBuyer && (
                                        <>
                                            <button
                                                onClick={() => handleConfirmPayment(
                                                    transaction._id,
                                                    transaction.status
                                                )}
                                                disabled={isProcessing}
                                                className={styles.confirmBtn}
                                            >
                                                {isProcessing ? '⏳ Đang xử lý...' :
                                                    transaction.status === 'pending'
                                                        ? '✅ Xác nhận thanh toán'
                                                        : '🎉 Hoàn thành giao dịch'}
                                            </button>
                                            <button
                                                onClick={() => handleCancelTransaction(transaction._id)}
                                                disabled={isProcessing}
                                                className={styles.cancelBtn}
                                            >
                                                ❌ Hủy giao dịch
                                            </button>
                                        </>
                                    )}

                                    {isSeller && (
                                        <div className={styles.sellerInfo}>
                                            <p>
                                                {transaction.status === 'pending'
                                                    ? '⏳ Đang chờ người mua xác nhận thanh toán'
                                                    : '✅ Người mua đã xác nhận, chờ hoàn thành giao dịch'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className={styles.footer}>
                                    <small>
                                        🕒 {new Date(transaction.createdAt).toLocaleString('vi-VN')}
                                    </small>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// Helper functions
const getStatusBadge = (status) => {
    const statusMap = {
        pending: { label: '⏳ Chờ thanh toán', class: 'pending' },
        confirmed: { label: '✅ Đã xác nhận', class: 'confirmed' },
    };
    return statusMap[status]?.label || status;
};

const getStatusLabel = (status) => {
    const statusMap = {
        pending: 'Chờ thanh toán',
        confirmed: 'Đã xác nhận',
        completed: 'Hoàn thành',
        cancelled: 'Đã hủy',
    };
    return statusMap[status] || status;
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

const getUserId = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        const user = JSON.parse(userStr);
        return user._id || user.id;
    } catch (error) {
        console.error('Error parsing user:', error);
        return null;
    }
};

export default PaymentConfirmationPage;

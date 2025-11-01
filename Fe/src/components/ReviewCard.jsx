import PropTypes from 'prop-types';
import styles from './ReviewCard.module.css';

const ReviewCard = ({ review, onEdit, onDelete, showActions = false }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const renderStars = (rating) => {
        return (
            <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`${styles.star} ${star <= rating ? styles.active : ''}`}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className={styles.reviewCard}>
            <div className={styles.header}>
                <div className={styles.userInfo}>
                    <img
                        src={review.reviewerId?.avatar || 'https://via.placeholder.com/50'}
                        alt={review.reviewerId?.name}
                        className={styles.avatar}
                    />
                    <div>
                        <h4 className={styles.userName}>
                            {review.reviewerId?.name || 'Người dùng'}
                        </h4>
                        <div className={styles.meta}>
                            {renderStars(review.rating)}
                            <span className={styles.date}>{formatDate(review.createdAt)}</span>
                        </div>
                    </div>
                </div>

                {showActions && (
                    <div className={styles.actions}>
                        <button
                            onClick={() => onEdit(review)}
                            className={styles.editBtn}
                            title="Chỉnh sửa"
                        >
                            ✏️
                        </button>
                        <button
                            onClick={() => onDelete(review._id)}
                            className={styles.deleteBtn}
                            title="Xóa"
                        >
                            🗑️
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <p className={styles.comment}>{review.comment}</p>

                {review.images && review.images.length > 0 && (
                    <div className={styles.images}>
                        {review.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`Review ${idx + 1}`}
                                className={styles.reviewImage}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Show transaction product info if available */}
            {review.transactionId?.itemId && (
                <div className={styles.productInfo}>
                    <span className={styles.label}>Sản phẩm:</span>
                    <span className={styles.productName}>
                        {review.transactionId.itemId.title ||
                            `${review.transactionId.itemId.brand} ${review.transactionId.itemId.model}`}
                    </span>
                </div>
            )}
        </div>
    );
};

ReviewCard.propTypes = {
    review: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        reviewerId: PropTypes.shape({
            name: PropTypes.string,
            avatar: PropTypes.string,
        }),
        rating: PropTypes.number.isRequired,
        comment: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(PropTypes.string),
        createdAt: PropTypes.string.isRequired,
        transactionId: PropTypes.shape({
            itemId: PropTypes.shape({
                title: PropTypes.string,
                brand: PropTypes.string,
                model: PropTypes.string,
            }),
        }),
    }).isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    showActions: PropTypes.bool,
};

export default ReviewCard;

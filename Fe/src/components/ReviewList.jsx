import { useState } from 'react';
import PropTypes from 'prop-types';
import ReviewCard from './ReviewCard';
import styles from './ReviewList.module.css';

const ReviewList = ({ reviews, stats, onEdit, onDelete, showActions = false, loading = false }) => {
    const [filter, setFilter] = useState('all'); // 'all', '5', '4', '3', '2', '1'

    const filteredReviews =
        filter === 'all' ? reviews : reviews.filter((r) => r.rating === parseInt(filter));

    const renderStars = (rating) => {
        return (
            <div className={styles.starsDisplay}>
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

    if (loading) {
        return <div className={styles.loading}>Đang tải đánh giá...</div>;
    }

    return (
        <div className={styles.reviewList}>
            {/* Stats Summary */}
            {stats && (
                <div className={styles.statsSection}>
                    <div className={styles.overallRating}>
                        <div className={styles.ratingNumber}>{stats.avgRating.toFixed(1)}</div>
                        {renderStars(Math.round(stats.avgRating))}
                        <div className={styles.totalReviews}>
                            {stats.totalReviews} đánh giá
                        </div>
                    </div>

                    {stats.ratingDistribution && (
                        <div className={styles.distribution}>
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = stats.ratingDistribution[star] || 0;
                                const percentage =
                                    stats.totalReviews > 0
                                        ? (count / stats.totalReviews) * 100
                                        : 0;

                                return (
                                    <button
                                        key={star}
                                        className={`${styles.distributionBar} ${filter === star.toString() ? styles.active : ''
                                            }`}
                                        onClick={() =>
                                            setFilter(filter === star.toString() ? 'all' : star.toString())
                                        }
                                    >
                                        <span className={styles.starLabel}>{star} ★</span>
                                        <div className={styles.barContainer}>
                                            <div
                                                className={styles.bar}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className={styles.count}>{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Reviews List */}
            <div className={styles.reviewsContainer}>
                {filter !== 'all' && (
                    <div className={styles.filterInfo}>
                        Hiển thị {filteredReviews.length} đánh giá {filter} sao
                        <button onClick={() => setFilter('all')} className={styles.clearFilter}>
                            Xóa bộ lọc
                        </button>
                    </div>
                )}

                {filteredReviews.length === 0 ? (
                    <div className={styles.noReviews}>
                        <p>
                            {filter === 'all'
                                ? 'Chưa có đánh giá nào'
                                : `Chưa có đánh giá ${filter} sao`}
                        </p>
                    </div>
                ) : (
                    filteredReviews.map((review) => (
                        <ReviewCard
                            key={review._id}
                            review={review}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            showActions={showActions}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

ReviewList.propTypes = {
    reviews: PropTypes.arrayOf(PropTypes.object).isRequired,
    stats: PropTypes.shape({
        totalReviews: PropTypes.number,
        avgRating: PropTypes.number,
        ratingDistribution: PropTypes.object,
    }),
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    showActions: PropTypes.bool,
    loading: PropTypes.bool,
};

export default ReviewList;

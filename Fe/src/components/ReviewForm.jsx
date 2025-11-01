import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ReviewForm.module.css';

const ReviewForm = ({ onSubmit, onCancel, initialData = null, isLoading = false }) => {
    const [rating, setRating] = useState(initialData?.rating || 0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState(initialData?.comment || '');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (rating === 0) {
            setError('Vui lòng chọn số sao đánh giá');
            return;
        }

        if (!comment.trim()) {
            setError('Vui lòng nhập nhận xét');
            return;
        }

        if (comment.trim().length < 10) {
            setError('Nhận xét phải có ít nhất 10 ký tự');
            return;
        }

        onSubmit({ rating, comment: comment.trim() });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.reviewForm}>
            <h3>{initialData ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá'}</h3>

            {error && <div className={styles.error}>{error}</div>}

            {/* Star Rating */}
            <div className={styles.ratingSection}>
                <label>Đánh giá của bạn *</label>
                <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className={`${styles.star} ${star <= (hoveredRating || rating) ? styles.active : ''
                                }`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                        >
                            ★
                        </button>
                    ))}
                    <span className={styles.ratingText}>
                        {rating > 0
                            ? ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt'][rating]
                            : 'Chưa chọn'}
                    </span>
                </div>
            </div>

            {/* Comment */}
            <div className={styles.commentSection}>
                <label htmlFor="comment">Nhận xét của bạn *</label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm và người bán..."
                    rows={5}
                    maxLength={1000}
                    disabled={isLoading}
                />
                <div className={styles.charCount}>{comment.length}/1000 ký tự</div>
            </div>

            {/* Buttons */}
            <div className={styles.actions}>
                <button
                    type="button"
                    onClick={onCancel}
                    className={styles.cancelBtn}
                    disabled={isLoading}
                >
                    Hủy
                </button>
                <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                    {isLoading ? 'Đang gửi...' : initialData ? 'Cập nhật' : 'Gửi đánh giá'}
                </button>
            </div>
        </form>
    );
};

ReviewForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    initialData: PropTypes.shape({
        rating: PropTypes.number,
        comment: PropTypes.string,
    }),
    isLoading: PropTypes.bool,
};

export default ReviewForm;

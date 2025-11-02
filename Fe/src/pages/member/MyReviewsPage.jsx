import { useEffect, useState } from 'react';
import { fetchMyReviews, updateReview, deleteReview } from '../../services/reviewService';
import ReviewCard from '../../components/ReviewCard';
import ReviewForm from '../../components/ReviewForm';
import styles from './MyReviewsPage.module.css';

const MyReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingReview, setEditingReview] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetchMyReviews();
            setReviews(res.data.data || []);
        } catch (err) {
            console.error('Error loading reviews:', err);
            setError(err.response?.data?.message || 'Không thể tải đánh giá');
        }
        setLoading(false);
    };

    const handleEdit = (review) => {
        setEditingReview(review);
        setShowEditModal(true);
    };

    const handleCloseEdit = () => {
        setShowEditModal(false);
        setEditingReview(null);
    };

    const handleSubmitEdit = async (reviewData) => {
        if (!editingReview) return;

        setSubmitting(true);
        try {
            await updateReview(editingReview._id, reviewData);
            alert('✅ Cập nhật đánh giá thành công!');
            handleCloseEdit();
            loadReviews(); // Reload reviews
        } catch (err) {
            console.error('Error updating review:', err);
            const errorMsg = err.response?.data?.message || 'Không thể cập nhật đánh giá';
            alert('❌ ' + errorMsg);
        }
        setSubmitting(false);
    };

    const handleDelete = async (reviewId) => {
        if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) {
            return;
        }

        try {
            await deleteReview(reviewId);
            alert('✅ Xóa đánh giá thành công!');
            loadReviews(); // Reload reviews
        } catch (err) {
            console.error('Error deleting review:', err);
            const errorMsg = err.response?.data?.message || 'Không thể xóa đánh giá';
            alert('❌ ' + errorMsg);
        }
    };

    if (loading) {
        return <div className={styles.loading}>Đang tải...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Đánh giá của tôi</h1>
            <p className={styles.subtitle}>Quản lý tất cả đánh giá bạn đã viết</p>

            {reviews.length === 0 ? (
                <div className={styles.empty}>
                    <p>Bạn chưa viết đánh giá nào</p>
                    <p className={styles.emptySubtitle}>
                        Hãy hoàn thành giao dịch và đánh giá người bán/mua để chia sẻ trải nghiệm
                    </p>
                </div>
            ) : (
                <div className={styles.reviewsList}>
                    <div className={styles.stats}>
                        <span>Tổng số đánh giá: {reviews.length}</span>
                    </div>

                    {reviews.map((review) => (
                        <ReviewCard
                            key={review._id}
                            review={review}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            showActions={true}
                        />
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingReview && (
                <div className={styles.modalOverlay} onClick={handleCloseEdit}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2>Chỉnh sửa đánh giá</h2>
                        <p className={styles.modalSubtitle}>
                            {editingReview.reviewedUserId?.name}
                        </p>
                        <ReviewForm
                            initialData={{
                                rating: editingReview.rating,
                                comment: editingReview.comment,
                            }}
                            onSubmit={handleSubmitEdit}
                            onCancel={handleCloseEdit}
                            isLoading={submitting}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyReviewsPage;

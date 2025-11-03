import React from 'react';

import styles from './ProfilePage.module.css';

import { useEffect, useState } from 'react';
import { getProfile, updateProfile, changePassword } from '../../services/authService';
import { notifyLogin } from '../../utils/auth';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Change password state
  const [showChangePw, setShowChangePw] = useState(false);
  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  useEffect(() => {
    setLoading(true);
    getProfile()
      .then((res) => {
        setProfile(res.data.data.user);
        setForm({
          name: res.data.data.user.name || '',
          phone: res.data.data.user.phone || '',
          address: res.data.data.user.address || '',
          avatar: res.data.data.user.avatar || '',
        });
        // Đồng bộ avatar về localStorage để Header đọc và hiển thị
        try {
          localStorage.setItem('user', JSON.stringify(res.data.data.user));
          notifyLogin(); // cho Header biết cập nhật lại avatar
        } catch {
          /* ignore storage errors */
        }
      })
      .catch(() => setError('Không lấy được thông tin'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await updateProfile(form);
      setSuccess('Cập nhật thành công!');
      setEdit(false);
      setProfile((p) => ({ ...p, ...form }));
      // Cập nhật localStorage và thông báo để Header refresh avatar
      try {
        const raw = localStorage.getItem('user');
        const current = raw ? JSON.parse(raw) : {};
        const nextUser = { ...current, ...form };
        localStorage.setItem('user', JSON.stringify(nextUser));
        notifyLogin();
      } catch {
        /* ignore storage errors */
      }
    } catch {
      setError('Cập nhật thất bại');
    }
  };

  const handlePwChange = (e) => {
    setPwForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    const { currentPassword, newPassword, confirmPassword } = pwForm;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (newPassword.length < 6) {
      setPwError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword === currentPassword) {
      setPwError('Mật khẩu mới phải khác mật khẩu hiện tại');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('Xác nhận mật khẩu không khớp');
      return;
    }

    try {
      setPwLoading(true);
      await changePassword({ currentPassword, newPassword });
      setPwSuccess('Đổi mật khẩu thành công!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Không thể đổi mật khẩu';
      setPwError(msg);
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  const renderStars = (rating) => {
    return (
      <span className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= Math.round(rating) ? styles.starActive : styles.star}>
            ★
          </span>
        ))}
      </span>
    );
  };

  return (
    <div className={styles['profile-container']}>
      <h1 className={styles['profile-title']}>Hồ sơ cá nhân</h1>
      {!edit ? (
        <div>
          <img src={profile.avatar || 'https://via.placeholder.com/100'} alt="avatar" width={100} />
          <p className={styles['profile-info']}>Họ tên: {profile.name}</p>
          <p className={styles['profile-info']}>Email: {profile.email}</p>
          <p className={styles['profile-info']}>Số điện thoại: {profile.phone}</p>
          <p className={styles['profile-info']}>Địa chỉ: {profile.address}</p>

          {/* Rating section - only show if user has received reviews */}
          {profile.reviewCount && profile.reviewCount > 0 && (
            <div className={styles.ratingSection}>
              <p className={styles['profile-info']}>
                <strong>Đánh giá:</strong> {renderStars(profile.avgRating || 0)}{' '}
                <span className={styles.ratingText}>
                  {(profile.avgRating || 0).toFixed(1)} ({profile.reviewCount} đánh giá)
                </span>
              </p>
            </div>
          )}

          <button className={styles['profile-edit-btn']} onClick={() => setEdit(true)}>
            Chỉnh sửa
          </button>

          {/* Change Password Section */}
          <div style={{ marginTop: 24 }}>
            <button
              className={styles['profile-edit-btn']}
              onClick={() => setShowChangePw((v) => !v)}
              type="button"
            >
              {showChangePw ? 'Ẩn đổi mật khẩu' : 'Đổi mật khẩu'}
            </button>

            {showChangePw && (
              <form
                onSubmit={handleChangePassword}
                className={styles['profile-form']}
                style={{ marginTop: 16 }}
              >
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Mật khẩu hiện tại"
                  value={pwForm.currentPassword}
                  onChange={handlePwChange}
                  required
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Mật khẩu mới (>= 6 ký tự)"
                  value={pwForm.newPassword}
                  onChange={handlePwChange}
                  required
                  minLength={6}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu mới"
                  value={pwForm.confirmPassword}
                  onChange={handlePwChange}
                  required
                  minLength={6}
                />
                <button type="submit" disabled={pwLoading}>
                  {pwLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}
                </button>
                {pwSuccess && <div style={{ color: 'green' }}>{pwSuccess}</div>}
                {pwError && <div style={{ color: 'red' }}>{pwError}</div>}
              </form>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles['profile-form']}>
          <input
            name="name"
            placeholder="Họ tên"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={handleChange}
          />
          <input
            name="address"
            placeholder="Địa chỉ"
            value={form.address}
            onChange={handleChange}
          />
          <input
            name="avatar"
            placeholder="Link ảnh đại diện"
            value={form.avatar}
            onChange={handleChange}
          />
          <button type="submit">Lưu</button>
          <button type="button" onClick={() => setEdit(false)}>
            Hủy
          </button>
        </form>
      )}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default ProfilePage;

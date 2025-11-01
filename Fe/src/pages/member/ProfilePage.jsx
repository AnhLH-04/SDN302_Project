import React from 'react';

import styles from './ProfilePage.module.css';

import { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../../services/authService';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    } catch (err) {
      setError('Cập nhật thất bại');
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

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
          <button className={styles['profile-edit-btn']} onClick={() => setEdit(true)}>
            Chỉnh sửa
          </button>
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

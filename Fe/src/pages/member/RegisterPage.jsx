// import React from 'react';

// import styles from './RegisterPage.module.css';

// import { useState } from 'react';
// import { register } from '../../services/authService';

// const RegisterPage = () => {
//   const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');
//     try {
//       await register(form);
//       setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
//       setTimeout(() => (window.location.href = '/login'), 1500);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Đăng ký thất bại');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className={styles['register-container']}>
//       <h1 className={styles['register-title']}>Đăng ký</h1>
//       <form onSubmit={handleSubmit} className={styles['register-form']}>
//         <input
//           name="name"
//           placeholder="Họ tên"
//           value={form.name}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="phone"
//           placeholder="Số điện thoại"
//           value={form.phone}
//           onChange={handleChange}
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Mật khẩu"
//           value={form.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit" className={styles['register-btn']} disabled={loading}>
//           {loading ? 'Đang đăng ký...' : 'Đăng ký'}
//         </button>
//         {error && <div style={{ color: 'red' }}>{error}</div>}
//         {success && <div style={{ color: 'green' }}>{success}</div>}
//       </form>
//     </div>
//   );
// };

// export default RegisterPage;

import React from 'react';
import styles from './RegisterPage.module.css';
import { useState } from 'react';
import { register } from '../../services/authService';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await register(form);
      setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
      setTimeout(() => (window.location.href = '/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
    setLoading(false);
  };

  return (
    <div className={styles['register-container']}>
      <h1 className={styles['register-title']}>Đăng ký</h1>
      <p className={styles['register-subtitle']}>Tạo tài khoản mới để bắt đầu</p>

      <form onSubmit={handleSubmit} className={styles['register-form']}>
        <input
          name="name"
          placeholder="Họ tên"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
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
          name="password"
          type="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className={styles['register-btn']} disabled={loading}>
          {loading ? (
            <>
              <span className={styles['loading-spinner']}></span>
              Đang đăng ký...
            </>
          ) : (
            'Đăng ký'
          )}
        </button>

        {error && <div className={styles['error-message']}>{error}</div>}
        {success && <div className={styles['success-message']}>{success}</div>}
      </form>

      <div className={styles['register-footer']}>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '10px' }}>
          Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

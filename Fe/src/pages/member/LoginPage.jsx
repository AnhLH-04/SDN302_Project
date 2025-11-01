// import React from 'react';

// import styles from './LoginPage.module.css';

// import { useState } from 'react';
// import { login } from '../../services/authService';

// const LoginPage = () => {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     try {
//       const res = await login(form);
//       localStorage.setItem('token', res.data.data.token);
//       localStorage.setItem('user', JSON.stringify(res.data.data.user));
//       window.location.href = '/';
//     } catch (err) {
//       setError(err.response?.data?.message || 'Đăng nhập thất bại');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className={styles['login-container']}>
//       <h1 className={styles['login-title']}>Đăng nhập</h1>
//       <form onSubmit={handleSubmit} className={styles['login-form']}>
//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Mật khẩu"
//           value={form.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit" className={styles['login-btn']} disabled={loading}>
//           {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
//         </button>
//         {error && <div style={{ color: 'red' }}>{error}</div>}
//       </form>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState } from 'react';
import { login } from '../../services/authService';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      const role = res?.data?.data?.user?.role;
      window.location.href = role === 'admin' ? '/admin' : '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
    setLoading(false);
  };

  return (
    <div className={styles['login-container']}>
      <h1 className={styles['login-title']}>Đăng nhập</h1>
      <p className={styles['login-subtitle']}>Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục</p>

      <form onSubmit={handleSubmit} className={styles['login-form']}>
        <input
          name="email"
          type="email"
          placeholder="📧 Email của bạn"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="🔒 Mật khẩu"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className={styles['login-btn']} disabled={loading}>
          {loading ? (
            <>
              <span className={styles['loading-spinner']}></span>
              Đang xử lý...
            </>
          ) : (
            'Đăng nhập'
          )}
        </button>

        {error && <div className={styles['error-message']}>⚠️ {error}</div>}
      </form>

      <div className={styles.divider}>
        <span>hoặc</span>
      </div>

      <div className={styles['login-footer']}>
        Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
      </div>
    </div>
  );
};

export default LoginPage;

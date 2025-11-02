import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getUserRole, isAuthenticated, logout } from '../utils/auth';
import './Header.css';
function Header() {
  const navigate = useNavigate();
  const role = getUserRole();
  const isAuth = isAuthenticated();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarOk, setAvatarOk] = useState(true);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load avatar from localStorage user and keep in sync with auth events
  useEffect(() => {
    const loadAvatar = () => {
      try {
        const raw = localStorage.getItem('user');
        if (!raw) {
          setAvatarUrl(null);
          setAvatarOk(true);
          return;
        }
        const user = JSON.parse(raw);
        const url = user?.avatar || user?.photo || user?.avatarUrl || null;
        setAvatarUrl(url);
        setAvatarOk(true);
      } catch {
        setAvatarUrl(null);
        setAvatarOk(true);
      }
    };
    loadAvatar();
    const onLogin = () => loadAvatar();
    const onLogout = () => loadAvatar();
    window.addEventListener('auth:login', onLogin);
    window.addEventListener('auth:logout', onLogout);
    const onStorage = (e) => {
      if (e.key === 'user') loadAvatar();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('auth:login', onLogin);
      window.removeEventListener('auth:logout', onLogout);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="nav-logo">
          EV Platform
        </Link>
        <div className="nav-links">
          {/* Links chỉ hiển thị cho non-admin: Trang chủ, Sản phẩm, So sánh xe, So sánh pin */}
          {role !== 'admin' && (
            <>
              <Link to="/">Trang chủ</Link>
              <Link to="/products">Sản phẩm</Link>
              <Link to="/compare/vehicles">So sánh xe</Link>
              <Link to="/compare/batteries">So sánh pin</Link>
            </>
          )}

          {/* Đăng tin: chỉ cho member đăng nhập */}
          {isAuth && role !== 'admin' && <Link to="/add-product">Đăng tin</Link>}

          {/* Icon user + menu: ẩn hoàn toàn với admin */}
          {isAuth && role !== 'admin' && (
            <div className="user-menu" ref={menuRef}>
              <button
                className="user-icon"
                onClick={() => setOpenMenu((v) => !v)}
                aria-label="User menu"
              >
                {avatarUrl && avatarOk ? (
                  <img src={avatarUrl} alt="Avatar" onError={() => setAvatarOk(false)} />
                ) : (
                  <span>👤</span>
                )}
              </button>
              {openMenu && (
                <ul className="menu-dropdown">
                  <li>
                    <Link to="/profile" onClick={() => setOpenMenu(false)}>
                      Hồ sơ
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-posts" onClick={() => setOpenMenu(false)}>
                      Tin của tôi
                    </Link>
                  </li>
                  <li>
                    <Link to="/transactions" onClick={() => setOpenMenu(false)}>
                      Giao dịch
                    </Link>
                  </li>
                  <li>
                    <Link to="/payment-confirmation" onClick={() => setOpenMenu(false)}>
                      Thanh toán
                    </Link>
                  </li>
                  <li>
                    <Link to="/favorites" onClick={() => setOpenMenu(false)}>
                      Yêu thích
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          )}

          {/* Auth buttons */}
          {!isAuth ? (
            <>
              <Link to="/login">Đăng nhập</Link>
              <Link to="/register">Đăng ký</Link>
            </>
          ) : (
            <button className="nav-logout" onClick={handleLogout}>
              Đăng xuất
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;

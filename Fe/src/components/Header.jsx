import { Link, useNavigate } from 'react-router-dom';
import { getUserRole, isAuthenticated, logout } from '../utils/auth';
import './Header.css';
function Header() {
  const navigate = useNavigate();
  const role = getUserRole();
  const isAuth = isAuthenticated();

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
          {/* Chỉ hiển thị Trang chủ & Sản phẩm cho non-admin */}
          {role !== 'admin' && (
            <>
              <Link to="/">Trang chủ</Link>
              <Link to="/products">Sản phẩm</Link>
              <Link to="/compare/vehicles">So sánh xe</Link>
              <Link to="/compare/batteries">So sánh pin</Link>
            </>
          )}

          {/* Liên kết cho user đã đăng nhập */}
          {isAuth && role !== 'admin' && (
            <>
              <Link to="/profile">Hồ sơ</Link>
              <Link to="/add-product">Đăng tin</Link>
              <Link to="/my-posts">Tin của tôi</Link>
              <Link to="/transactions">Giao dịch</Link>
              <Link to="/payment-confirmation">💳 Thanh toán</Link>
              <Link to="/favorites">Yêu thích</Link>
            </>
          )}

          {/* Admin: ẩn mục Hồ sơ trên header, sử dụng sidebar trong AdminLayout */}
          {isAuth && role === 'admin' && <></>}

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

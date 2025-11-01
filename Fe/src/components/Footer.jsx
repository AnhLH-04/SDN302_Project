import './Footer.css';
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">EV & Battery Trading Platform</div>
        <p className="footer-text">
          Nền tảng giao dịch xe điện và pin{' '}
          <span className="footer-highlight">hàng đầu Việt Nam</span>
        </p>
        <div className="footer-links">
          <a href="#about" className="footer-link">
            Về chúng tôi
          </a>
          <a href="#contact" className="footer-link">
            Liên hệ
          </a>
          <a href="#policy" className="footer-link">
            Chính sách
          </a>
          <a href="#terms" className="footer-link">
            Điều khoản
          </a>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} EV Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;

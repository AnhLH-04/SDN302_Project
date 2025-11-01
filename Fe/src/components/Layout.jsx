import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Layout.css'; // Import CSS file

function Layout() {
  return (
    <div className="layout-root">
      <Header />
      <main className="main-content">
        {/* Option 1: Full width - không wrapper */}
        {/* <Outlet /> */}

        {/* Option 2: Nếu muốn có padding, dùng wrapper */}
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;

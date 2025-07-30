import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <div className="app-container">
        <div className="content-wrapper">
          <main className="main-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout; 
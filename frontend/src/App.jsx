import Sidebar from './components/Sidebar';
import { Outlet } from 'react-router-dom';
import { useSidebar } from './context/SidebarContext';

function App() {
  const { abierto } = useSidebar();

  return (
    <div className="app-container">
      <Sidebar />
      <div className={`main-area ${abierto ? 'shifted' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Hero from './sections/Hero';
import Menu from './sections/Menu';
import OrderForm from './sections/OrderForm';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { ShoppingBag, Phone } from 'lucide-react';

function PublicLayout() {
  const [orderItems, setOrderItems] = useState([]);
  const location = useLocation();

  const addToOrder = (item) => {
    setOrderItems([...orderItems, item]);
    document.getElementById('order-form').scrollIntoView({ behavior: 'smooth' });
  };

  // Only show nav/footer on public pages
  const isPublic = !location.pathname.startsWith('/admin') && location.pathname !== '/login';

  if (!isPublic) return null;

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
            ALL Catering
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="tel:88021983" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--color-text)' }}>
              <Phone size={20} />
              <span>88021983</span>
            </a>
            <button
              className="btn btn-primary"
              onClick={() => document.getElementById('order-form').scrollIntoView({ behavior: 'smooth' })}
            >
              <ShoppingBag size={20} style={{ marginRight: '0.5rem' }} />
              Order ({orderItems.length})
            </button>
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        <Menu addToOrder={addToOrder} />
        <OrderForm orderItems={orderItems} setOrderItems={setOrderItems} />
      </main>

      <footer style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '2rem 0', textAlign: 'center' }}>
        <div className="container">
          <p>&copy; 2025 ALL Catering. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={<PublicLayout />} />
      </Routes>
    </Router>
  );
}

export default App;

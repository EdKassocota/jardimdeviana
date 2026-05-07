import { RouterProvider, createBrowserRouter, Outlet, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ClientApp } from './ClientApp';
import { AdminApp } from './AdminApp';
import { Home } from './pages/Home';
import { Menu as MenuPage } from './pages/Menu';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const MainLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-brand-black text-brand-white flex flex-col font-body w-full">
      <header className={`absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-6 md:p-10 w-full max-w-[1200px] mx-auto ${isHome ? 'bg-transparent' : 'bg-brand-black/90 backdrop-blur-sm border-b border-white/10'}`}>
        <Link to="/" className="flex flex-col group z-50" onClick={closeMenu}>
          <h1 className="font-display text-3xl md:text-4xl leading-none font-normal text-brand-white pt-2">Jardim de Viana</h1>
        </Link>
        <button 
          className="md:hidden z-50 text-brand-white hover:text-brand-orange transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
        <nav className="hidden md:flex gap-8 text-[11px] uppercase tracking-widest text-brand-white/40 items-center">
          <Link to="/" className={`hover:text-white transition-colors ${location.pathname === '/' ? 'text-brand-orange' : ''}`}>Início</Link>
          <Link to="/reserva" className={`hover:text-white transition-colors ${location.pathname === '/reserva' ? 'text-brand-orange' : ''}`}>Reserva</Link>
          <Link to="/menu" className={`hover:text-white transition-colors ${location.pathname === '/menu' ? 'text-brand-orange' : ''}`}>Menu</Link>
        </nav>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-brand-black/95 backdrop-blur-lg border-b border-white/10 p-6 flex flex-col gap-6 md:hidden z-40 shadow-2xl shadow-black"
            >
               <nav className="flex flex-col gap-6 text-sm uppercase tracking-widest text-brand-white/70">
                <Link to="/" onClick={closeMenu} className={`hover:text-white transition-colors ${location.pathname === '/' ? 'text-brand-orange' : ''}`}>Início</Link>
                <Link to="/reserva" onClick={closeMenu} className={`hover:text-white transition-colors ${location.pathname === '/reserva' ? 'text-brand-orange' : ''}`}>Reserva</Link>
                <Link to="/menu" onClick={closeMenu} className={`hover:text-white transition-colors ${location.pathname === '/menu' ? 'text-brand-orange' : ''}`}>Menu</Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      <main className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
        <Outlet />
      </main>
      <Toaster theme="dark" position="top-center" />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/reserva', element: <ClientApp /> },
      { path: '/menu', element: <MenuPage /> },
      { path: '/admin', element: <AdminApp /> }
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}

import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Users,
  BarChart3,
  Tag,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  History as HistoryIcon,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { notificationAPI } from '../../services/api';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout, isAdmin } = useAuth();
  const { socket, joinAdmin, addNotification } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    joinAdmin();
    fetchNotifications();

    if (socket) {
      socket.on('newOrder', (order) => {
        addNotification({
          type: 'new_order',
          title: 'New Order',
          message: `Order #${order.orderNumber} received - ₹${order.total}`,
          order: order._id,
        });
        fetchNotifications();
      });

      socket.on('notification', (notification) => {
        fetchNotifications();
      });
    }

    return () => {
      if (socket) {
        socket.off('newOrder');
        socket.off('notification');
      }
    };
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getAll({ limit: 20 });
      setNotifications(response.data.data);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Orders', icon: ClipboardList, path: '/admin/orders' },
    { name: 'Menu', icon: UtensilsCrossed, path: '/admin/menu' },
    { name: 'Customers', icon: Users, path: '/admin/customers' },
    // Admin-only sections
    ...(isAdmin ? [
      { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
      { name: 'History', icon: HistoryIcon, path: '/admin/history' },
      { name: 'Offers', icon: Tag, path: '/admin/offers' },
      { name: 'Users', icon: UserCircle, path: '/admin/users' },
      { name: 'Settings', icon: Settings, path: '/admin/settings' },
    ] : []),
  ];

  const currentPage = menuItems.find((item) => item.path === location.pathname)?.name || 'Admin';

  return (
    <div className="admin-panel min-h-screen bg-[#f8f6f3]">
      {/* ─── Mobile Header ─── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 admin-mobile-header">
        <div className="flex items-center justify-between px-3 py-2.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-cream-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Dear Desserts" 
              className="w-7 h-7 object-contain bg-white rounded-full p-0.5"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="font-display font-bold text-sm text-cream-100">Dear Desserts</span>
          </div>
          <button
            onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
            className="p-1.5 rounded-lg text-cream-300 hover:text-white hover:bg-white/10 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="notif-pulse absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ─── Desktop Sidebar ─── */}
      <aside
        className={`admin-sidebar fixed top-0 left-0 z-40 h-full transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-56' : 'w-[60px]'
        } hidden lg:flex lg:flex-col`}
      >
        {/* Logo */}
        <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} px-3 py-3 border-b border-white/8`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <img 
              src="/logo.png" 
              alt="Dear Desserts" 
              className="w-8 h-8 object-contain bg-white rounded-full p-0.5 flex-shrink-0"
              onError={(e) => {
                e.target.outerHTML = '<div class="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center flex-shrink-0"><span class="text-white font-display font-bold text-sm">D</span></div>';
              }}
            />
            {sidebarOpen && (
              <div className="min-w-0">
                <span className="font-display text-sm font-bold block leading-tight text-cream-100 truncate">Dear Desserts</span>
                <span className="text-[10px] text-gold-400 font-medium">Admin Panel</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-md hover:bg-white/10 text-cream-400 transition-colors flex-shrink-0"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              title={!sidebarOpen ? item.name : undefined}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {sidebarOpen && <span className="truncate">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className={`px-2 py-2.5 border-t border-white/8 ${!sidebarOpen ? 'flex flex-col items-center gap-2' : ''}`}>
          <div className={`flex items-center ${sidebarOpen ? 'gap-2.5 mb-1.5' : 'justify-center mb-2'}`}>
            <div className="w-8 h-8 bg-chocolate-600 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-white/10">
              <span className="text-xs font-semibold text-cream-200">{user?.name?.charAt(0)}</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-cream-200 truncate">{user?.name}</p>
                <p className="text-[10px] text-cream-400 capitalize">{user?.role}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 text-cream-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors ${
              sidebarOpen ? 'w-full px-2 py-1.5 text-xs' : 'p-1.5'
            }`}
            title="Logout"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="text-xs">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ─── Mobile Sidebar Drawer ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="admin-sidebar fixed top-0 left-0 z-50 w-[240px] h-full lg:hidden flex flex-col"
            >
              <div className="px-3 py-3 border-b border-white/8 flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-display font-bold text-sm">D</span>
                </div>
                <div>
                  <span className="font-display text-sm font-bold text-cream-100">Dear Desserts</span>
                  <span className="text-[10px] text-gold-400 font-medium block">Admin Panel</span>
                </div>
              </div>

              <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <item.icon className="w-[18px] h-[18px]" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="px-2 py-2.5 border-t border-white/8">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 bg-chocolate-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-cream-200">{user?.name?.charAt(0)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-cream-200 truncate">{user?.name}</p>
                    <p className="text-[10px] text-cream-400 capitalize">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-cream-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── Main Content ─── */}
      <main
        className={`min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-56' : 'lg:ml-[60px]'
        } pt-[44px] lg:pt-0`}
      >
        {/* Desktop Top Bar */}
        <header className="hidden lg:flex items-center justify-between px-5 py-2.5 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20">
          <div>
            <h1 className="admin-page-title font-display">{currentPage}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-[18px] h-[18px] text-gray-500" />
              {unreadCount > 0 && (
                <span className="notif-pulse absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <Link
              to="/"
              target="_blank"
              className="admin-btn admin-btn-outline text-[11px]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Store
            </Link>
          </div>
        </header>

        {/* ─── Notification Panel ─── */}
        <AnimatePresence>
          {notificationPanelOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-30"
                onClick={() => setNotificationPanelOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="fixed right-3 top-12 lg:top-12 z-40 w-72 max-h-80 bg-white rounded-xl shadow-elevated border border-gray-100 overflow-hidden"
              >
                <div className="px-3.5 py-2.5 border-b bg-gray-50/80 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="admin-badge bg-red-100 text-red-600">{unreadCount} new</span>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center">
                      <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() => markAsRead(notification._id)}
                        className={`px-3.5 py-2.5 border-b border-gray-50 cursor-pointer hover:bg-gray-50/80 transition-colors ${
                          !notification.isRead ? 'bg-amber-50/50 border-l-2 border-l-gold-500' : ''
                        }`}
                      >
                        <p className="text-xs font-semibold text-gray-800 leading-tight">{notification.title}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{notification.message}</p>
                        <p className="text-[10px] text-gray-300 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <div className="p-3 lg:p-5 max-w-[1200px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

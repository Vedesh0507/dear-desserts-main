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
  ChevronDown,
  UserCircle,
  History as HistoryIcon,
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
    { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { name: 'History', icon: HistoryIcon, path: '/admin/history' },
    { name: 'Offers', icon: Tag, path: '/admin/offers' },
    ...(isAdmin ? [{ name: 'Users', icon: UserCircle, path: '/admin/users' }] : []),
    ...(isAdmin ? [{ name: 'Settings', icon: Settings, path: '/admin/settings' }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-display font-bold text-chocolate-700">Dear Desserts</span>
          <button
            onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 relative"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full bg-chocolate-800 text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } hidden lg:block`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-chocolate-700">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="Dear Desserts" 
              className="w-10 h-10 object-contain bg-white rounded-full p-0.5 flex-shrink-0"
            />
            {sidebarOpen && (
              <div>
                <span className="font-display text-lg font-bold block leading-tight">Dear Desserts</span>
                <span className="text-xs text-caramel-400 italic">Admin Panel</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded hover:bg-chocolate-700"
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                sidebarOpen ? 'rotate-90' : '-rotate-90'
              }`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="py-4 space-y-1 px-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-colors ${
                location.pathname === item.path
                  ? 'bg-caramel-500 text-white'
                  : 'text-chocolate-200 hover:bg-chocolate-700'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-chocolate-700">
          <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
            <div className="w-10 h-10 bg-chocolate-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-medium">{user?.name?.charAt(0)}</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name}</p>
                <p className="text-xs text-chocolate-300 capitalize">{user?.role}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-chocolate-700 text-chocolate-200"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed top-0 left-0 z-50 w-[280px] h-full bg-chocolate-800 text-white lg:hidden"
            >
              <div className="p-4 border-b border-chocolate-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-caramel-400 to-caramel-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-display font-bold text-lg">D</span>
                  </div>
                  <span className="font-display text-lg font-bold">Dear Desserts</span>
                </div>
              </div>

              <nav className="py-4 space-y-1 px-3">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-colors ${
                      location.pathname === item.path
                        ? 'bg-caramel-500 text-white'
                        : 'text-chocolate-200 hover:bg-chocolate-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-chocolate-700">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3 py-3 rounded-xl text-chocolate-200 hover:bg-chocolate-700"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        } pt-16 lg:pt-0`}
      >
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between px-6 py-4 bg-white border-b">
          <div>
            <h1 className="text-xl font-display font-bold text-chocolate-700">
              {menuItems.find((item) => item.path === location.pathname)?.name || 'Admin'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-100"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <Link
              to="/"
              target="_blank"
              className="px-4 py-2 text-sm font-medium text-chocolate-600 border border-chocolate-200 rounded-lg hover:bg-chocolate-50"
            >
              View Store
            </Link>
          </div>
        </header>

        {/* Notification Panel */}
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
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="fixed right-4 top-16 lg:top-16 z-40 w-80 max-h-96 bg-white rounded-xl shadow-elevated overflow-hidden"
              >
                <div className="px-4 py-3 border-b bg-gray-50">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() => markAsRead(notification._id)}
                        className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 ${
                          !notification.isRead ? 'bg-blue-50' : ''
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-800">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
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
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

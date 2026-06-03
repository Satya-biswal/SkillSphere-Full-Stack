import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../socket/socket';
import api from '../../services/api';

const NotificationBell = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    fetchNotifications();

    // Real-time
    socket.on('new_notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Close on outside click
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);

    return () => {
      socket.off('new_notification');
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  const handleClear = async () => {
    try {
      await api.delete('/notifications/clear');
      setNotifications([]);
      setUnreadCount(0);
    } catch {}
  };

  const handleClick = async (notification) => {
    await api.put(`/notifications/${notification._id}/read`);
    setUnreadCount((prev) => Math.max(0, prev - 1));
    setNotifications((prev) =>
      prev.map((n) => n._id === notification._id ? { ...n, isRead: true } : n)
    );
    setOpen(false);
    if (notification.link) navigate(notification.link);
  };

  const iconMap = {
    new_proposal: '📩',
    proposal_accepted: '✅',
    proposal_rejected: '❌',
    new_message: '💬',
    payment_received: '💰',
    review_added: '⭐',
    gig_posted: '📋',
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell Button */}
      <button onClick={() => setOpen(!open)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead}
                  className="text-xs text-indigo-600 hover:underline">
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={handleClear}
                  className="text-xs text-red-400 hover:underline">
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-2xl mb-2">🔔</p>
                <p className="text-gray-400 text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button key={n._id} onClick={() => handleClick(n)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 ${
                    !n.isRead ? 'bg-indigo-50/50' : ''
                  }`}>
                  <div className="flex gap-3 items-start">
                    <span className="text-lg flex-shrink-0">{iconMap[n.type] || '🔔'}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!n.isRead ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-xs text-gray-300 mt-1">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {' · '}
                        {new Date(n.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!n.isRead && (
                      <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1.5"></div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
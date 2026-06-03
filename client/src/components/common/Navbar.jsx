import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import NotificationBell from '../notifications/NotificationBell';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) =>
    location.pathname === path
      ? 'text-indigo-600 font-semibold'
      : 'text-gray-600 hover:text-indigo-600';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
          Skill<span className="text-gray-800">Sphere</span>
        </Link>
<Link to="/payments/history" className={`text-sm ${isActive('/payments/history')}`}>
  💳 Payments
</Link>
<Link to="/progress" className={`text-sm ${isActive('/progress')}`}>
  Progress
</Link>
<Link to="/disputes" className={`text-sm ${isActive('/disputes')}`}>
  Disputes
</Link>
<Link to="/freelancer/profile" className={`text-sm ${isActive('/freelancer/profile')}`}>
  My Profile
</Link>
<Link to="/freelancer/analytics" className={`text-sm ${isActive('/freelancer/analytics')}`}>
  Analytics
</Link>
        {/* Links */}
        <div className="flex items-center gap-6">
          {user?.role === 'freelancer' && (
            <>
              <Link to="/freelancer/dashboard" className={`text-sm ${isActive('/freelancer/dashboard')}`}>Dashboard</Link>
              <Link to="/gigs" className={`text-sm ${isActive('/gigs')}`}>Browse Gigs</Link>
              <Link to="/freelancer/proposals" className={`text-sm ${isActive('/freelancer/proposals')}`}>My Proposals</Link>
              <Link to="/chat" className={`text-sm ${isActive('/chat')}`}>Messages</Link>
              
            </>
          )}
          {user?.role === 'client' && (
            <>
              <Link to="/client/dashboard" className={`text-sm ${isActive('/client/dashboard')}`}>Dashboard</Link>
              <Link to="/client/post-gig" className={`text-sm ${isActive('/client/post-gig')}`}>Post a Gig</Link>
              <Link to="/client/my-gigs" className={`text-sm ${isActive('/client/my-gigs')}`}>My Gigs</Link>
              <Link to="/chat" className={`text-sm ${isActive('/chat')}`}>Messages</Link>
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <Link to="/admin/dashboard" className={`text-sm ${isActive('/admin/dashboard')}`}>Dashboard</Link>
              <Link to="/admin/users" className={`text-sm ${isActive('/admin/users')}`}>Users</Link>
              <Link to="/admin/gigs" className={`text-sm ${isActive('/admin/gigs')}`}>Gigs</Link>
            </>
          )}

          {/* User Info */}
          <div className="flex items-center gap-2 ml-2 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
            <NotificationBell />
            <button
              onClick={handleLogout}
              className="ml-3 text-xs bg-red-50 text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

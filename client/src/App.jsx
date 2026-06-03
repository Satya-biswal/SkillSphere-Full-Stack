import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './redux/store';
import Reviews from './pages/shared/Reviews';

import Disputes from './pages/shared/Disputes';
import ProgressTracker from './pages/shared/ProgressTracker';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Landing from './pages/Landing';
// Client
import ClientDashboard from './pages/client/ClientDashboard';
import PostGig from './pages/client/PostGig';
import MyGigs from './pages/client/MyGigs';
import ViewProposals from './pages/client/ViewProposals';

// Freelancer
import FreelancerDashboard from './pages/freelancer/FreelancerDashboard';
import BrowseGigs from './pages/freelancer/BrowseGigs';
import MyProposals from './pages/freelancer/MyProposals';

// Shared
import Chat from './pages/shared/Chat';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';

// Common
import ProtectedRoute from './components/common/ProtectedRoute';

import PaymentHistory from './pages/shared/PaymentHistory';

import FreelancerProfile from './pages/freelancer/FreelancerProfile';
import Analytics from './pages/freelancer/Analytics';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public */}
          

<Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

<Route path="/disputes" element={
  <ProtectedRoute><Disputes /></ProtectedRoute>
} />
<Route path="/progress" element={
  <ProtectedRoute><ProgressTracker /></ProtectedRoute>
} />

          {/* Client Routes */}
          <Route path="/client/dashboard" element={
            <ProtectedRoute role="client"><ClientDashboard /></ProtectedRoute>
          } />
          <Route path="/client/post-gig" element={
            <ProtectedRoute role="client"><PostGig /></ProtectedRoute>
          } />
          <Route path="/client/my-gigs" element={
            <ProtectedRoute role="client"><MyGigs /></ProtectedRoute>
          } />
          <Route path="/client/gig/:gigId/proposals" element={
            <ProtectedRoute role="client"><ViewProposals /></ProtectedRoute>
          } />

          <Route path="/freelancer/profile" element={
  <ProtectedRoute role="freelancer"><FreelancerProfile /></ProtectedRoute>
} />
<Route path="/freelancer/analytics" element={
  <ProtectedRoute role="freelancer"><Analytics /></ProtectedRoute>
} />

          {/* Freelancer Routes */}
          <Route path="/freelancer/dashboard" element={
            <ProtectedRoute role="freelancer"><FreelancerDashboard /></ProtectedRoute>
          } />
          <Route path="/gigs" element={
            <ProtectedRoute role="freelancer"><BrowseGigs /></ProtectedRoute>
          } />
          <Route path="/freelancer/proposals" element={
            <ProtectedRoute role="freelancer"><MyProposals /></ProtectedRoute>
          } />
          <Route path="/reviews/:freelancerId" element={
  <ProtectedRoute><Reviews /></ProtectedRoute>
} />

<Route path="/payments/history" element={
  <ProtectedRoute><PaymentHistory /></ProtectedRoute>
} />

          {/* Shared Routes */}
          <Route path="/chat" element={
            <ProtectedRoute><Chat /></ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;

import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home/Home'
import CreatePost from './pages/Post/CreatePost'
import VerifyOtp from './pages/Auth/VerifyOtp'
import OAuth2Callback from './pages/Auth/OAuth2Callback'
import PostDetail from './pages/Post/PostDetail'
import Communities from './pages/Community/Communities'
import Profile from './pages/Profile/Profile'
import CommunityDetail from './pages/Community/CommunityDetail'
import News from './pages/News/News'
import DM from './pages/DM/DM'
import ChatBot from './components/ChatBot'
import ForgotPassword from './pages/Auth/ForgotPassword'
import Settings from './pages/Settings/Settings'
import { SidebarProvider } from './context/SidebarContext'
import About from './pages/About/About'
import AdminAccess from './pages/Admin/AdminAccess'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminDashboard from './pages/Admin/AdminDashboard'
import Help from './pages/Help/Help'
import PrivacyPolicy from './pages/Legal/Legal'

const Spinner = () => (
  <>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`}</style>
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg className="spin" style={{ width: 28, height: 28 }} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" style={{ opacity: 0.2 }} />
        <path fill="white" d="M4 12a8 8 0 018-8v8z" style={{ opacity: 0.6 }} />
      </svg>
    </div>
  </>
)

const Layout = () => (
  <>
    <Navbar />
    <Sidebar />
    <ChatBot />
    <Outlet />
  </>
)

const ProtectedRoute = () => {
  const { token, loading } = useAuth()
  if (loading) return <Spinner />
  return token ? <Layout /> : <Navigate to="/login" replace />
}

const AdminRoute = () => {
  const adminToken = localStorage.getItem('adminToken')
  if (!adminToken) return <Navigate to="/admin/login" replace />
  return <Outlet />
}

function App() {
  return (
    <SidebarProvider>
      <div style={{ background: '#080808', minHeight: '100vh' }}>
        <Routes>
          {/* Public routes — no login required */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/oauth2/callback" element={<OAuth2Callback />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/legal" element={<PrivacyPolicy />} />

          {/* Admin routes — completely isolated */}
          <Route path="/admin/access" element={<AdminAccess />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Protected user routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/post/:postId" element={<PostDetail />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/community/:communityName" element={<CommunityDetail />} />
            <Route path="/news" element={<News />} />
            <Route path="/dm" element={<DM />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </SidebarProvider>
  )
}

export default App

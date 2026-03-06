import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Navbar from './components/Navbar'
import Home from './pages/Home/Home'
import CreatePost from './pages/Post/CreatePost'


// ── Loading spinner (matches Sphere aesthetic) ──
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

// ── Layout: Navbar + page content ──
const Layout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
)

// ── Redirects to /login if not authenticated ──
const ProtectedRoute = () => {
  const { token, loading } = useAuth()
  if (loading) return <Spinner />
  return token ? <Layout /> : <Navigate to="/login" replace />
}

function App() {
  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      <Routes>
        {/* Public routes — no navbar */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — all get Navbar via Layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/"            element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/communities" element={<div style={{ color: 'white', textAlign: 'center', paddingTop: 80 }}>Communities Coming Soon!</div>} />
          <Route path="/news"        element={<div style={{ color: 'white', textAlign: 'center', paddingTop: 80 }}>News Coming Soon!</div>} />
          <Route path="/dm"          element={<div style={{ color: 'white', textAlign: 'center', paddingTop: 80 }}>DMs Coming Soon!</div>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
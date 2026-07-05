import { Routes, Route, useLocation } from 'react-router-dom'
import SideNavBar from './components/SideNavBar'
import TopNavBar from './components/TopNavBar'
import BottomNavBar from './components/BottomNavBar'
import BottomPlayer from './components/BottomPlayer'
import Home from './pages/Home'
import Premium from './pages/Premium'
import Auth from './pages/Auth'
import Admin from './pages/Admin'

function App() {
  const { pathname } = useLocation()
  const isAuthRoute = pathname === '/login' || pathname === '/register'
  const isAdminRoute = pathname.startsWith('/admin')
  const hideAppShell = isAuthRoute || isAdminRoute

  return (
    <div className="text-on-surface font-body-lg overflow-x-hidden">
      {!hideAppShell && <SideNavBar />}
      {!hideAppShell && <TopNavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/login" element={<Auth initialMode="login" />} />
        <Route path="/register" element={<Auth initialMode="register" />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {!hideAppShell && <BottomNavBar />}
      {!hideAppShell && <BottomPlayer />}
    </div>
  )
}

export default App

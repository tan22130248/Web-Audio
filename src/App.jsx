import { Routes, Route } from 'react-router-dom'
import SideNavBar from './components/SideNavBar'
import TopNavBar from './components/TopNavBar'
import BottomNavBar from './components/BottomNavBar'
import BottomPlayer from './components/BottomPlayer'
import Home from './pages/Home'

function App() {
  return (
    <div className="text-on-surface font-body-lg overflow-x-hidden">
      <SideNavBar />
      <TopNavBar />

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

      <BottomNavBar />
      <BottomPlayer />
    </div>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from '@/modules/landing/pages/LandingPage'

function App() {
  return (
    <Router>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  )
}

export default App

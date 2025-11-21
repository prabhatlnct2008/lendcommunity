import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from '@/modules/landing/pages/LandingPage'
import OAuthCallbackPage from '@/modules/auth/pages/OAuthCallbackPage'
import FounderLandingPage from '@/modules/founders/pages/FounderLandingPage'
import OnboardingPage from '@/modules/startups/pages/OnboardingPage'
import CreateRoundPage from '@/modules/startups/pages/CreateRoundPage'
import FounderDashboardPage from '@/modules/startups/pages/FounderDashboardPage'
import { AuthProvider } from '@/modules/auth/context/AuthContext'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />
          <Route path="/founders" element={<FounderLandingPage />} />
          <Route
            path="/founder/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/founder/create-round"
            element={
              <ProtectedRoute>
                <CreateRoundPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/founder/dashboard"
            element={
              <ProtectedRoute>
                <FounderDashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App

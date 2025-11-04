import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { NotificationProvider } from './contexts/NotificationContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Planning from './pages/Planning'
import Projects from './pages/Projects'

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/planning" element={<Planning />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </NotificationProvider>
  )
}

export default App

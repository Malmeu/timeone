import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Planning from './pages/Planning'
import Projects from './pages/Projects'
import Layout from './components/Layout'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

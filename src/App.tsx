import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import MemberPage from './pages/MemberPage'
import StoreMemberPage from './pages/StoreMemberPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/member" element={<MemberPage />} />
        <Route path="/toko-a/member" element={<StoreMemberPage store="A" />} />
        <Route path="/toko-b/member" element={<StoreMemberPage store="B" />} />
        <Route path="/toko-c/member" element={<StoreMemberPage store="C" />} />
      </Route>
    </Routes>
  )
}

export default App

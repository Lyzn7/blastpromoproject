import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import StoreRoute from './components/StoreRoute'
import DashboardPage from './pages/DashboardPage'
import MemberPage from './pages/MemberPage'
import StoreMemberPage from './pages/StoreMemberPage'
import StoreBirthdayPage from './pages/StoreBirthdayPage'
import LogPage from './pages/LogPage'
import BlastingPromoPage from './pages/BlastingPromoPage'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/member" element={<MemberPage />} />
        <Route path="/log" element={<LogPage />} />
        <Route
          path="/toko-a/member"
          element={
            <StoreRoute store="A">
              <StoreMemberPage store="A" />
            </StoreRoute>
          }
        />
        <Route
          path="/toko-b/member"
          element={
            <StoreRoute store="B">
              <StoreMemberPage store="B" />
            </StoreRoute>
          }
        />
        <Route
          path="/toko-c/member"
          element={
            <StoreRoute store="C">
              <StoreMemberPage store="C" />
            </StoreRoute>
          }
        />
        <Route
          path="/toko-a/ultah-member"
          element={
            <StoreRoute store="A">
              <StoreBirthdayPage store="A" />
            </StoreRoute>
          }
        />
        <Route
          path="/toko-b/ultah-member"
          element={
            <StoreRoute store="B">
              <StoreBirthdayPage store="B" />
            </StoreRoute>
          }
        />
        <Route
          path="/toko-c/ultah-member"
          element={
            <StoreRoute store="C">
              <StoreBirthdayPage store="C" />
            </StoreRoute>
          }
        />
        <Route
          path="/toko-a/blasting"
          element={
            <StoreRoute store="A">
              <BlastingPromoPage store="A" />
            </StoreRoute>
          }
        />
        <Route
          path="/toko-b/blasting"
          element={
            <StoreRoute store="B">
              <BlastingPromoPage store="B" />
            </StoreRoute>
          }
        />
        <Route
          path="/toko-c/blasting"
          element={
            <StoreRoute store="C">
              <BlastingPromoPage store="C" />
            </StoreRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App

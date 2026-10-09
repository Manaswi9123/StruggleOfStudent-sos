import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import Home from './pages/Home'

// The public site is a single page. Admin is separate and loaded on demand.
const Admin = lazy(() => import('./pages/admin/Admin'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Layout><Home /></Layout>} />
        <Route path="admin" element={<Suspense fallback={<div className="grid min-h-dvh place-items-center text-ocean-700">Loading…</div>}><Admin /></Suspense>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

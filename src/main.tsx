import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import HomePage from './pages/HomePage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import PrivacyPage from './PrivacyPage.tsx'
import TermsPage from './TermsPage.tsx'

const BlogPage = lazy(() => import('./pages/BlogPage.tsx'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'blog', element: <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[var(--text-muted)] text-lg">Loading…</div>}><BlogPage /></Suspense> },
      { path: 'blog/:slug', element: <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[var(--text-muted)] text-lg">Loading…</div>}><BlogPage /></Suspense> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

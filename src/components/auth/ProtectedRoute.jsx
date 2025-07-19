import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingPage } from '@/components/ui/loading'

export function ProtectedRoute({ 
  children, 
  roles = [], 
  requireAuth = true,
  fallback = null 
}) {
  const { user, loading, isLoggedIn, hasAnyRole } = useAuth()
  const location = useLocation()

  // Show loading while checking authentication
  if (loading) {
    return <LoadingPage message="Checking authentication..." />
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !isLoggedIn) {
    // Redirect to login with return URL
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    )
  }

  // If specific roles are required, check user role
  if (roles.length > 0 && !hasAnyRole(roles)) {
    // Show fallback component or redirect to unauthorized page
    if (fallback) {
      return fallback
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="sumatin-button-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // User is authenticated and has required permissions
  return children
}

export function PublicRoute({ children, redirectTo = '/dashboard' }) {
  const { isLoggedIn, loading } = useAuth()

  // Show loading while checking authentication
  if (loading) {
    return <LoadingPage message="Loading..." />
  }

  // If user is already logged in, redirect to dashboard
  if (isLoggedIn) {
    return <Navigate to={redirectTo} replace />
  }

  // User is not logged in, show public content
  return children
}

export function AdminRoute({ children, fallback }) {
  return (
    <ProtectedRoute roles={['admin']} fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

export function TeacherRoute({ children, fallback }) {
  return (
    <ProtectedRoute roles={['admin', 'teacher']} fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

export function StudentRoute({ children, fallback }) {
  return (
    <ProtectedRoute roles={['admin', 'teacher', 'student']} fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

export function ParentRoute({ children, fallback }) {
  return (
    <ProtectedRoute roles={['admin', 'parent']} fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}


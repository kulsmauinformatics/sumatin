import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProtectedRoute, PublicRoute, AdminRoute, TeacherRoute } from './components/auth/ProtectedRoute'
import { Layout } from './components/layout/Layout'
import { LoadingPage } from './components/ui/loading'

// Pages
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Schools } from './pages/Schools'
import { Attendance } from './pages/Attendance'
import { Reports } from './pages/Reports'

// Import CSS
import './App.css'

function AppRoutes() {
  const { user, logout, loading } = useAuth()

  if (loading) {
    return <LoadingPage message="Loading SUMATIN..." />
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      
      {/* Protected routes with layout */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout user={user} onLogout={logout} />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route 
          path="dashboard" 
          element={<Dashboard user={user} />} 
        />
        
        {/* Admin routes */}
        <Route path="users/*" element={
          <AdminRoute>
            <div className="p-6">
              <h1 className="text-2xl font-bold">User Management</h1>
              <p className="text-muted-foreground mt-2">
                Manage users, teachers, students, and parents.
              </p>
              <div className="mt-6 sumatin-card p-6">
                <p>User management interface will be implemented here.</p>
              </div>
            </div>
          </AdminRoute>
        } />
        
        <Route path="schools/*" element={
          <AdminRoute>
            <Schools />
          </AdminRoute>
        } />
        
        <Route path="settings/*" element={
          <AdminRoute>
            <div className="p-6">
              <h1 className="text-2xl font-bold">System Settings</h1>
              <p className="text-muted-foreground mt-2">
                Configure system-wide settings and preferences.
              </p>
              <div className="mt-6 sumatin-card p-6">
                <p>Settings interface will be implemented here.</p>
              </div>
            </div>
          </AdminRoute>
        } />
        
        {/* Teacher routes */}
        <Route path="classes/*" element={
          <TeacherRoute>
            <div className="p-6">
              <h1 className="text-2xl font-bold">My Classes</h1>
              <p className="text-muted-foreground mt-2">
                Manage your classes and students.
              </p>
              <div className="mt-6 sumatin-card p-6">
                <p>Class management interface will be implemented here.</p>
              </div>
            </div>
          </TeacherRoute>
        } />
        
        {/* Common routes */}
        <Route path="grades/*" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Grades & Classes</h1>
            <p className="text-muted-foreground mt-2">
              View and manage grades and class information.
            </p>
            <div className="mt-6 sumatin-card p-6">
              <p>Grades interface will be implemented here.</p>
            </div>
          </div>
        } />
        
        <Route path="attendance/*" element={
          <Attendance />
        } />
        
        <Route path="assessments/*" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Assessments</h1>
            <p className="text-muted-foreground mt-2">
              Manage assessments and grading.
            </p>
            <div className="mt-6 sumatin-card p-6">
              <p>Assessment interface will be implemented here.</p>
            </div>
          </div>
        } />
        
        <Route path="library/*" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">eLibrary</h1>
            <p className="text-muted-foreground mt-2">
              Access digital library resources and materials.
            </p>
            <div className="mt-6 sumatin-card p-6">
              <p>Library interface will be implemented here.</p>
            </div>
          </div>
        } />
        
        <Route path="learning/*" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">eLearning</h1>
            <p className="text-muted-foreground mt-2">
              Access learning content and resources.
            </p>
            <div className="mt-6 sumatin-card p-6">
              <p>Learning interface will be implemented here.</p>
            </div>
          </div>
        } />
        
        <Route path="feeds/*" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Feeds</h1>
            <p className="text-muted-foreground mt-2">
              View announcements and updates.
            </p>
            <div className="mt-6 sumatin-card p-6">
              <p>Feeds interface will be implemented here.</p>
            </div>
          </div>
        } />
        
        <Route path="reports/*" element={
          <Reports />
        } />
        
        <Route path="calendar/*" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-muted-foreground mt-2">
              View academic calendar and events.
            </p>
            <div className="mt-6 sumatin-card p-6">
              <p>Calendar interface will be implemented here.</p>
            </div>
          </div>
        } />
        
        <Route path="profile/*" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your profile and account settings.
            </p>
            <div className="mt-6 sumatin-card p-6">
              <div className="space-y-4">
                <div>
                  <label className="sumatin-form-label">Name</label>
                  <p className="text-foreground">{user?.firstName} {user?.lastName}</p>
                </div>
                <div>
                  <label className="sumatin-form-label">Email</label>
                  <p className="text-foreground">{user?.email}</p>
                </div>
                <div>
                  <label className="sumatin-form-label">Role</label>
                  <p className="text-foreground capitalize">{user?.role}</p>
                </div>
                <div>
                  <label className="sumatin-form-label">Username</label>
                  <p className="text-foreground">{user?.username}</p>
                </div>
              </div>
            </div>
          </div>
        } />
      </Route>
      
      {/* 404 route */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-foreground">404</h1>
              <p className="text-muted-foreground">Page not found</p>
              <button
                onClick={() => window.history.back()}
                className="sumatin-button-primary"
              >
                Go Back
              </button>
            </div>
          </div>
        } 
      />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App


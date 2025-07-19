import { createContext, useContext, useState, useEffect } from 'react'
import { api, TokenManager, isAuthenticated } from '@/lib/api'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Initialize auth state
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      // Check if user is authenticated
      if (isAuthenticated()) {
        // Try to get user profile
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setIsLoggedIn(true)
          
          // Optionally refresh user data from server
          try {
            const response = await api.auth.getProfile()
            if (response.success) {
              setUser(response.data.user)
              localStorage.setItem('user', JSON.stringify(response.data.user))
            }
          } catch (error) {
            console.warn('Failed to refresh user profile:', error)
            // Continue with stored user data
          }
        } else {
          // Token exists but no user data, try to fetch profile
          try {
            const response = await api.auth.getProfile()
            if (response.success) {
              setUser(response.data.user)
              setIsLoggedIn(true)
              localStorage.setItem('user', JSON.stringify(response.data.user))
            } else {
              // Invalid token, clear auth
              clearAuth()
            }
          } catch (error) {
            console.error('Failed to get user profile:', error)
            clearAuth()
          }
        }
      } else {
        clearAuth()
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      clearAuth()
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await api.auth.login(credentials)
      
      if (response.success) {
        const { user: userData, tokens } = response.data
        
        // Store tokens
        TokenManager.setTokens(tokens.accessToken, tokens.refreshToken)
        
        // Store user data
        setUser(userData)
        setIsLoggedIn(true)
        localStorage.setItem('user', JSON.stringify(userData))
        
        return { success: true, user: userData }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        message: error.message || 'Login failed. Please try again.' 
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.auth.register(userData)
      
      if (response.success) {
        // Auto-login after successful registration
        const loginResult = await login({
          username: userData.username,
          password: userData.password
        })
        
        return loginResult
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.' 
      }
    }
  }

  const logout = async () => {
    try {
      // Call logout API to invalidate tokens on server
      await api.auth.logout()
    } catch (error) {
      console.warn('Logout API call failed:', error)
      // Continue with local logout even if API call fails
    } finally {
      clearAuth()
    }
  }

  const clearAuth = () => {
    TokenManager.clearTokens()
    localStorage.removeItem('user')
    setUser(null)
    setIsLoggedIn(false)
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await api.auth.updateProfile(profileData)
      
      if (response.success) {
        setUser(response.data.user)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return { success: true, user: response.data.user }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('Profile update error:', error)
      return { 
        success: false, 
        message: error.message || 'Profile update failed. Please try again.' 
      }
    }
  }

  const changePassword = async (passwordData) => {
    try {
      const response = await api.auth.changePassword(passwordData)
      
      if (response.success) {
        return { success: true, message: 'Password changed successfully' }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('Password change error:', error)
      return { 
        success: false, 
        message: error.message || 'Password change failed. Please try again.' 
      }
    }
  }

  const requestPasswordReset = async (email) => {
    try {
      const response = await api.auth.requestPasswordReset(email)
      
      if (response.success) {
        return { success: true, message: 'Password reset email sent' }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('Password reset request error:', error)
      return { 
        success: false, 
        message: error.message || 'Password reset request failed. Please try again.' 
      }
    }
  }

  const resetPassword = async (resetData) => {
    try {
      const response = await api.auth.resetPassword(resetData)
      
      if (response.success) {
        return { success: true, message: 'Password reset successfully' }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('Password reset error:', error)
      return { 
        success: false, 
        message: error.message || 'Password reset failed. Please try again.' 
      }
    }
  }

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role)
  }

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin')
  }

  // Check if user is teacher
  const isTeacher = () => {
    return hasRole('teacher')
  }

  // Check if user is student
  const isStudent = () => {
    return hasRole('student')
  }

  // Check if user is parent
  const isParent = () => {
    return hasRole('parent')
  }

  const value = {
    // State
    user,
    loading,
    isLoggedIn,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    
    // Utilities
    hasRole,
    hasAnyRole,
    isAdmin,
    isTeacher,
    isStudent,
    isParent
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext


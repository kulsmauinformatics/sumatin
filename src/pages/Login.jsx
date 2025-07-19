import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { AuthLayout } from "../components/layout/Layout"
import { LoadingButton } from "../components/ui/loading"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"

export function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await api.auth.login(formData)
      
      if (response.success) {
        // Store tokens
        localStorage.setItem('accessToken', response.data.tokens.accessToken)
        localStorage.setItem('refreshToken', response.data.tokens.refreshToken)
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        // Redirect to dashboard
        navigate('/dashboard')
      } else {
        setError(response.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(error.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (role) => {
    setLoading(true)
    setError("")

    // Demo credentials
    const demoCredentials = {
      admin: { username: "sumatin", password: "666422" },
      teacher: { username: "teacher", password: "teacher123" },
      student: { username: "student", password: "student123" },
      parent: { username: "parent", password: "parent123" }
    }

    try {
      const credentials = demoCredentials[role]
      const response = await api.auth.login(credentials)
      
      if (response.success) {
        localStorage.setItem('accessToken', response.data.tokens.accessToken)
        localStorage.setItem('refreshToken', response.data.tokens.refreshToken)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        navigate('/dashboard')
      } else {
        setError(response.message || 'Demo login failed')
      }
    } catch (error) {
      console.error('Demo login error:', error)
      setError('Demo login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your SUMATIN account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Username field */}
        <div className="sumatin-form-group">
          <label htmlFor="username" className="sumatin-form-label">
            Username or Email
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleChange}
            className="sumatin-input w-full"
            placeholder="Enter your username or email"
            disabled={loading}
          />
        </div>

        {/* Password field */}
        <div className="sumatin-form-group">
          <label htmlFor="password" className="sumatin-form-label">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              className="sumatin-input w-full pr-10"
              placeholder="Enter your password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember me and forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-border text-primary focus:ring-primary"
              disabled={loading}
            />
            <span className="ml-2 text-sm text-muted-foreground">
              Remember me
            </span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit button */}
        <LoadingButton
          type="submit"
          loading={loading}
          className="w-full"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </LoadingButton>
      </form>

      {/* Demo accounts */}
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground text-center mb-4">
          Try demo accounts:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleDemoLogin('admin')}
            disabled={loading}
            className="sumatin-button-secondary text-xs py-2"
          >
            Admin Demo
          </button>
          <button
            onClick={() => handleDemoLogin('teacher')}
            disabled={loading}
            className="sumatin-button-secondary text-xs py-2"
          >
            Teacher Demo
          </button>
          <button
            onClick={() => handleDemoLogin('student')}
            disabled={loading}
            className="sumatin-button-secondary text-xs py-2"
          >
            Student Demo
          </button>
          <button
            onClick={() => handleDemoLogin('parent')}
            disabled={loading}
            className="sumatin-button-secondary text-xs py-2"
          >
            Parent Demo
          </button>
        </div>
      </div>

      {/* Sign up link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}


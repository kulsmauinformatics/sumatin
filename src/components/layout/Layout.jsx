import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import { cn } from "@/lib/utils"

export function Layout({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Assignment Posted",
      message: "Mathematics assignment for Grade 10 has been posted",
      time: "2 minutes ago",
      read: false
    },
    {
      id: 2,
      title: "Attendance Reminder",
      message: "Please mark attendance for today's classes",
      time: "1 hour ago",
      read: false
    },
    {
      id: 3,
      title: "Grade Updated",
      message: "Your Science test grade has been updated",
      time: "3 hours ago",
      read: true
    }
  ])

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Close sidebar when clicking outside (mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
      />

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <Header
          user={user}
          notifications={notifications}
          onMenuToggle={handleMenuToggle}
          onLogout={onLogout}
        />

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-bold text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">SUMATIN</h1>
          <p className="text-muted-foreground text-sm">
            Teachers & Student Information System
          </p>
        </div>

        {/* Form card */}
        <div className="sumatin-card p-6">
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
              {subtitle && (
                <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
              )}
            </div>
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          © 2024 SUMATIN. All rights reserved.
        </div>
      </div>
    </div>
  )
}

export function PageHeader({ 
  title, 
  subtitle, 
  children, 
  breadcrumbs,
  className,
  ...props 
}) {
  return (
    <div className={cn("mb-6", className)} {...props}>
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <nav className="mb-4">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2">/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-foreground">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-foreground">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Header content */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {children && (
          <div className="flex items-center space-x-3">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

export function PageContent({ children, className, ...props }) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {children}
    </div>
  )
}


import { Link, useLocation } from "react-router-dom"
import { 
  Home,
  Users,
  GraduationCap,
  UserCheck,
  ClipboardList,
  BookOpen,
  Library,
  MessageSquare,
  Settings,
  School,
  Calendar,
  BarChart3,
  FileText,
  Upload,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navigationItems = {
  admin: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home
    },
    {
      title: "Schools",
      href: "/schools",
      icon: School
    },
    {
      title: "Users",
      href: "/users",
      icon: Users,
      children: [
        { title: "All Users", href: "/users" },
        { title: "Teachers", href: "/users/teachers" },
        { title: "Students", href: "/users/students" },
        { title: "Parents", href: "/users/parents" }
      ]
    },
    {
      title: "Grades & Classes",
      href: "/grades",
      icon: GraduationCap
    },
    {
      title: "Attendance",
      href: "/attendance",
      icon: UserCheck
    },
    {
      title: "Assessments",
      href: "/assessments",
      icon: ClipboardList
    },
    {
      title: "Library",
      href: "/library",
      icon: Library
    },
    {
      title: "Learning",
      href: "/learning",
      icon: BookOpen
    },
    {
      title: "Feeds",
      href: "/feeds",
      icon: MessageSquare
    },
    {
      title: "Reports",
      href: "/reports",
      icon: BarChart3
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings
    }
  ],
  teacher: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home
    },
    {
      title: "My Classes",
      href: "/classes",
      icon: GraduationCap
    },
    {
      title: "Attendance",
      href: "/attendance",
      icon: UserCheck,
      children: [
        { title: "Take Attendance", href: "/attendance/take" },
        { title: "View Records", href: "/attendance/records" }
      ]
    },
    {
      title: "Assessments",
      href: "/assessments",
      icon: ClipboardList,
      children: [
        { title: "Grade Assessments", href: "/assessments/grade" },
        { title: "View Results", href: "/assessments/results" }
      ]
    },
    {
      title: "Learning",
      href: "/learning",
      icon: BookOpen,
      children: [
        { title: "Create Content", href: "/learning/create" },
        { title: "My Content", href: "/learning/my-content" }
      ]
    },
    {
      title: "Library",
      href: "/library",
      icon: Library
    },
    {
      title: "Feeds",
      href: "/feeds",
      icon: MessageSquare
    },
    {
      title: "Reports",
      href: "/reports",
      icon: BarChart3
    }
  ],
  student: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home
    },
    {
      title: "My Grades",
      href: "/grades",
      icon: ClipboardList
    },
    {
      title: "Attendance",
      href: "/attendance",
      icon: UserCheck
    },
    {
      title: "Learning",
      href: "/learning",
      icon: BookOpen
    },
    {
      title: "Library",
      href: "/library",
      icon: Library
    },
    {
      title: "Feeds",
      href: "/feeds",
      icon: MessageSquare
    },
    {
      title: "Calendar",
      href: "/calendar",
      icon: Calendar
    }
  ],
  parent: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home
    },
    {
      title: "My Children",
      href: "/children",
      icon: Users
    },
    {
      title: "Grades & Progress",
      href: "/grades",
      icon: ClipboardList
    },
    {
      title: "Attendance",
      href: "/attendance",
      icon: UserCheck
    },
    {
      title: "Feeds",
      href: "/feeds",
      icon: MessageSquare
    },
    {
      title: "Reports",
      href: "/reports",
      icon: FileText
    }
  ]
}

export function Sidebar({ 
  user, 
  isOpen = true, 
  onClose,
  className,
  ...props 
}) {
  const location = useLocation()
  const [expandedItems, setExpandedItems] = useState(new Set())

  const userRole = user?.role || 'student'
  const navItems = navigationItems[userRole] || navigationItems.student

  const toggleExpanded = (href) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(href)) {
      newExpanded.delete(href)
    } else {
      newExpanded.add(href)
    }
    setExpandedItems(newExpanded)
  }

  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  const isChildActive = (children) => {
    return children?.some(child => isActive(child.href))
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 sumatin-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
        {...props}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-lg text-sidebar-foreground">
                SUMATIN
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto sumatin-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon
              const hasChildren = item.children && item.children.length > 0
              const isExpanded = expandedItems.has(item.href)
              const itemIsActive = isActive(item.href) || isChildActive(item.children)

              return (
                <div key={item.href}>
                  {hasChildren ? (
                    <button
                      onClick={() => toggleExpanded(item.href)}
                      className={cn(
                        "sumatin-nav-item w-full justify-between",
                        itemIsActive ? "sumatin-nav-item-active" : "sumatin-nav-item-inactive"
                      )}
                    >
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 mr-3" />
                        <span>{item.title}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn(
                        "sumatin-nav-item",
                        itemIsActive ? "sumatin-nav-item-active" : "sumatin-nav-item-inactive"
                      )}
                      onClick={onClose}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <span>{item.title}</span>
                    </Link>
                  )}

                  {/* Children */}
                  {hasChildren && isExpanded && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className={cn(
                            "sumatin-nav-item text-sm",
                            isActive(child.href) ? "sumatin-nav-item-active" : "sumatin-nav-item-inactive"
                          )}
                          onClick={onClose}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-medium text-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-sidebar-foreground/70 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}


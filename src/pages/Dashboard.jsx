import { useState, useEffect } from "react"
import { 
  Users, 
  GraduationCap, 
  UserCheck, 
  ClipboardList,
  TrendingUp,
  Calendar,
  Bell,
  BookOpen
} from "lucide-react"
import { PageHeader, PageContent } from "../components/layout/Layout"
import { StatsCard, StatsGrid } from "../components/ui/stats-card"
import { DataTable } from "../components/ui/data-table"
import { Badge } from "../components/ui/badge"
import { LoadingCard } from "../components/ui/loading"
import { cn, formatDate, getRelativeTime } from "@/lib/utils"

// Mock data - replace with real API calls
const mockStats = {
  admin: {
    totalUsers: 1250,
    totalStudents: 980,
    totalTeachers: 45,
    totalSchools: 3,
    attendanceRate: 94.5,
    activeUsers: 1180
  },
  teacher: {
    totalStudents: 120,
    totalClasses: 5,
    attendanceRate: 96.2,
    pendingGrades: 15,
    upcomingClasses: 3
  },
  student: {
    currentGPA: 3.7,
    attendanceRate: 95.8,
    completedAssignments: 28,
    pendingAssignments: 3,
    upcomingExams: 2
  },
  parent: {
    children: 2,
    averageGPA: 3.5,
    attendanceRate: 94.2,
    upcomingEvents: 4
  }
}

const mockRecentActivities = [
  {
    id: 1,
    type: "assignment",
    title: "Mathematics Assignment Submitted",
    description: "John Doe submitted Algebra homework",
    time: "2 minutes ago",
    status: "completed"
  },
  {
    id: 2,
    type: "attendance",
    title: "Attendance Marked",
    description: "Grade 10-A attendance marked for today",
    time: "1 hour ago",
    status: "completed"
  },
  {
    id: 3,
    type: "grade",
    title: "Grade Updated",
    description: "Science test grades published for Grade 9-B",
    time: "3 hours ago",
    status: "published"
  },
  {
    id: 4,
    type: "announcement",
    title: "New Announcement",
    description: "Parent-teacher meeting scheduled for next week",
    time: "5 hours ago",
    status: "active"
  }
]

const mockUpcomingEvents = [
  {
    id: 1,
    title: "Parent-Teacher Meeting",
    date: "2024-01-25",
    time: "10:00 AM",
    type: "meeting"
  },
  {
    id: 2,
    title: "Mathematics Exam",
    date: "2024-01-28",
    time: "9:00 AM",
    type: "exam"
  },
  {
    id: 3,
    title: "Science Fair",
    date: "2024-02-01",
    time: "2:00 PM",
    type: "event"
  }
]

export function Dashboard({ user }) {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [recentActivities, setRecentActivities] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])

  const userRole = user?.role || 'student'

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats(mockStats[userRole] || mockStats.student)
      setRecentActivities(mockRecentActivities)
      setUpcomingEvents(mockUpcomingEvents)
      setLoading(false)
    }, 1000)
  }, [userRole])

  const getStatsCards = () => {
    switch (userRole) {
      case 'admin':
        return [
          {
            title: "Total Users",
            value: stats.totalUsers?.toLocaleString(),
            icon: Users,
            trend: "up",
            trendValue: "+12%"
          },
          {
            title: "Students",
            value: stats.totalStudents?.toLocaleString(),
            icon: GraduationCap,
            trend: "up",
            trendValue: "+8%"
          },
          {
            title: "Teachers",
            value: stats.totalTeachers,
            icon: UserCheck,
            trend: "up",
            trendValue: "+2"
          },
          {
            title: "Attendance Rate",
            value: `${stats.attendanceRate}%`,
            icon: ClipboardList,
            trend: "up",
            trendValue: "+1.2%"
          }
        ]
      
      case 'teacher':
        return [
          {
            title: "My Students",
            value: stats.totalStudents,
            icon: GraduationCap,
            description: "Across all classes"
          },
          {
            title: "My Classes",
            value: stats.totalClasses,
            icon: BookOpen,
            description: "Active this semester"
          },
          {
            title: "Attendance Rate",
            value: `${stats.attendanceRate}%`,
            icon: UserCheck,
            trend: "up",
            trendValue: "+2.1%"
          },
          {
            title: "Pending Grades",
            value: stats.pendingGrades,
            icon: ClipboardList,
            description: "Need to be graded"
          }
        ]
      
      case 'student':
        return [
          {
            title: "Current GPA",
            value: stats.currentGPA,
            icon: TrendingUp,
            trend: "up",
            trendValue: "+0.2"
          },
          {
            title: "Attendance Rate",
            value: `${stats.attendanceRate}%`,
            icon: UserCheck,
            trend: "up",
            trendValue: "+1.5%"
          },
          {
            title: "Completed",
            value: stats.completedAssignments,
            icon: ClipboardList,
            description: "Assignments this month"
          },
          {
            title: "Upcoming Exams",
            value: stats.upcomingExams,
            icon: Calendar,
            description: "This week"
          }
        ]
      
      case 'parent':
        return [
          {
            title: "My Children",
            value: stats.children,
            icon: Users,
            description: "Enrolled students"
          },
          {
            title: "Average GPA",
            value: stats.averageGPA,
            icon: TrendingUp,
            trend: "up",
            trendValue: "+0.1"
          },
          {
            title: "Attendance Rate",
            value: `${stats.attendanceRate}%`,
            icon: UserCheck,
            trend: "up",
            trendValue: "+0.8%"
          },
          {
            title: "Upcoming Events",
            value: stats.upcomingEvents,
            icon: Calendar,
            description: "This month"
          }
        ]
      
      default:
        return []
    }
  }

  const activityColumns = [
    {
      key: "title",
      title: "Activity",
      render: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-sm text-muted-foreground">{row.description}</p>
        </div>
      )
    },
    {
      key: "time",
      title: "Time",
      render: (value) => (
        <span className="text-sm text-muted-foreground">{value}</span>
      )
    },
    {
      key: "status",
      title: "Status",
      render: (value) => <Badge variant="success">{value}</Badge>
    }
  ]

  const eventColumns = [
    {
      key: "title",
      title: "Event",
      render: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-sm text-muted-foreground">
            {formatDate(row.date)} at {row.time}
          </p>
        </div>
      )
    },
    {
      key: "type",
      title: "Type",
      render: (value) => <Badge variant="info">{value}</Badge>
    }
  ]

  if (loading) {
    return (
      <PageContent>
        <PageHeader
          title="Dashboard"
          subtitle={`Welcome back, ${user?.firstName}!`}
        />
        <StatsGrid>
          {[1, 2, 3, 4].map(i => (
            <LoadingCard key={i} />
          ))}
        </StatsGrid>
      </PageContent>
    )
  }

  return (
    <PageContent>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.firstName}!`}
      />

      {/* Stats Cards */}
      <StatsGrid>
        {getStatsCards().map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </StatsGrid>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="sumatin-card">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Recent Activities
            </h3>
          </div>
          <div className="p-6">
            <DataTable
              data={recentActivities}
              columns={activityColumns}
              pagination={false}
              searchable={false}
            />
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="sumatin-card">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Events
            </h3>
          </div>
          <div className="p-6">
            <DataTable
              data={upcomingEvents}
              columns={eventColumns}
              pagination={false}
              searchable={false}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="sumatin-card p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {userRole === 'admin' && (
            <>
              <button className="sumatin-button-secondary p-4 h-auto flex flex-col items-center space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Manage Users</span>
              </button>
              <button className="sumatin-button-secondary p-4 h-auto flex flex-col items-center space-y-2">
                <GraduationCap className="h-6 w-6" />
                <span className="text-sm">View Schools</span>
              </button>
            </>
          )}
          
          {userRole === 'teacher' && (
            <>
              <button className="sumatin-button-secondary p-4 h-auto flex flex-col items-center space-y-2">
                <UserCheck className="h-6 w-6" />
                <span className="text-sm">Take Attendance</span>
              </button>
              <button className="sumatin-button-secondary p-4 h-auto flex flex-col items-center space-y-2">
                <ClipboardList className="h-6 w-6" />
                <span className="text-sm">Grade Assignments</span>
              </button>
            </>
          )}
          
          <button className="sumatin-button-secondary p-4 h-auto flex flex-col items-center space-y-2">
            <BookOpen className="h-6 w-6" />
            <span className="text-sm">Library</span>
          </button>
          <button className="sumatin-button-secondary p-4 h-auto flex flex-col items-center space-y-2">
            <Calendar className="h-6 w-6" />
            <span className="text-sm">Calendar</span>
          </button>
        </div>
      </div>
    </PageContent>
  )
}


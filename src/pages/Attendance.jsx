import { useState, useEffect } from "react"
import { Calendar, Users, UserCheck, Clock, AlertCircle, Plus, Save } from "lucide-react"
import { PageHeader, PageContent } from "../components/layout/Layout"
import { DataTable } from "../components/ui/data-table"
import { StatsCard, StatsGrid } from "../components/ui/stats-card"
import { Badge, StatusBadge } from "../components/ui/badge"
import { LoadingCard } from "../components/ui/loading"
import { useAuth } from "../contexts/AuthContext"
import { cn, formatDate } from "@/lib/utils"

// Mock data - replace with real API calls
const mockGrades = [
  { id: 1, name: "Grade 10-A", totalStudents: 30 },
  { id: 2, name: "Grade 10-B", totalStudents: 28 },
  { id: 3, name: "Grade 9-A", totalStudents: 32 }
]

const mockStudents = [
  {
    id: 1,
    name: "John Doe",
    rollNumber: "2024001",
    gradeId: 1,
    attendance: null
  },
  {
    id: 2,
    name: "Jane Smith",
    rollNumber: "2024002",
    gradeId: 1,
    attendance: null
  },
  {
    id: 3,
    name: "Mike Johnson",
    rollNumber: "2024003",
    gradeId: 1,
    attendance: null
  }
]

const mockAttendanceRecords = [
  {
    id: 1,
    studentName: "John Doe",
    gradeName: "Grade 10-A",
    date: "2024-01-20",
    status: "present",
    markedBy: "Ms. Johnson"
  },
  {
    id: 2,
    studentName: "Jane Smith",
    gradeName: "Grade 10-A",
    date: "2024-01-20",
    status: "late",
    markedBy: "Ms. Johnson"
  },
  {
    id: 3,
    studentName: "Mike Johnson",
    gradeName: "Grade 10-A",
    date: "2024-01-20",
    status: "absent",
    markedBy: "Ms. Johnson"
  }
]

const mockStats = {
  totalStudents: 90,
  presentToday: 82,
  absentToday: 6,
  lateToday: 2,
  attendanceRate: 93.3
}

export function Attendance() {
  const { user, isTeacher, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState("take")
  const [selectedGrade, setSelectedGrade] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState([])
  const [attendanceData, setAttendanceData] = useState({})
  const [grades, setGrades] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setGrades(mockGrades)
      setAttendanceRecords(mockAttendanceRecords)
      setStats(mockStats)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    if (selectedGrade) {
      // Load students for selected grade
      const gradeStudents = mockStudents.filter(s => s.gradeId === selectedGrade.id)
      setStudents(gradeStudents)
      
      // Initialize attendance data
      const initialData = {}
      gradeStudents.forEach(student => {
        initialData[student.id] = {
          status: 'present',
          notes: ''
        }
      })
      setAttendanceData(initialData)
    }
  }, [selectedGrade])

  const handleAttendanceChange = (studentId, field, value) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }))
  }

  const handleSaveAttendance = async () => {
    if (!selectedGrade || !selectedDate) return

    setSaving(true)
    try {
      // Prepare attendance records
      const records = students.map(student => ({
        studentId: student.id,
        status: attendanceData[student.id]?.status || 'present',
        notes: attendanceData[student.id]?.notes || ''
      }))

      // API call to save attendance
      console.log('Saving attendance:', {
        gradeId: selectedGrade.id,
        date: selectedDate,
        attendanceRecords: records
      })

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Attendance saved successfully!')
    } catch (error) {
      console.error('Error saving attendance:', error)
      alert('Failed to save attendance')
    } finally {
      setSaving(false)
    }
  }

  const attendanceColumns = [
    {
      key: "studentName",
      title: "Student",
      render: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-sm text-muted-foreground">{row.gradeName}</p>
        </div>
      )
    },
    {
      key: "date",
      title: "Date",
      render: (value) => formatDate(value)
    },
    {
      key: "status",
      title: "Status",
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: "markedBy",
      title: "Marked By",
      render: (value) => value || "System"
    }
  ]

  if (loading) {
    return (
      <PageContent>
        <PageHeader
          title="Attendance Management"
          subtitle="Track and manage student attendance"
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
        title="Attendance Management"
        subtitle="Track and manage student attendance"
      />

      {/* Stats Cards */}
      <StatsGrid>
        <StatsCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          description="Enrolled students"
        />
        <StatsCard
          title="Present Today"
          value={stats.presentToday}
          icon={UserCheck}
          trend="up"
          trendValue={`${stats.attendanceRate}%`}
        />
        <StatsCard
          title="Absent Today"
          value={stats.absentToday}
          icon={AlertCircle}
          description="Students absent"
        />
        <StatsCard
          title="Late Today"
          value={stats.lateToday}
          icon={Clock}
          description="Students late"
        />
      </StatsGrid>

      {/* Tab Navigation */}
      <div className="sumatin-card">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {(isTeacher || isAdmin) && (
              <button
                onClick={() => setActiveTab("take")}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm",
                  activeTab === "take"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                )}
              >
                Take Attendance
              </button>
            )}
            <button
              onClick={() => setActiveTab("records")}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm",
                activeTab === "records"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              )}
            >
              Attendance Records
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm",
                activeTab === "reports"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              )}
            >
              Reports
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Take Attendance Tab */}
          {activeTab === "take" && (isTeacher || isAdmin) && (
            <div className="space-y-6">
              {/* Grade and Date Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="sumatin-form-group">
                  <label className="sumatin-form-label">Select Grade/Class</label>
                  <select
                    value={selectedGrade?.id || ""}
                    onChange={(e) => {
                      const grade = grades.find(g => g.id === parseInt(e.target.value))
                      setSelectedGrade(grade)
                    }}
                    className="sumatin-input w-full"
                  >
                    <option value="">Choose a grade...</option>
                    {grades.map(grade => (
                      <option key={grade.id} value={grade.id}>
                        {grade.name} ({grade.totalStudents} students)
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="sumatin-form-group">
                  <label className="sumatin-form-label">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="sumatin-input w-full"
                  />
                </div>
              </div>

              {/* Student Attendance List */}
              {selectedGrade && students.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {selectedGrade.name} - {formatDate(selectedDate)}
                    </h3>
                    <button
                      onClick={handleSaveAttendance}
                      disabled={saving}
                      className="sumatin-button-primary flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Attendance"}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {students.map(student => (
                      <div key={student.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex space-x-2">
                            {['present', 'absent', 'late', 'excused'].map(status => (
                              <label key={status} className="flex items-center space-x-1">
                                <input
                                  type="radio"
                                  name={`attendance-${student.id}`}
                                  value={status}
                                  checked={attendanceData[student.id]?.status === status}
                                  onChange={(e) => handleAttendanceChange(student.id, 'status', e.target.value)}
                                  className="text-primary focus:ring-primary"
                                />
                                <span className="text-sm capitalize">{status}</span>
                              </label>
                            ))}
                          </div>
                          
                          <input
                            type="text"
                            placeholder="Notes (optional)"
                            value={attendanceData[student.id]?.notes || ''}
                            onChange={(e) => handleAttendanceChange(student.id, 'notes', e.target.value)}
                            className="sumatin-input w-32 text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedGrade && students.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No students found for this grade.
                </div>
              )}

              {!selectedGrade && (
                <div className="text-center py-8 text-muted-foreground">
                  Please select a grade to take attendance.
                </div>
              )}
            </div>
          )}

          {/* Attendance Records Tab */}
          {activeTab === "records" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Attendance Records</h3>
                <div className="flex items-center space-x-4">
                  <input
                    type="date"
                    className="sumatin-input"
                    placeholder="Filter by date"
                  />
                  <select className="sumatin-input">
                    <option value="">All Grades</option>
                    {grades.map(grade => (
                      <option key={grade.id} value={grade.id}>{grade.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <DataTable
                data={attendanceRecords}
                columns={attendanceColumns}
                searchable={true}
                sortable={true}
                pagination={true}
                pageSize={20}
              />
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Attendance Reports</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="sumatin-card p-6">
                  <h4 className="font-semibold mb-4">Daily Report</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate daily attendance report for all grades
                  </p>
                  <button className="sumatin-button-primary w-full">
                    Generate Report
                  </button>
                </div>
                
                <div className="sumatin-card p-6">
                  <h4 className="font-semibold mb-4">Monthly Report</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate monthly attendance summary
                  </p>
                  <button className="sumatin-button-primary w-full">
                    Generate Report
                  </button>
                </div>
                
                <div className="sumatin-card p-6">
                  <h4 className="font-semibold mb-4">Student Report</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate individual student attendance report
                  </p>
                  <button className="sumatin-button-primary w-full">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContent>
  )
}


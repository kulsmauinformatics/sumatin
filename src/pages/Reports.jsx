import { useState, useEffect } from "react"
import { Download, FileText, Calendar, Users, GraduationCap, Filter } from "lucide-react"
import { PageHeader, PageContent } from "../components/layout/Layout"
import { StatsCard, StatsGrid } from "../components/ui/stats-card"
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
  { id: 1, name: "John Doe", rollNumber: "2024001", gradeId: 1, gradeName: "Grade 10-A" },
  { id: 2, name: "Jane Smith", rollNumber: "2024002", gradeId: 1, gradeName: "Grade 10-A" },
  { id: 3, name: "Mike Johnson", rollNumber: "2024003", gradeId: 1, gradeName: "Grade 10-A" }
]

const mockStats = {
  totalReports: 156,
  reportsThisMonth: 23,
  studentsWithReports: 89,
  averageGrade: 85.4
}

export function Reports() {
  const { user, isTeacher, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState("generate")
  const [grades, setGrades] = useState([])
  const [students, setStudents] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  
  // Form states
  const [reportType, setReportType] = useState("student")
  const [selectedGrade, setSelectedGrade] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [includeAttendance, setIncludeAttendance] = useState(true)
  const [includeGrades, setIncludeGrades] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setGrades(mockGrades)
      setStudents(mockStudents)
      setStats(mockStats)
      setLoading(false)
    }, 1000)
  }, [])

  const handleGenerateReport = async () => {
    setGenerating(true)
    
    try {
      let url = ''
      let params = new URLSearchParams()
      
      if (reportType === 'student' && selectedStudent) {
        url = `/api/reports/student/${selectedStudent}`
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)
        params.append('includeAttendance', includeAttendance)
        params.append('includeGrades', includeGrades)
      } else if (reportType === 'attendance' && selectedGrade && startDate && endDate) {
        url = '/api/reports/attendance'
        params.append('gradeId', selectedGrade)
        params.append('startDate', startDate)
        params.append('endDate', endDate)
      } else if (reportType === 'grade' && selectedGrade) {
        url = `/api/reports/grade/${selectedGrade}/summary`
      } else {
        alert('Please fill in all required fields')
        setGenerating(false)
        return
      }
      
      // Simulate API call
      console.log('Generating report:', { url, params: params.toString() })
      
      // In real implementation, this would download the PDF
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate file download
      const link = document.createElement('a')
      link.href = '#'
      link.download = `${reportType}-report-${Date.now()}.pdf`
      link.click()
      
      alert('Report generated successfully!')
      
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Failed to generate report')
    } finally {
      setGenerating(false)
    }
  }

  const reportHistory = [
    {
      id: 1,
      type: "Student Report",
      name: "John Doe - Academic Report",
      generatedAt: "2024-01-20T10:30:00Z",
      generatedBy: "Ms. Johnson",
      size: "2.3 MB"
    },
    {
      id: 2,
      type: "Attendance Report",
      name: "Grade 10-A - January 2024",
      generatedAt: "2024-01-19T14:15:00Z",
      generatedBy: "Mr. Smith",
      size: "1.8 MB"
    },
    {
      id: 3,
      type: "Grade Summary",
      name: "Grade 9-A - Class List",
      generatedAt: "2024-01-18T09:45:00Z",
      generatedBy: "Dr. Wilson",
      size: "1.2 MB"
    }
  ]

  if (loading) {
    return (
      <PageContent>
        <PageHeader
          title="Reports & Analytics"
          subtitle="Generate and manage academic reports"
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
        title="Reports & Analytics"
        subtitle="Generate and manage academic reports"
      />

      {/* Stats Cards */}
      <StatsGrid>
        <StatsCard
          title="Total Reports"
          value={stats.totalReports}
          icon={FileText}
          description="All time generated"
        />
        <StatsCard
          title="This Month"
          value={stats.reportsThisMonth}
          icon={Calendar}
          trend="up"
          trendValue="12%"
        />
        <StatsCard
          title="Students with Reports"
          value={stats.studentsWithReports}
          icon={Users}
          description="Have generated reports"
        />
        <StatsCard
          title="Average Grade"
          value={`${stats.averageGrade}%`}
          icon={GraduationCap}
          trend="up"
          trendValue="2.3%"
        />
      </StatsGrid>

      {/* Tab Navigation */}
      <div className="sumatin-card">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("generate")}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm",
                activeTab === "generate"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              )}
            >
              Generate Reports
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm",
                activeTab === "history"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              )}
            >
              Report History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Generate Reports Tab */}
          {activeTab === "generate" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Report Configuration */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Report Configuration</h3>
                  
                  {/* Report Type */}
                  <div className="sumatin-form-group">
                    <label className="sumatin-form-label">Report Type</label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="sumatin-input w-full"
                    >
                      <option value="student">Student Report Card</option>
                      <option value="attendance">Attendance Report</option>
                      <option value="grade">Grade Summary</option>
                    </select>
                  </div>

                  {/* Grade Selection */}
                  {(reportType === 'attendance' || reportType === 'grade') && (
                    <div className="sumatin-form-group">
                      <label className="sumatin-form-label">Select Grade/Class</label>
                      <select
                        value={selectedGrade}
                        onChange={(e) => setSelectedGrade(e.target.value)}
                        className="sumatin-input w-full"
                        required
                      >
                        <option value="">Choose a grade...</option>
                        {grades.map(grade => (
                          <option key={grade.id} value={grade.id}>
                            {grade.name} ({grade.totalStudents} students)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Student Selection */}
                  {reportType === 'student' && (
                    <div className="sumatin-form-group">
                      <label className="sumatin-form-label">Select Student</label>
                      <select
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className="sumatin-input w-full"
                        required
                      >
                        <option value="">Choose a student...</option>
                        {students.map(student => (
                          <option key={student.id} value={student.id}>
                            {student.name} ({student.rollNumber}) - {student.gradeName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Date Range */}
                  {(reportType === 'student' || reportType === 'attendance') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="sumatin-form-group">
                        <label className="sumatin-form-label">
                          Start Date {reportType === 'attendance' && '*'}
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="sumatin-input w-full"
                          required={reportType === 'attendance'}
                        />
                      </div>
                      <div className="sumatin-form-group">
                        <label className="sumatin-form-label">
                          End Date {reportType === 'attendance' && '*'}
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="sumatin-input w-full"
                          required={reportType === 'attendance'}
                        />
                      </div>
                    </div>
                  )}

                  {/* Student Report Options */}
                  {reportType === 'student' && (
                    <div className="space-y-3">
                      <label className="sumatin-form-label">Include in Report</label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={includeAttendance}
                            onChange={(e) => setIncludeAttendance(e.target.checked)}
                            className="text-primary focus:ring-primary"
                          />
                          <span className="text-sm">Attendance Summary</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={includeGrades}
                            onChange={(e) => setIncludeGrades(e.target.checked)}
                            className="text-primary focus:ring-primary"
                          />
                          <span className="text-sm">Academic Grades</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerateReport}
                    disabled={generating}
                    className="sumatin-button-primary w-full flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {generating ? "Generating..." : "Generate PDF Report"}
                  </button>
                </div>

                {/* Report Preview */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Report Preview</h3>
                  
                  <div className="sumatin-card p-6 bg-muted/50">
                    <div className="text-center space-y-4">
                      <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">
                          {reportType === 'student' && 'Student Report Card'}
                          {reportType === 'attendance' && 'Attendance Report'}
                          {reportType === 'grade' && 'Grade Summary Report'}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Configure the options on the left to generate your report
                        </p>
                      </div>
                      
                      {reportType === 'student' && selectedStudent && (
                        <div className="text-left space-y-2 mt-4">
                          <p className="text-sm"><strong>Student:</strong> {students.find(s => s.id == selectedStudent)?.name}</p>
                          <p className="text-sm"><strong>Period:</strong> {startDate || 'All time'} to {endDate || 'Present'}</p>
                          <p className="text-sm"><strong>Includes:</strong> {[includeAttendance && 'Attendance', includeGrades && 'Grades'].filter(Boolean).join(', ')}</p>
                        </div>
                      )}
                      
                      {reportType === 'attendance' && selectedGrade && startDate && endDate && (
                        <div className="text-left space-y-2 mt-4">
                          <p className="text-sm"><strong>Grade:</strong> {grades.find(g => g.id == selectedGrade)?.name}</p>
                          <p className="text-sm"><strong>Period:</strong> {formatDate(startDate)} to {formatDate(endDate)}</p>
                          <p className="text-sm"><strong>Students:</strong> {grades.find(g => g.id == selectedGrade)?.totalStudents}</p>
                        </div>
                      )}
                      
                      {reportType === 'grade' && selectedGrade && (
                        <div className="text-left space-y-2 mt-4">
                          <p className="text-sm"><strong>Grade:</strong> {grades.find(g => g.id == selectedGrade)?.name}</p>
                          <p className="text-sm"><strong>Students:</strong> {grades.find(g => g.id == selectedGrade)?.totalStudents}</p>
                          <p className="text-sm"><strong>Type:</strong> Class summary with student list</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Report History Tab */}
          {activeTab === "history" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Report History</h3>
                <div className="flex items-center space-x-4">
                  <button className="sumatin-button-secondary flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {reportHistory.map(report => (
                  <div key={report.id} className="sumatin-card p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {report.type} • Generated by {report.generatedBy} • {formatDate(report.generatedAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-muted-foreground">{report.size}</span>
                      <button className="sumatin-button-secondary flex items-center">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContent>
  )
}


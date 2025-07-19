import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, Building, Users, GraduationCap } from "lucide-react"
import { PageHeader, PageContent } from "../components/layout/Layout"
import { DataTable, TableActions, TableAction } from "../components/ui/data-table"
import { StatsCard, StatsGrid } from "../components/ui/stats-card"
import { Badge } from "../components/ui/badge"
import { LoadingCard } from "../components/ui/loading"
import { cn, formatDate } from "@/lib/utils"

// Mock data - replace with real API calls
const mockSchools = [
  {
    id: 1,
    name: "Greenwood Elementary School",
    address: "123 Main Street, Springfield, IL",
    contactPhone: "+1-555-0123",
    contactEmail: "info@greenwood.edu",
    principalName: "Dr. Sarah Johnson",
    establishedYear: 1985,
    schoolType: "public",
    isActive: true,
    totalStudents: 450,
    totalTeachers: 25,
    totalGrades: 6,
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    name: "Riverside High School",
    address: "456 Oak Avenue, Springfield, IL",
    contactPhone: "+1-555-0124",
    contactEmail: "admin@riverside.edu",
    principalName: "Mr. Michael Chen",
    establishedYear: 1972,
    schoolType: "public",
    isActive: true,
    totalStudents: 1200,
    totalTeachers: 65,
    totalGrades: 4,
    createdAt: "2024-01-10T09:30:00Z"
  },
  {
    id: 3,
    name: "St. Mary's Academy",
    address: "789 Pine Street, Springfield, IL",
    contactPhone: "+1-555-0125",
    contactEmail: "office@stmarys.edu",
    principalName: "Sister Margaret O'Brien",
    establishedYear: 1955,
    schoolType: "private",
    isActive: true,
    totalStudents: 320,
    totalTeachers: 18,
    totalGrades: 8,
    createdAt: "2024-01-05T14:15:00Z"
  }
]

const mockStats = {
  totalSchools: 3,
  totalStudents: 1970,
  totalTeachers: 108,
  activeSchools: 3
}

export function Schools() {
  const [schools, setSchools] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSchools(mockSchools)
      setStats(mockStats)
      setLoading(false)
    }, 1000)
  }, [])

  const handleViewSchool = (school) => {
    setSelectedSchool(school)
    // Navigate to school details page or open modal
    console.log('View school:', school)
  }

  const handleEditSchool = (school) => {
    setSelectedSchool(school)
    setShowEditModal(true)
  }

  const handleDeleteSchool = (school) => {
    if (window.confirm(`Are you sure you want to delete ${school.name}?`)) {
      // API call to delete school
      console.log('Delete school:', school)
      setSchools(prev => prev.filter(s => s.id !== school.id))
    }
  }

  const handleCreateSchool = () => {
    setShowCreateModal(true)
  }

  const schoolColumns = [
    {
      key: "name",
      title: "School Name",
      render: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-sm text-muted-foreground">{row.address}</p>
        </div>
      )
    },
    {
      key: "principalName",
      title: "Principal",
      render: (value) => value || "Not assigned"
    },
    {
      key: "schoolType",
      title: "Type",
      render: (value) => (
        <Badge variant={value === 'private' ? 'info' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    {
      key: "totalStudents",
      title: "Students",
      render: (value) => value?.toLocaleString() || "0"
    },
    {
      key: "totalTeachers",
      title: "Teachers",
      render: (value) => value?.toLocaleString() || "0"
    },
    {
      key: "establishedYear",
      title: "Established",
      render: (value) => value || "N/A"
    },
    {
      key: "isActive",
      title: "Status",
      render: (value) => (
        <Badge variant={value ? "success" : "error"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      key: "actions",
      title: "Actions",
      sortable: false,
      render: (_, row) => (
        <TableActions>
          <TableAction
            icon={Eye}
            label="View Details"
            onClick={() => handleViewSchool(row)}
          />
          <TableAction
            icon={Edit}
            label="Edit School"
            onClick={() => handleEditSchool(row)}
          />
          <TableAction
            icon={Trash2}
            label="Delete School"
            variant="danger"
            onClick={() => handleDeleteSchool(row)}
          />
        </TableActions>
      )
    }
  ]

  if (loading) {
    return (
      <PageContent>
        <PageHeader
          title="School Management"
          subtitle="Manage schools and their information"
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
        title="School Management"
        subtitle="Manage schools and their information"
      >
        <button
          onClick={handleCreateSchool}
          className="sumatin-button-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add School
        </button>
      </PageHeader>

      {/* Stats Cards */}
      <StatsGrid>
        <StatsCard
          title="Total Schools"
          value={stats.totalSchools}
          icon={Building}
          description="All registered schools"
        />
        <StatsCard
          title="Total Students"
          value={stats.totalStudents?.toLocaleString()}
          icon={Users}
          description="Across all schools"
        />
        <StatsCard
          title="Total Teachers"
          value={stats.totalTeachers?.toLocaleString()}
          icon={GraduationCap}
          description="Across all schools"
        />
        <StatsCard
          title="Active Schools"
          value={stats.activeSchools}
          icon={Building}
          description="Currently operational"
        />
      </StatsGrid>

      {/* Schools Table */}
      <DataTable
        data={schools}
        columns={schoolColumns}
        searchable={true}
        sortable={true}
        pagination={true}
        pageSize={10}
      />

      {/* Create School Modal */}
      {showCreateModal && (
        <div className="sumatin-modal-overlay">
          <div className="sumatin-modal-content max-w-2xl">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold">Create New School</h2>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="sumatin-form-group">
                    <label className="sumatin-form-label">School Name *</label>
                    <input
                      type="text"
                      className="sumatin-input w-full"
                      placeholder="Enter school name"
                      required
                    />
                  </div>
                  <div className="sumatin-form-group">
                    <label className="sumatin-form-label">School Type</label>
                    <select className="sumatin-input w-full">
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="charter">Charter</option>
                      <option value="international">International</option>
                    </select>
                  </div>
                </div>
                
                <div className="sumatin-form-group">
                  <label className="sumatin-form-label">Address *</label>
                  <textarea
                    className="sumatin-input w-full"
                    rows="3"
                    placeholder="Enter school address"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="sumatin-form-group">
                    <label className="sumatin-form-label">Contact Phone</label>
                    <input
                      type="tel"
                      className="sumatin-input w-full"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="sumatin-form-group">
                    <label className="sumatin-form-label">Contact Email</label>
                    <input
                      type="email"
                      className="sumatin-input w-full"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="sumatin-form-group">
                    <label className="sumatin-form-label">Principal Name</label>
                    <input
                      type="text"
                      className="sumatin-input w-full"
                      placeholder="Enter principal name"
                    />
                  </div>
                  <div className="sumatin-form-group">
                    <label className="sumatin-form-label">Established Year</label>
                    <input
                      type="number"
                      className="sumatin-input w-full"
                      placeholder="Enter year"
                      min="1800"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>
                
                <div className="sumatin-form-group">
                  <label className="sumatin-form-label">Website</label>
                  <input
                    type="url"
                    className="sumatin-input w-full"
                    placeholder="Enter website URL"
                  />
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-border flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="sumatin-button-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle create school
                  setShowCreateModal(false)
                }}
                className="sumatin-button-primary"
              >
                Create School
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContent>
  )
}


import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronUp, ChevronDown, Search, Filter, MoreHorizontal } from "lucide-react"
import { LoadingSpinner } from "./loading"

export function DataTable({ 
  data = [], 
  columns = [], 
  loading = false,
  searchable = true,
  sortable = true,
  filterable = false,
  pagination = true,
  pageSize = 10,
  className,
  onRowClick,
  ...props 
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
  const [currentPage, setCurrentPage] = useState(1)

  // Filter data based on search term
  const filteredData = searchable && searchTerm
    ? data.filter(row =>
        columns.some(column => {
          const value = row[column.key]
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        })
      )
    : data

  // Sort data
  const sortedData = sortable && sortConfig.key
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    : filteredData

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = pagination 
    ? sortedData.slice(startIndex, startIndex + pageSize)
    : sortedData

  const handleSort = (key) => {
    if (!sortable) return
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }))
  }

  const getSortIcon = (key) => {
    if (!sortable || sortConfig.key !== key) return null
    return sortConfig.direction === "asc" 
      ? <ChevronUp className="h-4 w-4" />
      : <ChevronDown className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="sumatin-card p-8">
        <div className="flex items-center justify-center">
          <LoadingSpinner className="mr-2" />
          <span>Loading data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {/* Search and filters */}
      {(searchable || filterable) && (
        <div className="flex items-center justify-between">
          {searchable && (
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="sumatin-input pl-10"
              />
            </div>
          )}
          {filterable && (
            <button className="sumatin-button-secondary flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="sumatin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="sumatin-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      sortable && column.sortable !== false && "cursor-pointer hover:bg-muted/50",
                      column.headerClassName
                    )}
                    onClick={() => column.sortable !== false && handleSort(column.key)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{column.title}</span>
                      {getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                    No data available
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr
                    key={row.id || index}
                    className={cn(
                      "hover:bg-muted/50 transition-colors",
                      onRowClick && "cursor-pointer",
                      row.className
                    )}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {columns.map((column) => (
                      <td key={column.key} className={column.cellClassName}>
                        {column.render 
                          ? column.render(row[column.key], row)
                          : row[column.key]
                        }
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, sortedData.length)} of {sortedData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="sumatin-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="sumatin-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function TableActions({ children, className, ...props }) {
  return (
    <div className={cn("flex items-center space-x-2", className)} {...props}>
      {children}
    </div>
  )
}

export function TableAction({ onClick, icon: Icon, label, variant = "ghost", ...props }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded-md transition-colors",
        variant === "ghost" && "hover:bg-muted",
        variant === "danger" && "hover:bg-red-100 hover:text-red-600"
      )}
      title={label}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}


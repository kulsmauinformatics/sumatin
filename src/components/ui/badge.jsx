import { cn } from "@/lib/utils"

export function Badge({ 
  children, 
  variant = "default", 
  size = "default",
  className, 
  ...props 
}) {
  const baseClasses = "sumatin-badge"
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    success: "sumatin-badge-success",
    warning: "sumatin-badge-warning",
    error: "sumatin-badge-error",
    info: "sumatin-badge-info",
    outline: "border border-border text-foreground bg-transparent"
  }
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    default: "text-xs px-2.5 py-0.5",
    lg: "text-sm px-3 py-1"
  }

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status, className, ...props }) {
  const statusConfig = {
    active: { variant: "success", text: "Active" },
    inactive: { variant: "error", text: "Inactive" },
    pending: { variant: "warning", text: "Pending" },
    approved: { variant: "success", text: "Approved" },
    rejected: { variant: "error", text: "Rejected" },
    draft: { variant: "secondary", text: "Draft" },
    published: { variant: "success", text: "Published" },
    present: { variant: "success", text: "Present" },
    absent: { variant: "error", text: "Absent" },
    late: { variant: "warning", text: "Late" },
    excused: { variant: "info", text: "Excused" }
  }

  const config = statusConfig[status] || { variant: "default", text: status }

  return (
    <Badge variant={config.variant} className={className} {...props}>
      {config.text}
    </Badge>
  )
}

export function RoleBadge({ role, className, ...props }) {
  const roleConfig = {
    admin: { variant: "error", text: "Admin" },
    teacher: { variant: "info", text: "Teacher" },
    student: { variant: "success", text: "Student" },
    parent: { variant: "secondary", text: "Parent" }
  }

  const config = roleConfig[role] || { variant: "default", text: role }

  return (
    <Badge variant={config.variant} className={className} {...props}>
      {config.text}
    </Badge>
  )
}

export function GradeBadge({ percentage, className, ...props }) {
  let variant = "error"
  let grade = "F"

  if (percentage >= 90) {
    variant = "success"
    grade = "A"
  } else if (percentage >= 80) {
    variant = "info"
    grade = "B"
  } else if (percentage >= 70) {
    variant = "warning"
    grade = "C"
  } else if (percentage >= 60) {
    variant = "secondary"
    grade = "D"
  }

  return (
    <Badge variant={variant} className={className} {...props}>
      {grade} ({percentage}%)
    </Badge>
  )
}


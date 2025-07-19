import { cn } from "@/lib/utils"

export function LoadingSpinner({ className, size = "default", ...props }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  }

  return (
    <div
      className={cn(
        "sumatin-loading",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}

export function LoadingButton({ children, loading, disabled, className, ...props }) {
  return (
    <button
      className={cn(
        "sumatin-button-primary",
        "inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  )
}

export function LoadingCard({ className, children, ...props }) {
  return (
    <div className={cn("sumatin-card p-6", className)} {...props}>
      <div className="flex items-center justify-center space-x-2">
        <LoadingSpinner />
        <span className="text-muted-foreground">
          {children || "Loading..."}
        </span>
      </div>
    </div>
  )
}

export function LoadingPage({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <LoadingSpinner size="xl" />
        <p className="text-lg text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

export function LoadingOverlay({ show, message = "Loading..." }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <LoadingSpinner />
          <span className="text-foreground">{message}</span>
        </div>
      </div>
    </div>
  )
}


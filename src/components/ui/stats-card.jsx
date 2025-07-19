import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export function StatsCard({ 
  title, 
  value, 
  description,
  icon: Icon,
  trend,
  trendValue,
  className,
  ...props 
}) {
  const getTrendIcon = () => {
    if (!trend) return null
    
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  const getTrendColor = () => {
    if (trend === "up") return "text-green-600"
    if (trend === "down") return "text-red-600"
    return "text-gray-600"
  }

  return (
    <div className={cn("sumatin-stats-card", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          {(trend || trendValue) && (
            <div className="flex items-center mt-2 space-x-1">
              {getTrendIcon()}
              {trendValue && (
                <span className={cn("text-sm font-medium", getTrendColor())}>
                  {trendValue}
                </span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className="flex-shrink-0">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function StatsGrid({ children, className, ...props }) {
  return (
    <div 
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  )
}


import { cn, getInitials, getAvatarColor } from "@/lib/utils"

export function Avatar({ 
  src, 
  alt, 
  name, 
  size = "default", 
  className,
  fallbackClassName,
  ...props 
}) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    default: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
    "2xl": "h-20 w-20 text-xl"
  }

  const initials = getInitials(name || alt)
  const colorClass = getAvatarColor(name || alt)

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={cn(
          "sumatin-avatar",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }

  return (
    <div
      className={cn(
        "sumatin-avatar",
        sizeClasses[size],
        colorClass,
        "text-white",
        fallbackClassName,
        className
      )}
      {...props}
    >
      {initials}
    </div>
  )
}

export function AvatarGroup({ 
  avatars = [], 
  max = 3, 
  size = "default",
  className,
  ...props 
}) {
  const visibleAvatars = avatars.slice(0, max)
  const remainingCount = avatars.length - max

  return (
    <div className={cn("flex -space-x-2", className)} {...props}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          size={size}
          className="border-2 border-background"
          {...avatar}
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            "sumatin-avatar bg-muted text-muted-foreground border-2 border-background",
            size === "sm" ? "h-8 w-8 text-xs" :
            size === "lg" ? "h-12 w-12 text-base" :
            size === "xl" ? "h-16 w-16 text-lg" :
            "h-10 w-10 text-sm"
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  )
}


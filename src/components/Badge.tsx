import type React from "react"
import Chip from "@mui/material/Chip"

interface BadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline" | "active" | "inactive"
  children: React.ReactNode
  className?: string
}

function Badge({ variant = "default", children, ...props }: BadgeProps) {
  // Map our custom variants to MUI colors
  const colorMap = {
    default: "primary",
    secondary: "secondary",
    destructive: "error",
    outline: "default",
    active: "success",
    inactive: "default",
  }

  const color = colorMap[variant] as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"

  return (
    <Chip
      label={children}
      color={color}
      size="small"
      variant={variant === "outline" ? "outlined" : "filled"}
      {...props}
    />
  )
}

export { Badge }


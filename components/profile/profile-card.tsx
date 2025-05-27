"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, Shield } from "lucide-react"
import type { User as UserType } from "../../lib/auth"

interface ProfileCardProps {
  user: UserType
}

export function ProfileCard({ user }: ProfileCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "super_admin":
        return "default"
      case "contractor_admin":
        return "secondary"
      case "staff":
        return "outline"
      default:
        return "secondary"
    }
  }

  const formatRole = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Your account details and role information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="text-lg">{getInitials(user.name??"")}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <Badge variant={getRoleBadgeVariant(user.role)}>
              <Shield className="h-3 w-3 mr-1" />
              {formatRole(user.role)}
            </Badge>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center space-x-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Full Name</p>
              <p className="text-sm text-muted-foreground">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email Address</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Phone Number</p>
              <p className="text-sm text-muted-foreground">{user.phone_number}</p>
            </div>
          </div>
        </div>

        {/* <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Member Since</p>
              <p className="text-muted-foreground">{new Date(user.createdAt??"").toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium">Last Login</p>
              <p className="text-muted-foreground">{new Date(user.lastLogin??"").toLocaleString()}</p>
            </div>
          </div>
        </div> */}
      </CardContent>
    </Card>
  )
}

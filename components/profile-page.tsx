"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "../contexts/auth-context"
import { ProfileCard } from "./profile/profile-card"
import { EditProfileForm } from "./profile/edit-profile-form"
import { ChangePasswordForm } from "./profile/change-password-form"

interface ProfilePageProps {
  onLogout: () => void
}

export function ProfilePage({ onLogout }: ProfilePageProps) {
  const { user, logout, updateUser } = useAuth()

  if (!user) return null

  const handleLogout = async () => {
    await logout()
    onLogout()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <ProfileCard user={user} />
        </div>

        <div className="space-y-6">
          <EditProfileForm user={user} onUpdate={updateUser} />
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { AuthProvider, useAuth } from "./contexts/auth-context"
import { LoginPage } from "./components/login-page"
import { ProfilePage } from "./components/profile-page"
import { AppSidebar } from "./components/app-sidebar"
import { Dashboard } from "./components/dashboard"
import { ContractorManagement } from "./components/contractor-management"
import { ParkingLotManagement } from "./components/parking-lot-management"
import { VehicleLogs } from "./components/vehicle-logs"
import { ForgotPasswordPage } from "./components/forgot-password-page"
import { ResetPasswordPage } from "./components/reset-password-page"

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()
  const [currentPage, setCurrentPage] = useState("/dashboard")
  const [authPage, setAuthPage] = useState<"login" | "forgot-password" | "reset-password">("login")

  // Add this useEffect inside AppContent function:
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#reset-password") {
        setAuthPage("reset-password")
        window.location.hash = ""
      }
    }

    window.addEventListener("hashchange", handleHashChange)
    handleHashChange() // Check on mount

    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    switch (authPage) {
      case "forgot-password":
        return <ForgotPasswordPage onBackToLogin={() => setAuthPage("login")} />
      case "reset-password":
        return <ResetPasswordPage onResetSuccess={() => setAuthPage("login")} />
      default:
        return (
          <LoginPage
            onLoginSuccess={() => setCurrentPage("/dashboard")}
            onForgotPassword={() => setAuthPage("forgot-password")}
          />
        )
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case "/dashboard":
        return <Dashboard />
      case "/contractors":
        return <ContractorManagement />
      case "/parking-lots":
        return <ParkingLotManagement />
      case "/vehicle-logs":
        return <VehicleLogs />
      case "/profile":
        return <ProfilePage onLogout={() => setCurrentPage("/dashboard")} />
      case "/users":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">User management features coming soon...</p>
          </div>
        )
      case "/reports":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Reporting features coming soon...</p>
          </div>
        )
      case "/settings":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">System settings coming soon...</p>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  const getPageTitle = () => {
    switch (currentPage) {
      case "/dashboard":
        return "Dashboard"
      case "/contractors":
        return "Contractor Management"
      case "/parking-lots":
        return "Parking Lot Management"
      case "/vehicle-logs":
        return "Vehicle Logs"
      case "/profile":
        return "Profile Settings"
      case "/users":
        return "User Management"
      case "/reports":
        return "Reports"
      case "/settings":
        return "Settings"
      default:
        return "Dashboard"
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar activeItem={currentPage} onNavigate={setCurrentPage} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#" onClick={() => setCurrentPage("/dashboard")}>
                  Parking Admin
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">{renderPage()}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function ParkingAdminApp() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

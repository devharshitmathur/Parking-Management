export interface Contractor {
  id: any
  name: string
  email: string
  phone: string
  assignedLots: string[]
  status: "active" | "inactive"
  createdAt?: string
}

export interface ParkingLot {
  id: string
  name: string
  location: string
  capacity: number
  currentOccupancy: number
  status: "active" | "inactive" | "maintenance"
  contractorId?: string
  contractorName?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "super_admin" | "contractor_admin" | "staff"
  status: "active" | "inactive"
  lastLogin: string
}

export interface VehicleLog {
  id: string
  vehicleNumber: string
  parkingLotId: string
  parkingLotName: string
  contractorName: string
  entryTime: string
  exitTime?: string
  duration?: string
  fee: number
  status: "parked" | "exited"
}

export interface DashboardStats {
  totalContractors: number
  totalParkingLots: number
  vehiclesParkedToday: number
  todayEarnings: number
  monthlyEarnings: number
}

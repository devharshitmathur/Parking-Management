import type { Contractor, ParkingLot, User, VehicleLog, DashboardStats } from "./types"

export const mockContractors: Contractor[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1-555-0123",
    assignedLots: ["1", "2"],
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1-555-0124",
    assignedLots: ["3"],
    status: "active",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike.wilson@email.com",
    phone: "+1-555-0125",
    assignedLots: [],
    status: "inactive",
    createdAt: "2024-03-10",
  },
]

export const mockParkingLots: ParkingLot[] = [
  {
    id: "1",
    name: "Downtown Plaza",
    location: "123 Main St, Downtown",
    capacity: 150,
    currentOccupancy: 120,
    status: "active",
    contractorId: "1",
    contractorName: "John Smith",
  },
  {
    id: "2",
    name: "Shopping Center",
    location: "456 Oak Ave, Midtown",
    capacity: 200,
    currentOccupancy: 180,
    status: "active",
    contractorId: "1",
    contractorName: "John Smith",
  },
  {
    id: "3",
    name: "Business District",
    location: "789 Pine St, Business District",
    capacity: 100,
    currentOccupancy: 45,
    status: "active",
    contractorId: "2",
    contractorName: "Sarah Johnson",
  },
  {
    id: "4",
    name: "Airport Terminal",
    location: "321 Airport Rd, Terminal 1",
    capacity: 300,
    currentOccupancy: 0,
    status: "maintenance",
  },
]

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@parking.com",
    role: "super_admin",
    status: "active",
    lastLogin: "2024-01-20 09:30:00",
  },
  {
    id: "2",
    name: "John Smith",
    email: "john.smith@email.com",
    role: "contractor_admin",
    status: "active",
    lastLogin: "2024-01-20 08:15:00",
  },
  {
    id: "3",
    name: "Jane Doe",
    email: "jane.doe@email.com",
    role: "staff",
    status: "active",
    lastLogin: "2024-01-19 16:45:00",
  },
]

export const mockVehicleLogs: VehicleLog[] = [
  {
    id: "1",
    vehicleNumber: "ABC-123",
    parkingLotId: "1",
    parkingLotName: "Downtown Plaza",
    contractorName: "John Smith",
    entryTime: "2024-01-20 08:30:00",
    exitTime: "2024-01-20 17:30:00",
    duration: "9h 0m",
    fee: 25.0,
    status: "exited",
  },
  {
    id: "2",
    vehicleNumber: "XYZ-789",
    parkingLotId: "2",
    parkingLotName: "Shopping Center",
    contractorName: "John Smith",
    entryTime: "2024-01-20 10:15:00",
    duration: "6h 30m",
    fee: 15.0,
    status: "parked",
  },
  {
    id: "3",
    vehicleNumber: "DEF-456",
    parkingLotId: "3",
    parkingLotName: "Business District",
    contractorName: "Sarah Johnson",
    entryTime: "2024-01-20 07:45:00",
    exitTime: "2024-01-20 18:00:00",
    duration: "10h 15m",
    fee: 30.0,
    status: "exited",
  },
]

export const mockDashboardStats: DashboardStats = {
  totalContractors: 3,
  totalParkingLots: 4,
  vehiclesParkedToday: 45,
  todayEarnings: 1250.0,
  monthlyEarnings: 28500.0,
}

export const mockChartData = [
  { date: "2024-01-14", vehicles: 32, earnings: 890 },
  { date: "2024-01-15", vehicles: 28, earnings: 750 },
  { date: "2024-01-16", vehicles: 41, earnings: 1120 },
  { date: "2024-01-17", vehicles: 38, earnings: 980 },
  { date: "2024-01-18", vehicles: 45, earnings: 1250 },
  { date: "2024-01-19", vehicles: 52, earnings: 1450 },
  { date: "2024-01-20", vehicles: 45, earnings: 1250 },
]

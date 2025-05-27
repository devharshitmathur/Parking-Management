"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Plus, Edit, Trash2, Search, MapPin } from "lucide-react"
import { mockParkingLots, mockContractors } from "../lib/mock-data"
import type { ParkingLot } from "../lib/types"

export function ParkingLotManagement() {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>(mockParkingLots)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLot, setEditingLot] = useState<ParkingLot | null>(null)

  const filteredLots = parkingLots.filter(
    (lot) =>
      lot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lot.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddLot = () => {
    setEditingLot(null)
    setIsDialogOpen(true)
  }

  const handleEditLot = (lot: ParkingLot) => {
    setEditingLot(lot)
    setIsDialogOpen(true)
  }

  const handleDeleteLot = (id: string) => {
    setParkingLots(parkingLots.filter((l) => l.id !== id))
  }

  const handleSaveLot = (formData: FormData) => {
    const name = formData.get("name") as string
    const location = formData.get("location") as string
    const capacity = Number.parseInt(formData.get("capacity") as string)
    const status = formData.get("status") as "active" | "inactive" | "maintenance"
    const contractorId = formData.get("contractorId") as string

    const contractor = mockContractors.find((c) => c.id === contractorId)

    if (editingLot) {
      setParkingLots(
        parkingLots.map((l) =>
          l.id === editingLot.id
            ? {
                ...l,
                name,
                location,
                capacity,
                status,
                contractorId: contractorId || undefined,
                contractorName: contractor?.name || undefined,
              }
            : l,
        ),
      )
    } else {
      const newLot: ParkingLot = {
        id: Date.now().toString(),
        name,
        location,
        capacity,
        currentOccupancy: 0,
        status,
        contractorId: contractorId || undefined,
        contractorName: contractor?.name || undefined,
      }
      setParkingLots([...parkingLots, newLot])
    }
    setIsDialogOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "maintenance":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getOccupancyPercentage = (current: number, capacity: number) => {
    return (current / capacity) * 100
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Parking Lot Management</h1>
          <p className="text-muted-foreground">Manage parking lots and their assignments</p>
        </div>
        <Button onClick={handleAddLot}>
          <Plus className="h-4 w-4 mr-2" />
          Add Parking Lot
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parking Lots</CardTitle>
          <CardDescription>View and manage all parking lots in the system</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search parking lots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead>Contractor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLots.map((lot) => (
                <TableRow key={lot.id}>
                  <TableCell className="font-medium">{lot.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {lot.location}
                    </div>
                  </TableCell>
                  <TableCell>{lot.capacity}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          {lot.currentOccupancy}/{lot.capacity}
                        </span>
                        <span>{Math.round(getOccupancyPercentage(lot.currentOccupancy, lot.capacity))}%</span>
                      </div>
                      <Progress value={getOccupancyPercentage(lot.currentOccupancy, lot.capacity)} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    {lot.contractorName ? (
                      <Badge variant="outline">{lot.contractorName}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(lot.status)}>{lot.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditLot(lot)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteLot(lot.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLot ? "Edit Parking Lot" : "Add New Parking Lot"}</DialogTitle>
            <DialogDescription>
              {editingLot ? "Update parking lot information" : "Enter parking lot details to add it to the system"}
            </DialogDescription>
          </DialogHeader>
          <form action={handleSaveLot}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" name="name" defaultValue={editingLot?.name || ""} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={editingLot?.location || ""}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">
                  Capacity
                </Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  defaultValue={editingLot?.capacity || ""}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contractorId" className="text-right">
                  Contractor
                </Label>
                <Select name="contractorId" defaultValue={editingLot?.contractorId || "unassigned"}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select contractor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {mockContractors.map((contractor) => (
                      <SelectItem key={contractor.id} value={contractor.id}>
                        {contractor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select name="status" defaultValue={editingLot?.status || "active"}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{editingLot ? "Update" : "Add"} Parking Lot</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

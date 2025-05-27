"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download } from "lucide-react"
import { mockVehicleLogs, mockParkingLots, mockContractors } from "../lib/mock-data"
import type { VehicleLog } from "../lib/types"

export function VehicleLogs() {
  const [logs, setLogs] = useState<VehicleLog[]>(mockVehicleLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLot, setSelectedLot] = useState<string>("all")
  const [selectedContractor, setSelectedContractor] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLot = selectedLot === "all" || log.parkingLotId === selectedLot
    const matchesContractor = selectedContractor === "all" || log.contractorName === selectedContractor
    const matchesStatus = selectedStatus === "all" || log.status === selectedStatus

    return matchesSearch && matchesLot && matchesContractor && matchesStatus
  })

  const handleExport = () => {
    // In a real app, this would generate and download a CSV/Excel file
    console.log("Exporting vehicle logs...")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vehicle Logs</h1>
          <p className="text-muted-foreground">View entry/exit logs for all vehicles</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Entry/Exit Logs</CardTitle>
          <CardDescription>Filter and view vehicle parking logs</CardDescription>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by vehicle number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>

            <Select value={selectedLot} onValueChange={setSelectedLot}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by parking lot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Parking Lots</SelectItem>
                {mockParkingLots.map((lot) => (
                  <SelectItem key={lot.id} value={lot.id}>
                    {lot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedContractor} onValueChange={setSelectedContractor}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by contractor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contractors</SelectItem>
                {mockContractors.map((contractor) => (
                  <SelectItem key={contractor.id} value={contractor.name}>
                    {contractor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="parked">Parked</SelectItem>
                <SelectItem value="exited">Exited</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle Number</TableHead>
                <TableHead>Parking Lot</TableHead>
                <TableHead>Contractor</TableHead>
                <TableHead>Entry Time</TableHead>
                <TableHead>Exit Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.vehicleNumber}</TableCell>
                  <TableCell>{log.parkingLotName}</TableCell>
                  <TableCell>{log.contractorName}</TableCell>
                  <TableCell>{new Date(log.entryTime).toLocaleString()}</TableCell>
                  <TableCell>{log.exitTime ? new Date(log.exitTime).toLocaleString() : "-"}</TableCell>
                  <TableCell>{log.duration || "-"}</TableCell>
                  <TableCell>${log.fee.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={log.status === "parked" ? "default" : "secondary"}>{log.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No vehicle logs found matching your filters.</div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLogs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Currently Parked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLogs.filter((log) => log.status === "parked").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${filteredLogs.reduce((sum, log) => sum + log.fee, 0).toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

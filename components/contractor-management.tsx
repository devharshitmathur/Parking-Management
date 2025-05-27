"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { mockContractors, mockParkingLots } from "../lib/mock-data";
import type { Contractor } from "../lib/types";

export function ContractorManagement() {
  const [contractors, setContractors] = useState<Contractor[]>(mockContractors);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(
    null
  );

  const filteredContractors = contractors.filter(
    (contractor) =>
      contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddContractor = () => {
    setEditingContractor(null);
    setIsDialogOpen(true);
  };

  const handleEditContractor = (contractor: Contractor) => {
    setEditingContractor(contractor);
    setIsDialogOpen(true);
  };

  const handleDeleteContractor = (id: string) => {
    setContractors(contractors.filter((c) => c.id !== id));
  };

  const handleSaveContractor = (formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const status = formData.get("status") as "active" | "inactive";

    if (editingContractor) {
      setContractors(
        contractors.map((c) =>
          c.id === editingContractor.id
            ? { ...c, name, email, phone, status }
            : c
        )
      );
    } else {
      const newContractor: Contractor = {
        id: null,
        name,
        email,
        phone,
        assignedLots: [],
        status,
      };
      setContractors([...contractors, newContractor]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contractor Management</h1>
          <p className="text-muted-foreground">
            Manage contractors and their assigned parking lots
          </p>
        </div>
        <Button onClick={handleAddContractor}>
          <Plus className="h-4 w-4 mr-2" />
          Add Contractor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contractors</CardTitle>
          <CardDescription>
            View and manage all contractors in the system
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contractors..."
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
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Assigned Lots</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContractors.map((contractor) => (
                <TableRow key={contractor.id}>
                  <TableCell className="font-medium">
                    {contractor.name}
                  </TableCell>
                  <TableCell>{contractor.email}</TableCell>
                  <TableCell>{contractor.phone}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {contractor.assignedLots.map((lotId) => {
                        const lot = mockParkingLots.find((l) => l.id === lotId);
                        return lot ? (
                          <Badge
                            key={lotId}
                            variant="secondary"
                            className="text-xs"
                          >
                            {lot.name}
                          </Badge>
                        ) : null;
                      })}
                      {contractor.assignedLots.length === 0 && (
                        <span className="text-muted-foreground text-sm">
                          No lots assigned
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        contractor.status === "active" ? "default" : "secondary"
                      }
                    >
                      {contractor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{contractor.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditContractor(contractor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteContractor(contractor.id)}
                      >
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
            <DialogTitle>
              {editingContractor ? "Edit Contractor" : "Add New Contractor"}
            </DialogTitle>
            <DialogDescription>
              {editingContractor
                ? "Update contractor information"
                : "Enter contractor details to add them to the system"}
            </DialogDescription>
          </DialogHeader>
          <form action={handleSaveContractor}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingContractor?.name || ""}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={editingContractor?.email || ""}
                  className="col-span-3"
                  required
                />
              </div>
              {!editingContractor && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    defaultValue={""}
                    className="col-span-3"
                    required
                  />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={editingContractor?.phone || ""}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  name="status"
                  defaultValue={editingContractor?.status || "active"}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {editingContractor ? "Update" : "Add"} Contractor
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

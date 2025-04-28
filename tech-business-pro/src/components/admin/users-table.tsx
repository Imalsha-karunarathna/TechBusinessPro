"use client";

import { updateUserRole, updateUserStatus } from "@/app/actions/users";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle,
  MoreHorizontal,
  ShieldAlert,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface UsersTableProps {
  users: any[];
}

export function UsersTable({ users }: UsersTableProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (userId: number, isActive: boolean) => {
    setIsUpdating(true);
    try {
      const result = await updateUserStatus(userId, isActive);
      if (result.success) {
        toast({
          title: "Status Updated",
          description: `User has been ${
            isActive ? "activated" : "deactivated"
          }.`,
        });
        // Force a refresh to show the updated data
        window.location.reload();
      } else {
        throw new Error(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the user status.",
        //variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRoleChange = async (userId: number, role: string) => {
    setIsUpdating(true);
    try {
      const result = await updateUserRole(userId, role);
      if (result.success) {
        toast({
          title: "Role Updated",
          description: `User role has been changed to ${role.replace(
            "_",
            " "
          )}.`,
        });
        // Force a refresh to show the updated data
        window.location.reload();
      } else {
        throw new Error(result.error || "Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the user role.",
        //variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <ShieldAlert className="h-4 w-4 text-red-500" />;
      case "solution_provider":
        return <ShieldCheck className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-6 text-muted-foreground"
              >
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getRoleIcon(user.role)}
                    <span className="capitalize">
                      {user.role.replace("_", " ")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {user.is_active ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" /> Active
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600">
                      <XCircle className="h-4 w-4 mr-1" /> Inactive
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {user.created_at
                    ? formatDistanceToNow(new Date(user.created_at), {
                        addSuffix: true,
                      })
                    : "Unknown"}
                </TableCell>
                <TableCell>
                  {user.last_login
                    ? formatDistanceToNow(new Date(user.last_login), {
                        addSuffix: true,
                      })
                    : "Never"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={isUpdating}>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {/* Status actions */}
                      {user.is_active ? (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(user.id, false)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Deactivate User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(user.id, true)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Activate User
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />

                      {/* Role actions */}
                      <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(user.id, "admin")}
                        disabled={user.role === "admin"}
                      >
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleRoleChange(user.id, "solution_provider")
                        }
                        disabled={user.role === "solution_provider"}
                      >
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Make Solution Provider
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleRoleChange(user.id, "solution_seeker")
                        }
                        disabled={user.role === "solution_seeker"}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Make Solution Seeker
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

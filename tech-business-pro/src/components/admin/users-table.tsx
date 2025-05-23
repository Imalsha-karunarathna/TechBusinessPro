'use client';

import { updateUserStatus } from '@/app/actions/users';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import {
  CheckCircle,
  MoreHorizontal,
  ShieldAlert,
  ShieldCheck,
  User,
  XCircle,
  Clock,
  Mail,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface UsersTableProps {
  /*eslint-disable @typescript-eslint/no-explicit-any */
  users: any[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (userId: number, isActive: boolean) => {
    setIsUpdating(true);
    try {
      const result = await updateUserStatus(userId, isActive);
      if (result.success) {
        toast('Status Updated', {
          description: `User has been ${isActive ? 'activated' : 'deactivated'}.`,
        });
        // Force a refresh to show the updated data
        window.location.reload();
      } else {
        throw new Error(result.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast('Update Failed', {
        description: 'There was an error updating the user status.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // const handleRoleChange = async (userId: number, role: string) => {
  //   setIsUpdating(true);
  //   try {
  //     const result = await updateUserRole(userId, role);
  //     if (result.success) {
  //       toast('Role Updated', {
  //         description: `User role has been changed to ${role.replace('_', ' ')}.`,
  //       });
  //       // Force a refresh to show the updated data
  //       window.location.reload();
  //     } else {
  //       throw new Error(result.error || 'Failed to update role');
  //     }
  //   } catch (error) {
  //     console.error('Error updating role:', error);
  //     toast('Update Failed', {
  //       description: 'There was an error updating the user role.',
  //     });
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge className="bg-[#3069FE]/10 text-[#3069FE] border border-[#3069FE]/30 px-2 py-0.5 rounded-full">
            <ShieldAlert className="h-3.5 w-3.5 mr-1 inline" />
            Admin
          </Badge>
        );
      case 'solution_provider':
        return (
          <Badge className="bg-[#42C3EE]/10 text-[#42C3EE] border border-[#42C3EE]/30 px-2 py-0.5 rounded-full">
            <ShieldCheck className="h-3.5 w-3.5 mr-1 inline" />
            Solution Provider
          </Badge>
        );
      case 'agent':
        return (
          <Badge className="bg-[#42C3EE]/10 text-[#42C3EE] border border-[#42C3EE]/30 px-2 py-0.5 rounded-full">
            <ShieldCheck className="h-3.5 w-3.5 mr-1 inline" />
            Agent
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded-full">
            <User className="h-3.5 w-3.5 mr-1 inline" />
            Solution Seeker
          </Badge>
        );
    }
  };

  return (
    <div className="rounded-md border border-[#42C3EE]/20 shadow-md hover:shadow-lg hover:shadow-[#3069FE]/10 transition-all duration-300">
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader className="bg-gradient-to-r from-[#3069FE]/5 to-[#42C3EE]/5">
            <TableRow>
              <TableHead className="font-medium text-[#3069FE]">
                Username
              </TableHead>
              <TableHead className="font-medium text-[#3069FE]">Name</TableHead>
              <TableHead className="font-medium text-[#3069FE]">
                Email
              </TableHead>
              <TableHead className="font-medium text-[#3069FE]">Role</TableHead>
              <TableHead className="font-medium text-[#3069FE]">
                Status
              </TableHead>
              <TableHead className="font-medium text-[#3069FE]">
                Registered
              </TableHead>
              {/* <TableHead className="font-medium text-[#3069FE]">
              Last Login
            </TableHead> */}
              <TableHead className="text-right font-medium text-[#3069FE]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-10 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <User className="h-10 w-10 text-[#42C3EE]/40" />
                    <p className="text-lg font-medium text-gray-500">
                      No users found
                    </p>
                    <p className="text-sm text-gray-400">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-gradient-to-r hover:from-[#3069FE]/5 hover:to-[#42C3EE]/5 transition-colors"
                >
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#3069FE]/20 to-[#42C3EE]/20 flex items-center justify-center">
                        <span className="text-[#3069FE] font-medium">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className="inline-flex items-center max-w-[200px]"
                      title={user.email}
                    >
                      <Mail className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-[#42C3EE]" />
                      <span className="truncate select-text">{user.email}</span>
                    </div>
                  </TableCell>

                  <TableCell>{getRoleBadge(user.role)}</TableCell>
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
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-[#42C3EE]" />
                      {user.created_at
                        ? formatDistanceToNow(new Date(user.created_at), {
                            addSuffix: true,
                          })
                        : 'Unknown'}
                    </div>
                  </TableCell>
                  {/* <TableCell>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-3.5 w-3.5 mr-1.5 text-[#42C3EE]" />
                    {user.last_login
                      ? formatDistanceToNow(new Date(user.last_login), {
                          addSuffix: true,
                        })
                      : 'Never'}
                  </div>
                </TableCell> */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isUpdating}
                          className="hover:bg-[#3069FE]/10 hover:text-[#3069FE]"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-gradient-to-br from-gray-900 to-[#3069FE]/90 text-white border border-[#42C3EE]/30 rounded-lg shadow-lg"
                      >
                        <DropdownMenuLabel className="text-l">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-700" />

                        {/* Status actions */}
                        {user.is_active ? (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(user.id, false)}
                            className="hover:bg-red-500/20 cursor-pointer"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Deactivate User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(user.id, true)}
                            className="hover:bg-green-500/20 cursor-pointer"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Activate User
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator className="bg-gray-700" />

                        {/* Role actions */}
                        {/* <DropdownMenuLabel>Change Role</DropdownMenuLabel> */}
                        {/* <DropdownMenuItem
                        onClick={() => handleRoleChange(user.id, 'admin')}
                        disabled={user.role === 'admin'}
                        className={`${user.role !== 'admin' ? 'hover:bg-[#3069FE]/20 cursor-pointer' : 'opacity-50'}`}
                      >
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Make Admin
                      </DropdownMenuItem> */}
                        {/* <DropdownMenuItem
                        onClick={() =>
                          handleRoleChange(user.id, 'solution_provider')
                        }
                        disabled={user.role === 'solution_provider'}
                        className={`${
                          user.role !== 'solution_provider'
                            ? 'hover:bg-[#42C3EE]/20 cursor-pointer'
                            : 'opacity-50'
                        }`}
                      >
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Make Solution Provider
                      </DropdownMenuItem> */}
                        {/* <DropdownMenuItem
                        onClick={() =>
                          handleRoleChange(user.id, 'solution_seeker')
                        }
                        disabled={user.role === 'solution_seeker'}
                        className={`${
                          user.role !== 'solution_seeker'
                            ? 'hover:bg-gray-700 cursor-pointer'
                            : 'opacity-50'
                        }`}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Make Solution Seeker
                      </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import {
  Eye,
  Building,
  User,
  Mail,
  Briefcase,
  Clock,
  FileText,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PartnerApplicationsTableProps {
  /*eslint-disable @typescript-eslint/no-explicit-any */
  applications: any[];
}

export function PartnerApplicationsTable({
  applications,
}: PartnerApplicationsTableProps) {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const openViewDialog = (application: any) => {
    setSelectedApplication(application);
    setIsViewDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-md border border-[#42C3EE]/20 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="w-full overflow-auto">
          <Table>
            <TableHeader className="bg-gradient-to-r from-[#3069FE]/5 to-[#42C3EE]/5">
              <TableRow>
                <TableHead className="font-medium text-[#3069FE]">
                  Organization
                </TableHead>
                <TableHead className="font-medium text-[#3069FE]">
                  Contact
                </TableHead>
                <TableHead className="font-medium text-[#3069FE]">
                  Expertise
                </TableHead>
                <TableHead className="font-medium text-[#3069FE]">
                  Designation
                </TableHead>
                <TableHead className="font-medium text-[#3069FE]">
                  Status
                </TableHead>
                <TableHead className="font-medium text-[#3069FE]">
                  Submitted
                </TableHead>
                <TableHead className="text-right font-medium text-[#3069FE]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Building className="h-10 w-10 text-[#42C3EE]/40" />
                      <p className="text-lg font-medium text-gray-500">
                        No partner applications found
                      </p>
                      <p className="text-sm text-gray-400">
                        Partner applications will appear here once submitted
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((application) => (
                  <TableRow
                    key={application.id}
                    className="hover:bg-gradient-to-r hover:from-[#3069FE]/5 hover:to-[#42C3EE]/5 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-r from-[#3069FE]/20 to-[#42C3EE]/20 flex items-center justify-center">
                          <Building className="h-5 w-5 text-[#3069FE]" />
                        </div>
                        <div className="font-medium">
                          {application.organization_name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="font-medium flex items-center">
                          <User className="h-3.5 w-3.5 mr-1.5 text-[#3069FE]" />
                          {application.partner_name}
                        </div>
                        <div
                          className="text-sm text-muted-foreground flex items-center max-w-[150px]"
                          title={application.email}
                        >
                          <Mail className="h-3.5 w-3.5 mr-1 flex-shrink-0 text-[#42C3EE]" />
                          <span className="truncate">{application.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {Array.isArray(application.expertise) ? (
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {application.expertise.map(
                            (exp: string, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-[#3069FE]/10 text-[#3069FE] border-[#42C3EE]/30 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                              >
                                <Briefcase className="h-3 w-3 mr-1 inline" />
                                {exp}
                              </Badge>
                            ),
                          )}
                        </div>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-[#3069FE]/10 text-[#3069FE] border-[#42C3EE]/30 px-2 py-0.5 rounded-full text-xs font-medium"
                        >
                          <Briefcase className="h-3 w-3 mr-1 inline" />
                          {application.expertise}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <FileText className="h-3.5 w-3.5 mr-1.5 text-[#42C3EE]" />
                        {application.designation}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={application.application_status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-[#42C3EE]" />
                        {application.created_at
                          ? formatDistanceToNow(
                              new Date(application.created_at),
                              {
                                addSuffix: true,
                              },
                            )
                          : 'Unknown'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#3069FE]/20 text-[#3069FE] hover:bg-[#3069FE]/10 transition-colors duration-200"
                        onClick={() => openViewDialog(application)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View Application Dialog */}
      {selectedApplication && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-gray-900 to-[#3069FE]/90 text-white border border-[#42C3EE]/30 rounded-xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center">
                <Building className="h-5 w-5 mr-2 text-[#42C3EE]" />
                Partner Application Details
              </DialogTitle>
              <DialogDescription className="text-gray-300 mt-2">
                Review the details of this partner application
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-[#42C3EE]/20 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-300 mb-1">
                      Organization
                    </div>
                    <div className="text-white flex items-center">
                      <Building className="h-4 w-4 mr-2 text-[#42C3EE]" />
                      {selectedApplication.organization_name}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-300 mb-1">
                      Contact
                    </div>
                    <div className="text-white flex items-center">
                      <User className="h-4 w-4 mr-2 text-[#42C3EE]" />
                      {selectedApplication.partner_name}
                    </div>
                    <div className="text-gray-300 text-sm flex items-center mt-1">
                      <Mail className="h-3.5 w-3.5 mr-1.5 text-[#42C3EE]/70" />
                      {selectedApplication.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-[#42C3EE]/20">
                <div className="text-sm font-medium text-gray-300 mb-2">
                  Expertise Areas
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(selectedApplication.expertise) ? (
                    selectedApplication.expertise.map(
                      (exp: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-[#3069FE]/20 text-white border-[#42C3EE]/30 px-3 py-1"
                        >
                          <Briefcase className="h-3.5 w-3.5 mr-1.5 inline" />
                          {exp}
                        </Badge>
                      ),
                    )
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-[#3069FE]/20 text-white border-[#42C3EE]/30 px-3 py-1"
                    >
                      <Briefcase className="h-3.5 w-3.5 mr-1.5 inline" />
                      {selectedApplication.expertise}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-[#42C3EE]/20">
                  <div className="text-sm font-medium text-gray-300 mb-2">
                    Designation
                  </div>
                  <div className="text-white">
                    {selectedApplication.designation}
                  </div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-[#42C3EE]/20">
                  <div className="text-sm font-medium text-gray-300 mb-2">
                    Status
                  </div>
                  <StatusBadge
                    status={selectedApplication.application_status}
                  />
                </div>
              </div>

              {selectedApplication.description && (
                <div className="bg-gray-800/50 p-4 rounded-lg border border-[#42C3EE]/20">
                  <div className="text-sm font-medium text-gray-300 mb-2">
                    Company Description
                  </div>
                  <div className="text-white">
                    {selectedApplication.description}
                  </div>
                </div>
              )}

              {selectedApplication.reason && (
                <div className="bg-gray-800/50 p-4 rounded-lg border border-[#42C3EE]/20">
                  <div className="text-sm font-medium text-gray-300 mb-2">
                    Reason for Partnership
                  </div>
                  <div className="text-white">{selectedApplication.reason}</div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                Close
              </Button>
              <Link
                href={`/admin/partner-application/${selectedApplication.id}`}
              >
                <Button className="bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:opacity-90 text-white">
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Details
                </Button>
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'pending':
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200 px-2.5 py-0.5 rounded-full"
        >
          <Clock className="h-3.5 w-3.5 mr-1.5 inline" />
          Pending
        </Badge>
      );
    case 'approved':
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200 px-2.5 py-0.5 rounded-full"
        >
          <Eye className="h-3.5 w-3.5 mr-1.5 inline" />
          Approved
        </Badge>
      );
    case 'rejected':
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 px-2.5 py-0.5 rounded-full"
        >
          <Eye className="h-3.5 w-3.5 mr-1.5 inline" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="px-2.5 py-0.5 rounded-full">
          <Eye className="h-3.5 w-3.5 mr-1.5 inline" />
          {status}
        </Badge>
      );
  }
}

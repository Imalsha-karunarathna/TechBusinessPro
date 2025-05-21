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
import { Check, X, Loader2, Award, User, Mail, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { updateExpertiseStatus } from '@/app/actions/expertise-actions';
import { useRouter } from 'next/navigation';
import type { ExpertiseRequest } from '@/lib/types';
import { toast } from 'sonner';

interface ExpertiseRequestsTableProps {
  requests: ExpertiseRequest[];
}

export function ExpertiseRequestsTable({
  requests,
}: ExpertiseRequestsTableProps) {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<ExpertiseRequest | null>(null);
  const [selectedAction, setSelectedAction] = useState<
    'approved' | 'rejected' | null
  >(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const openReviewDialog = (
    request: ExpertiseRequest,
    action: 'approved' | 'rejected',
  ) => {
    setSelectedRequest(request);
    setSelectedAction(action);
    setReviewNotes('');
    setIsReviewDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequest || !selectedAction) return;

    setIsSubmitting(true);
    try {
      const result = await updateExpertiseStatus(
        selectedRequest.id,
        selectedAction,
        reviewNotes,
      );

      if (result.success) {
        toast(
          `Expertise ${selectedAction === 'approved' ? 'Approved' : 'Rejected'}`,
          {
            description: `The expertise request has been ${selectedAction === 'approved' ? 'approved' : 'rejected'}.`,
          },
        );
        setIsReviewDialogOpen(false);

        // Refresh the page to update the list
        router.refresh();
      } else {
        throw new Error(
          result.error || `Failed to ${selectedAction} expertise`,
        );
      }
    } catch (error) {
      console.error(`Error ${selectedAction}ing expertise:`, error);
      toast('Error', {
        description: `There was an error ${selectedAction}ing the expertise. Please try again.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="rounded-md border border-[#42C3EE]/20 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
        <Table>
          <TableHeader className="bg-gradient-to-r from-[#3069FE]/5 to-[#42C3EE]/5">
            <TableRow>
              <TableHead className="font-medium text-[#3069FE]">
                Provider
              </TableHead>
              <TableHead className="font-medium text-[#3069FE]">
                Expertise
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
            {requests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Award className="h-10 w-10 text-[#42C3EE]/40" />
                    <p className="text-lg font-medium text-gray-500">
                      No pending expertise requests
                    </p>
                    <p className="text-sm text-gray-400">
                      All expertise requests have been processed
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow
                  key={request.id}
                  className="hover:bg-gradient-to-r hover:from-[#3069FE]/5 hover:to-[#42C3EE]/5 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-r from-[#3069FE]/20 to-[#42C3EE]/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-[#3069FE]" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {request.provider.name}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Mail className="h-3.5 w-3.5 mr-1 text-[#42C3EE]" />
                          {request.provider.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-[#3069FE]/10 text-[#3069FE] border-[#42C3EE]/30 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      <Award className="h-3.5 w-3.5 mr-1.5 inline" />
                      {request.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-[#42C3EE]" />
                      {formatDistanceToNow(new Date(request.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-700 hover:bg-red-50 transition-colors duration-200"
                        onClick={() => openReviewDialog(request, 'rejected')}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:opacity-90 transition-all duration-200 text-white border-none"
                        onClick={() => openReviewDialog(request, 'approved')}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-gray-900 to-[#3069FE]/90 text-white border border-[#42C3EE]/30 rounded-xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center">
              {selectedAction === 'approved' ? (
                <Check className="h-5 w-5 mr-2 text-green-400" />
              ) : (
                <X className="h-5 w-5 mr-2 text-red-400" />
              )}
              {selectedAction === 'approved' ? 'Approve' : 'Reject'} Expertise
              Request
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-2">
              {selectedAction === 'approved'
                ? "This expertise will be added to the provider's profile."
                : 'Please provide a reason for rejecting this expertise request.'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-[#42C3EE]/20 space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-300 mb-1">
                  Provider
                </div>
                <div className="text-white flex items-center">
                  <User className="h-4 w-4 mr-2 text-[#42C3EE]" />
                  {selectedRequest?.provider?.name}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-300 mb-1">
                  Expertise
                </div>
                <div className="text-white flex items-center">
                  <Award className="h-4 w-4 mr-2 text-[#42C3EE]" />
                  {selectedRequest?.name}
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="review-notes"
                className="text-sm font-medium mb-2  text-gray-300 flex items-center"
              >
                Review Notes{' '}
                {selectedAction === 'rejected' && (
                  <span className="text-red-400 ml-1">(Required)</span>
                )}
              </label>
              <Textarea
                id="review-notes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter your review notes here..."
                rows={4}
                className="bg-gray-800 border-[#42C3EE]/30 text-white focus:ring-[#42C3EE]/30 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
              disabled={isSubmitting}
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={
                isSubmitting ||
                (selectedAction === 'rejected' && !reviewNotes.trim())
              }
              className={
                selectedAction === 'approved'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 text-white'
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90 text-white'
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : selectedAction === 'approved' ? (
                'Approve'
              ) : (
                'Reject'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

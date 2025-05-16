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
import { Check, X, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { updateExpertiseStatus } from '@/app/actions/expertise-actions';
import { useRouter } from 'next/navigation';
import { ExpertiseRequest } from '@/lib/types';

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
  const { toast } = useToast();
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
        toast({
          title: `Expertise ${selectedAction === 'approved' ? 'Approved' : 'Rejected'}`,
          description: `The expertise request has been ${selectedAction === 'approved' ? 'approved' : 'rejected'}.`,
        });
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
      toast({
        title: 'Error',
        description: `There was an error ${selectedAction}ing the expertise. Please try again.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Expertise</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-muted-foreground"
                >
                  No pending expertise requests
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="font-medium">{request.provider.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {request.provider.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {request.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(request.created_at), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => openReviewDialog(request, 'rejected')}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
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
        <DialogContent className="sm:max-w-[500px] bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>
              {selectedAction === 'approved' ? 'Approve' : 'Reject'} Expertise
              Request
            </DialogTitle>
            <DialogDescription>
              {selectedAction === 'approved'
                ? "This expertise will be added to the provider's profile."
                : 'Please provide a reason for rejecting this expertise request.'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">Provider</div>
              <div>{selectedRequest?.provider?.name}</div>
            </div>
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">Expertise</div>
              <div>{selectedRequest?.name}</div>
            </div>
            <div>
              <label
                htmlFor="review-notes"
                className="text-sm font-medium mb-2 block"
              >
                Review Notes {selectedAction === 'rejected' && '(Required)'}
              </label>
              <Textarea
                id="review-notes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter your review notes here..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
              disabled={isSubmitting}
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
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
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

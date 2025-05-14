'use client';

import { updateApplicationStatus } from '@/app/actions/partner-applications';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PartnerApplicationDetailProps {
  /*eslint-disable @typescript-eslint/no-explicit-any */
  application: any;
}

export function PartnerApplicationDetail({
  application,
}: PartnerApplicationDetailProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [reviewNotes, setReviewNotes] = useState(
    application.review_notes || '',
  );
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    'approved' | 'rejected' | null
  >(null);

  const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
    setIsUpdating(true);
    try {
      const result = await updateApplicationStatus(
        application.id,
        status,
        reviewNotes,
      );

      if (result.success) {
        toast({
          title: 'Status Updated',
          description: `Application has been ${status}.`,
        });
        setIsReviewDialogOpen(false);

        // Force a refresh of the current page data
        router.refresh();

        // Redirect to the appropriate tab after a short delay
        setTimeout(() => {
          // Use router.push with { forceOptimisticNavigation: true } to force a fresh fetch
          router.push(`/admin/partner-application?status=${status}`);
        }, 1000);
      } else {
        throw new Error(result.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Update Failed',
        description: 'There was an error updating the application status.',
        //variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const openReviewDialog = (status: 'approved' | 'rejected') => {
    setSelectedStatus(status);
    setIsReviewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
          <CardDescription>
            Submitted{' '}
            {application.created_at
              ? formatDistanceToNow(new Date(application.created_at), {
                  addSuffix: true,
                })
              : 'Unknown'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Organization
              </h3>
              <p className="text-lg font-medium">
                {application.organization_name}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Contact Person
              </h3>
              <p className="text-lg font-medium">{application.partner_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Email
              </h3>
              <p>{application.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Phone
              </h3>
              <p>{application.phone || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Website
              </h3>
              <p>
                {application.website ? (
                  <a
                    href={application.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {application.website}
                  </a>
                ) : (
                  'Not provided'
                )}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Years of Experience
              </h3>
              <p>{application.experience_years || 'Not specified'}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Area of Expertise
            </h3>
            <p>{application.expertise}</p>
          </div>

          {/* <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Proposed Collaboration
            </h3>
            <p className="whitespace-pre-line">{application.collaboration}</p>
          </div> */}

          {application.reason && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Why Partner with Us
              </h3>
              <p className="whitespace-pre-line">{application.reason}</p>
            </div>
          )}

          {application.additional_notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Additional Notes
              </h3>
              <p className="whitespace-pre-line">
                {application.additional_notes}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="flex items-center">
            <div className="mr-4">
              <span className="text-sm font-medium text-muted-foreground">
                Status:
              </span>{' '}
              <span
                className={`font-medium ${
                  application.application_status === 'approved'
                    ? 'text-green-600'
                    : application.application_status === 'rejected'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                }`}
              >
                {application.application_status.charAt(0).toUpperCase() +
                  application.application_status.slice(1)}
              </span>
            </div>

            {application.reviewer_id && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Reviewed by:
                </span>{' '}
                <span className="font-medium">
                  {application.reviewer?.name || 'Unknown'}
                </span>
              </div>
            )}
          </div>

          {application.application_status === 'pending' && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50"
                onClick={() => openReviewDialog('rejected')}
              >
                Reject
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => openReviewDialog('approved')}
              >
                Approve
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      {application.review_notes && (
        <Card>
          <CardHeader>
            <CardTitle>Review Notes</CardTitle>
            <CardDescription>
              Added{' '}
              {application.reviewed_at
                ? formatDistanceToNow(new Date(application.reviewed_at), {
                    addSuffix: true,
                  })
                : 'Unknown'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{application.review_notes}</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedStatus === 'approved' ? 'Approve' : 'Reject'} Application
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedStatus === 'approved'
                ? 'The applicant will be notified that their application has been approved.'
                : 'Please provide a reason for rejecting this application.'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label
              htmlFor="review-notes"
              className="text-sm font-medium mb-2 block text-gray-200"
            >
              Review Notes {selectedStatus === 'rejected' && '(Required)'}
            </label>
            <Textarea
              id="review-notes"
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Enter your review notes here..."
              rows={4}
              className="text-gray-400"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleStatusUpdate(selectedStatus!)}
              disabled={
                isUpdating ||
                (selectedStatus === 'rejected' && !reviewNotes.trim())
              }
              className={
                selectedStatus === 'approved'
                  ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
                  : 'bg-red-600 hover:bg-red-700 cursor-pointer'
              }
            >
              {isUpdating
                ? 'Processing...'
                : selectedStatus === 'approved'
                  ? 'Approve'
                  : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

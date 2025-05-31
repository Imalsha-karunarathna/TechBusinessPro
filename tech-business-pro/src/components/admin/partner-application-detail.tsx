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
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Building,
  User,
  Mail,
  Phone,
  Globe,
  Clock,
  Award,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';

interface PartnerApplicationDetailProps {
  /*eslint-disable @typescript-eslint/no-explicit-any */
  application: any;
}

export function PartnerApplicationDetail({
  application,
}: PartnerApplicationDetailProps) {
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
        toast('Status Updated', {
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
      toast('Update Failed', {
        description: 'There was an error updating the application status.',
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
      <Card className="border border-[#42C3EE]/20 shadow-md hover:shadow-lg hover:shadow-[#3069FE]/10 transition-all duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#3069FE]/5 to-[#42C3EE]/5 border-b border-[#42C3EE]/20">
          <CardTitle className="text-xl font-bold text-[#3069FE] flex items-center">
            <FileText className="h-5 w-5 mr-2 text-[#42C3EE]" />
            Application Details
          </CardTitle>
          <CardDescription className="flex items-center">
            <Clock className="h-4 w-4 mr-1.5 text-[#42C3EE]" />
            Submitted{' '}
            {application.created_at
              ? formatDistanceToNow(new Date(application.created_at), {
                  addSuffix: true,
                })
              : 'Unknown'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-[#3069FE]/5 to-[#42C3EE]/5 p-4 rounded-lg border border-[#42C3EE]/20">
              <h3 className="text-sm font-medium text-[#3069FE] mb-2 flex items-center">
                <Building className="h-4 w-4 mr-1.5 text-[#42C3EE]" />
                Organization
              </h3>
              <p className="text-lg font-medium">
                {application.organization_name}
              </p>
            </div>
            <div className="bg-gradient-to-r from-[#3069FE]/5 to-[#42C3EE]/5 p-4 rounded-lg border border-[#42C3EE]/20">
              <h3 className="text-sm font-medium text-[#3069FE] mb-2 flex items-center">
                <User className="h-4 w-4 mr-1.5 text-[#42C3EE]" />
                Contact Person
              </h3>
              <p className="text-lg font-medium">{application.partner_name}</p>
            </div>
            <div className="p-4 rounded-lg border border-[#42C3EE]/20">
              <h3 className="text-sm font-medium text-[#3069FE] mb-2 flex items-center">
                <Mail className="h-4 w-4 mr-1.5 text-[#42C3EE]" />
                Email
              </h3>
              <p>{application.email}</p>
            </div>
            <div className="p-4 rounded-lg border border-[#42C3EE]/20">
              <h3 className="text-sm font-medium text-[#3069FE] mb-2 flex items-center">
                <Phone className="h-4 w-4 mr-1.5 text-[#42C3EE]" />
                Phone
              </h3>
              <p>{application.phone || 'Not provided'}</p>
            </div>
            <div className="p-4 rounded-lg border border-[#42C3EE]/20">
              <h3 className="text-sm font-medium text-[#3069FE] mb-2 flex items-center">
                <Globe className="h-4 w-4 mr-1.5 text-[#42C3EE]" />
                Website
              </h3>
              <p>
                {application.website ? (
                  <a
                    href={application.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3069FE] hover:underline flex items-center"
                  >
                    {application.website}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-1"
                    >
                      <path d="M7 7h10v10" />
                      <path d="M7 17 17 7" />
                    </svg>
                  </a>
                ) : (
                  'Not provided'
                )}
              </p>
            </div>
            <div className="p-4 rounded-lg border border-[#42C3EE]/20">
              <h3 className="text-sm font-medium text-[#3069FE] mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-1.5 text-[#42C3EE]" />
                Years of Experience
              </h3>
              <p>{application.experience_years || 'Not specified'}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-[#42C3EE]/20">
            <h3 className="text-sm font-medium text-[#3069FE] mb-2 flex items-center">
              <Award className="h-4 w-4 mr-1.5 text-[#42C3EE]" />
              Area of Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(application.expertise) &&
                application.expertise.map((item: string, index: number) => (
                  <p
                    key={index}
                    className="bg-[#3069FE]/10 text-[#3069FE] px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {item}
                  </p>
                ))}
            </div>
          </div>

          {application.reason && (
            <div className="p-4 rounded-lg border border-[#42C3EE]/20">
              <h3 className="text-sm font-medium text-[#3069FE] mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-1.5 text-[#42C3EE]" />
                Why Partner with Us
              </h3>
              <p className="whitespace-pre-line">{application.reason}</p>
            </div>
          )}

          {application.additional_notes && (
            <div className="p-4 rounded-lg border border-[#42C3EE]/20">
              <h3 className="text-sm font-medium text-[#3069FE] mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-1.5 text-[#42C3EE]" />
                Additional Notes
              </h3>
              <p className="whitespace-pre-line">
                {application.additional_notes}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-[#42C3EE]/20 pt-6 px-6 pb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-500 mr-2">
                Status:
              </span>
              <span
                className={`font-medium flex items-center ${
                  application.application_status === 'approved'
                    ? 'text-green-600'
                    : application.application_status === 'rejected'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                }`}
              >
                {application.application_status === 'approved' ? (
                  <CheckCircle className="h-4 w-4 mr-1" />
                ) : application.application_status === 'rejected' ? (
                  <XCircle className="h-4 w-4 mr-1" />
                ) : (
                  <Clock className="h-4 w-4 mr-1" />
                )}
                {application.application_status.charAt(0).toUpperCase() +
                  application.application_status.slice(1)}
              </span>
            </div>

            {application.reviewer_id && (
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 mr-2">
                  Reviewed by:
                </span>
                <span className="font-medium flex items-center">
                  <User className="h-4 w-4 mr-1 text-[#42C3EE]" />
                  {application.reviewer?.name || 'Unknown'}
                </span>
              </div>
            )}
          </div>

          {application.application_status === 'pending' && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50 transition-colors duration-200"
                onClick={() => openReviewDialog('rejected')}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                className="bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:opacity-90 transition-all duration-200 text-white border-none"
                onClick={() => openReviewDialog('approved')}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      {application.review_notes && (
        <Card className="border border-[#42C3EE]/20 shadow-md">
          <CardHeader className="bg-gradient-to-r from-[#3069FE]/5 to-[#42C3EE]/5 border-b border-[#42C3EE]/20">
            <CardTitle className="text-lg font-bold text-[#3069FE] flex items-center">
              <FileText className="h-5 w-5 mr-2 text-[#42C3EE]" />
              Review Notes
            </CardTitle>
            <CardDescription className="flex items-center">
              <Clock className="h-4 w-4 mr-1.5 text-[#42C3EE]" />
              Added{' '}
              {application.reviewed_at
                ? formatDistanceToNow(new Date(application.reviewed_at), {
                    addSuffix: true,
                  })
                : 'Unknown'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <p className="whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-[#42C3EE]/10">
              {application.review_notes}
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-gray-900 to-[#3069FE]/90 text-white border border-[#42C3EE]/30 rounded-xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center">
              {selectedStatus === 'approved' ? (
                <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 mr-2 text-red-400" />
              )}
              {selectedStatus === 'approved' ? 'Approve' : 'Reject'} Application
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-2">
              {selectedStatus === 'approved'
                ? 'The applicant will be notified that their application has been approved.'
                : 'Please provide a reason for rejecting this application.'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label
              htmlFor="review-notes"
              className="text-sm font-medium mb-2  text-gray-200 flex items-center"
            >
              Review Notes{' '}
              {selectedStatus === 'rejected' && (
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

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
              className="border-gray-600 text-white hover:bg-gray-800"
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
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 text-white'
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90 text-white'
              }
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : selectedStatus === 'approved' ? (
                'Approve'
              ) : (
                'Reject'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

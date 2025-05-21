'use client';

import { useState, useEffect } from 'react';
import {
  getContactRequestsForProvider,
  updateContactRequestStatus,
  markRequestAsRead,
} from '@/app/actions/contact-provider-action';
import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Building,
  DollarSign,
  FileText,
  User,
  XCircle,
  Inbox,
} from 'lucide-react';
import { format } from 'date-fns';
import type { ContactRequest } from '@/lib/types';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface ProviderContactRequestsProps {
  providerId?: number;
  providerName?: string; // Make providerId optional for admin view
}

export function ProviderContactRequests({
  providerId,
}: ProviderContactRequestsProps) {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      try {
        // If providerId is provided, fetch requests for that provider
        // Otherwise, fetch all requests (admin view)
        let result;
        if (providerId) {
          result = await getContactRequestsForProvider(providerId);
        } else {
          // For admin view, fetch all contact requests
          // You'll need to create a new server action for this
          result = await getAllContactRequests();
        }

        if (result.success) {
          setRequests((result.data as ContactRequest[]) || []);
        } else {
          toast('Error', {
            description: result.error || 'Failed to load contact requests',
          });
        }
        /* eslint-disable @typescript-eslint/no-unused-vars */
      } catch (error) {
        toast('Error', {
          description: 'An unexpected error occurred',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();

    // Set up polling to refresh data every minute
    const interval = setInterval(() => fetchRequests(), 60000);
    return () => clearInterval(interval);
  }, [providerId, toast]);

  // Function to fetch all contact requests (for admin)
  async function getAllContactRequests() {
    try {
      // This is a client component, so we need to call a server action
      // Let's assume you have a server action to get all contact requests
      const response = await fetch('/api/admin/contact-request');
      const data = await response.json();

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching all contact requests:', error);
      return {
        success: false,
        error: 'Failed to fetch contact requests',
        data: [],
      };
    }
  }

  const handleViewRequest = async (request: ContactRequest) => {
    setSelectedRequest(request);
    setNotes(request.notes || '');
    setIsDialogOpen(true);

    // Mark as read if it's unread
    if (!request.read) {
      try {
        await markRequestAsRead(request.id!);
        // Update local state
        setRequests(
          requests.map((req) =>
            req.id === request.id ? { ...req, read: true } : req,
          ),
        );
      } catch (error) {
        console.error('Failed to mark request as read:', error);
      }
    }
  };

  const handleUpdateStatus = async (
    status: 'pending' | 'contacted' | 'completed' | 'rejected',
  ) => {
    if (!selectedRequest) return;

    setStatusUpdateLoading(true);
    try {
      const result = await updateContactRequestStatus(
        selectedRequest.id!,
        status,
        notes,
      );
      if (result.success) {
        // Update the local state
        setRequests(
          requests.map((req) =>
            req.id === selectedRequest.id ? { ...req, status, notes } : req,
          ),
        );

        toast('Status updated', {
          description: `Request status updated to ${status}`,
        });

        setIsDialogOpen(false);
      } else {
        toast('Error', {
          description: result.error || 'Failed to update status',
        });
      }
      /* eslint-disable @typescript-eslint/no-unused-vars */
    } catch (error) {
      toast('Error', {
        description: 'An unexpected error occurred',
      });
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1 px-2.5 py-1"
          >
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'contacted':
        return (
          <Badge
            variant="outline"
            className="bg-[#3069FE]/10 text-[#3069FE] border-[#42C3EE]/30 flex items-center gap-1 px-2.5 py-1"
          >
            <Phone className="h-3 w-3" />
            Contacted
          </Badge>
        );
      case 'completed':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1 px-2.5 py-1"
          >
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      case 'rejected':
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1 px-2.5 py-1"
          >
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Low
          </Badge>
        );
      case 'medium':
        return (
          <Badge
            variant="outline"
            className="bg-[#3069FE]/10 text-[#3069FE] border-[#42C3EE]/30"
          >
            Medium
          </Badge>
        );
      case 'high':
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            High
          </Badge>
        );
      default:
        return <Badge variant="outline">{urgency}</Badge>;
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (activeTab === 'all') return true;
    return req.status === activeTab;
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
      /* eslint-disable @typescript-eslint/no-unused-vars */
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#3069FE]" />
        <span className="ml-2 text-[#3069FE] font-medium">
          Loading contact requests...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#42C3EE]/20 pb-5">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#3069FE] to-[#42C3EE] bg-clip-text text-transparent">
            Contact Requests
          </h2>
          <p className="text-muted-foreground mt-2">
            {providerId
              ? 'Manage inquiries from potential clients interested in your solutions'
              : 'Admin view of all contact requests across providers'}
          </p>
        </div>
      </div>

      <Tabs
        defaultValue="pending"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-5 w-full max-w-2xl bg-[#3069FE]/5 p-1 rounded-lg">
          <TabsTrigger
            value="pending"
            className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3069FE] data-[state=active]:to-[#42C3EE] data-[state=active]:text-white rounded-md transition-all duration-200"
          >
            Pending
            {requests.filter((r) => r.status === 'pending' && !r.read).length >
              0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {
                  requests.filter((r) => r.status === 'pending' && !r.read)
                    .length
                }
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="contacted"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3069FE] data-[state=active]:to-[#42C3EE] data-[state=active]:text-white rounded-md transition-all duration-200"
          >
            Contacted
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3069FE] data-[state=active]:to-[#42C3EE] data-[state=active]:text-white rounded-md transition-all duration-200"
          >
            Completed
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3069FE] data-[state=active]:to-[#42C3EE] data-[state=active]:text-white rounded-md transition-all duration-200"
          >
            Rejected
          </TabsTrigger>
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3069FE] data-[state=active]:to-[#42C3EE] data-[state=active]:text-white rounded-md transition-all duration-200"
          >
            All
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-r from-[#3069FE]/5 to-[#42C3EE]/5 rounded-lg border border-[#42C3EE]/20">
              <Inbox className="h-16 w-16 text-[#42C3EE]/40 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-[#3069FE] mb-2">
                No {activeTab} requests
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {activeTab === 'pending'
                  ? 'There are no pending contact requests at the moment.'
                  : `There are no ${activeTab} requests.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request) => (
                <Card
                  key={request.id}
                  className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#3069FE]/10 border ${
                    !request.read
                      ? 'border-l-4 border-l-[#3069FE] bg-gradient-to-r from-[#3069FE]/5 to-transparent'
                      : 'border-[#42C3EE]/20'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-2 border-2 border-[#42C3EE]/20">
                          <AvatarImage
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                              request.seeker_name,
                            )}&background=random`}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-[#3069FE]/20 to-[#42C3EE]/20 text-[#3069FE]">
                            {request.seeker_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {request.seeker_name}
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center">
                            <Mail className="h-3.5 w-3.5 mr-1 text-[#42C3EE]" />
                            {request.seeker_email}
                          </CardDescription>
                        </div>
                      </div>
                      <div>{getStatusBadge(request.status)}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      {/* Show provider info in admin view */}
                      {!providerId && request.provider_name && (
                        <div className="bg-[#3069FE]/5 p-2 rounded-md">
                          <div className="text-xs font-medium text-[#3069FE] mb-1">
                            Provider
                          </div>
                          <p className="text-sm flex items-center">
                            <Building className="h-3.5 w-3.5 mr-1.5 text-[#42C3EE]" />
                            <span className="font-medium">
                              {request.provider_name}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              (ID: {request.provider_id})
                            </span>
                          </p>
                        </div>
                      )}

                      <div>
                        <div className="text-xs font-medium text-[#3069FE] mb-1 flex items-center">
                          <FileText className="h-3.5 w-3.5 mr-1 text-[#42C3EE]" />
                          Requirements
                        </div>
                        <p className="text-sm line-clamp-3 bg-gray-50 p-2 rounded-md">
                          {request.requirements}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <AlertCircle className="h-3.5 w-3.5 mr-1.5 text-[#42C3EE]" />
                          Urgency: {getUrgencyBadge(request.urgency)}
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-[#42C3EE]" />
                          {formatDate(request.preferred_date)}
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Clock className="h-3.5 w-3.5 mr-1.5 text-[#42C3EE]" />
                          {request.preferred_time_slot}
                        </div>
                      </div>

                      {request.company_name && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <Building className="h-3.5 w-3.5 mr-1.5 text-[#42C3EE]" />
                          {request.company_name}
                        </div>
                      )}

                      {request.budget && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <DollarSign className="h-3.5 w-3.5 mr-1.5 text-[#42C3EE]" />
                          {request.budget}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-3 flex justify-between items-center border-t border-[#42C3EE]/10">
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-[#42C3EE]" />
                      {new Date(request.created_at!).toLocaleDateString()}
                      {!request.read && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-[#3069FE]/10 px-2 py-0.5 text-xs font-medium text-[#3069FE]">
                          New
                        </span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewRequest(request)}
                      className="bg-gradient-to-r from-[#3069FE] to-[#42C3EE] text-white border-none hover:opacity-90 transition-all duration-200"
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white border border-[#42C3EE]/20 rounded-xl shadow-xl">
            <DialogHeader className="border-b border-[#42C3EE]/20 pb-4">
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-3 border-2 border-[#42C3EE]/20">
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      selectedRequest.seeker_name,
                    )}&background=random`}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-[#3069FE]/20 to-[#42C3EE]/20 text-[#3069FE]">
                    {selectedRequest.seeker_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-xl font-bold bg-gradient-to-r from-[#3069FE] to-[#42C3EE] bg-clip-text text-transparent">
                    Contact Request from {selectedRequest.seeker_name}
                  </DialogTitle>
                  {!providerId && selectedRequest.provider_name && (
                    <div className="text-sm text-gray-600 mt-1 flex items-center">
                      <Building className="h-3.5 w-3.5 mr-1 text-[#42C3EE]" />
                      Provider: {selectedRequest.provider_name}
                    </div>
                  )}
                  <DialogDescription className="flex items-center mt-1">
                    <Clock className="h-3.5 w-3.5 mr-1 text-[#42C3EE]" />
                    Received on{' '}
                    {new Date(selectedRequest.created_at!).toLocaleString()}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="flex flex-wrap justify-between items-center gap-2 bg-gradient-to-r from-[#3069FE]/5 to-[#42C3EE]/5 p-4 rounded-lg border border-[#42C3EE]/20">
                <div className="flex items-center">
                  <span className="font-medium mr-2 text-[#3069FE]">
                    Status:
                  </span>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2 text-[#3069FE]">
                    Urgency:
                  </span>
                  {getUrgencyBadge(selectedRequest.urgency)}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-[#42C3EE]" />
                  <span>{formatDate(selectedRequest.preferred_date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-[#42C3EE]" />
                  <span>{selectedRequest.preferred_time_slot}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center text-[#3069FE]">
                    <User className="h-4 w-4 mr-2 text-[#42C3EE]" />
                    Contact Information
                  </h4>
                  <div className="bg-white p-4 rounded-md space-y-3 border border-[#42C3EE]/20 shadow-sm">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-[#42C3EE]" />
                      <span>{selectedRequest.seeker_email}</span>
                    </div>
                    {selectedRequest.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-[#42C3EE]" />
                        <span>{selectedRequest.phone}</span>
                      </div>
                    )}
                    {selectedRequest.company_name && (
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-[#42C3EE]" />
                        <span>{selectedRequest.company_name}</span>
                      </div>
                    )}
                    {selectedRequest.budget && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-[#42C3EE]" />
                        <span>Budget: {selectedRequest.budget}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center text-[#3069FE]">
                    <FileText className="h-4 w-4 mr-2 text-[#42C3EE]" />
                    Requirements
                  </h4>
                  <div className="bg-white p-4 rounded-md h-[calc(100%-28px)] overflow-auto border border-[#42C3EE]/20 shadow-sm">
                    <p>{selectedRequest.requirements}</p>
                  </div>
                </div>
              </div>

              {selectedRequest.additional_info && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center text-[#3069FE]">
                    <FileText className="h-4 w-4 mr-2 text-[#42C3EE]" />
                    Additional Information
                  </h4>
                  <div className="bg-white p-4 rounded-md border border-[#42C3EE]/20 shadow-sm">
                    <p>{selectedRequest.additional_info}</p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center text-[#3069FE]">
                  <MessageSquare className="h-4 w-4 mr-2 text-[#42C3EE]" />
                  Admin Notes
                </h4>
                <Textarea
                  placeholder="Add notes about this request..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px] border-[#42C3EE]/30 focus:border-[#3069FE] focus:ring-[#3069FE]/20 resize-none"
                />
              </div>

              <div className="bg-gradient-to-r from-[#3069FE]/5 to-[#42C3EE]/5 p-4 rounded-md border border-[#42C3EE]/20">
                <h4 className="text-sm font-medium mb-3 flex items-center text-[#3069FE]">
                  <AlertCircle className="h-4 w-4 mr-2 text-[#42C3EE]" />
                  Update Status
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button
                    variant={
                      selectedRequest.status === 'pending'
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    className={`gap-1 ${
                      selectedRequest.status === 'pending'
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : 'hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-300'
                    }`}
                    onClick={() => handleUpdateStatus('pending')}
                    disabled={
                      statusUpdateLoading ||
                      selectedRequest.status === 'pending'
                    }
                  >
                    <AlertCircle className="h-4 w-4" />
                    Pending
                  </Button>
                  <Button
                    variant={
                      selectedRequest.status === 'contacted'
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    className={`gap-1 ${
                      selectedRequest.status === 'contacted'
                        ? 'bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:opacity-90'
                        : 'hover:bg-[#3069FE]/10 hover:text-[#3069FE] hover:border-[#42C3EE]/30'
                    }`}
                    onClick={() => handleUpdateStatus('contacted')}
                    disabled={
                      statusUpdateLoading ||
                      selectedRequest.status === 'contacted'
                    }
                  >
                    <Phone className="h-4 w-4" />
                    Contacted
                  </Button>
                  <Button
                    variant={
                      selectedRequest.status === 'completed'
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    className={`gap-1 ${
                      selectedRequest.status === 'completed'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'hover:bg-green-50 hover:text-green-700 hover:border-green-300'
                    }`}
                    onClick={() => handleUpdateStatus('completed')}
                    disabled={
                      statusUpdateLoading ||
                      selectedRequest.status === 'completed'
                    }
                  >
                    <CheckCircle className="h-4 w-4" />
                    Completed
                  </Button>
                  <Button
                    variant={
                      selectedRequest.status === 'rejected'
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    className={`gap-1 ${
                      selectedRequest.status === 'rejected'
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                    }`}
                    onClick={() => handleUpdateStatus('rejected')}
                    disabled={
                      statusUpdateLoading ||
                      selectedRequest.status === 'rejected'
                    }
                  >
                    <XCircle className="h-4 w-4" />
                    Rejected
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-between border-t border-[#42C3EE]/20 pt-4">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 border-[#42C3EE]/30 hover:bg-[#3069FE]/5 hover:text-[#3069FE]"
                  onClick={() => {
                    // Create a mailto link with pre-filled subject and body
                    const subject = `Re: Your inquiry about our services`;
                    const body = `Hello ${selectedRequest.seeker_name},\n\nThank you for your inquiry. I'm writing in response to your request regarding:\n\n"${selectedRequest.requirements.substring(0, 100)}..."\n\nI'd like to discuss this further with you.\n\nBest regards,`;
                    window.location.href = `mailto:${selectedRequest.seeker_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  }}
                >
                  <Mail className="h-4 w-4" />
                  Email Client
                </Button>
                {selectedRequest.phone && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 border-[#42C3EE]/30 hover:bg-[#3069FE]/5 hover:text-[#3069FE]"
                    onClick={() => {
                      window.location.href = `tel:${selectedRequest.phone}`;
                    }}
                  >
                    <Phone className="h-4 w-4" />
                    Call Client
                  </Button>
                )}
              </div>
              <Button
                onClick={() => setIsDialogOpen(false)}
                className="bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:opacity-90 transition-all duration-200 text-white"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

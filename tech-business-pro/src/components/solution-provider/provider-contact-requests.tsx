'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
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
} from 'lucide-react';
import { format } from 'date-fns';
import type { ContactRequest } from '@/lib/types';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProviderContactRequestsProps {
  providerId: number;
}

export function ProviderContactRequests({
  providerId,
}: ProviderContactRequestsProps) {
  const { toast } = useToast();
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
        const result = await getContactRequestsForProvider(providerId);
        if (result.success) {
          setRequests((result.data as ContactRequest[]) || []);
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Failed to load contact requests',
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast({
          title: 'Error',
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

        toast({
          title: 'Status updated',
          description: `Request status updated to ${status}`,
        });

        setIsDialogOpen(false);
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update status',
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
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
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case 'contacted':
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Contacted
          </Badge>
        );
      case 'completed':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Completed
          </Badge>
        );
      case 'rejected':
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
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
            className="bg-blue-50 text-blue-700 border-blue-200"
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading contact requests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Contact Requests
          </h2>
          <p className="text-muted-foreground">
            Manage inquiries from potential clients interested in your solutions
          </p>
        </div>
      </div>

      <Tabs
        defaultValue="pending"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="pending" className="relative">
            Pending
            {requests.filter((r) => r.status === 'pending' && !r.read).length >
              0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {
                  requests.filter((r) => r.status === 'pending' && !r.read)
                    .length
                }
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="contacted">Contacted</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No {activeTab} requests
              </h3>
              <p className="text-gray-500">
                {activeTab === 'pending'
                  ? "You don't have any pending contact requests at the moment."
                  : `You don't have any ${activeTab} requests.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request) => (
                <Card
                  key={request.id}
                  className={`overflow-hidden transition-all duration-200 hover:shadow-md ${!request.read ? 'border-l-4 border-l-blue-500' : ''}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-2">
                          <AvatarImage
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(request.seeker_name)}&background=random`}
                          />
                          <AvatarFallback>
                            {request.seeker_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {request.seeker_name}
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center">
                            <Mail className="h-3.5 w-3.5 mr-1" />
                            {request.seeker_email}
                          </CardDescription>
                        </div>
                      </div>
                      <div>{getStatusBadge(request.status)}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">
                          Requirements
                        </div>
                        <p className="text-sm line-clamp-3">
                          {request.requirements}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                          Urgency: {getUrgencyBadge(request.urgency)}
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          {formatDate(request.preferred_date)}
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Clock className="h-3.5 w-3.5 mr-1.5" />
                          {request.preferred_time_slot}
                        </div>
                      </div>

                      {request.company_name && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <Building className="h-3.5 w-3.5 mr-1.5" />
                          {request.company_name}
                        </div>
                      )}

                      {request.budget && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                          {request.budget}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-3 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {new Date(request.created_at!).toLocaleDateString()}
                      {!request.read && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                          New
                        </span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewRequest(request)}
                      className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 cursor-pointer"
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
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gray-200">
            <DialogHeader>
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedRequest.seeker_name)}&background=random`}
                  />
                  <AvatarFallback>
                    {selectedRequest.seeker_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-xl">
                    Contact Request from {selectedRequest.seeker_name}
                  </DialogTitle>
                  <DialogDescription>
                    Received on{' '}
                    {new Date(selectedRequest.created_at!).toLocaleString()}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="flex flex-wrap justify-between items-center gap-2 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Status:</span>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Urgency:</span>
                  {getUrgencyBadge(selectedRequest.urgency)}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{formatDate(selectedRequest.preferred_date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{selectedRequest.preferred_time_slot}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    Contact Information
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-md space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{selectedRequest.seeker_email}</span>
                    </div>
                    {selectedRequest.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{selectedRequest.phone}</span>
                      </div>
                    )}
                    {selectedRequest.company_name && (
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{selectedRequest.company_name}</span>
                      </div>
                    )}
                    {selectedRequest.budget && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Budget: {selectedRequest.budget}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    Requirements
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-md h-[calc(100%-28px)] overflow-auto">
                    <p>{selectedRequest.requirements}</p>
                  </div>
                </div>
              </div>

              {selectedRequest.additional_info && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    Additional Information
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p>{selectedRequest.additional_info}</p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                  Your Notes
                </h4>
                <Textarea
                  placeholder="Add notes about this request..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-gray-500" />
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
                    className={`gap-1 ${selectedRequest.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
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
                    className={`gap-1 ${selectedRequest.status === 'contacted' ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
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
                    className={`gap-1 ${selectedRequest.status === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}`}
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
                    className={`gap-1 ${selectedRequest.status === 'rejected' ? 'bg-red-500 hover:bg-red-600' : ''}`}
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

            <DialogFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
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
                    className="gap-1"
                    onClick={() => {
                      window.location.href = `tel:${selectedRequest.phone}`;
                    }}
                  >
                    <Phone className="h-4 w-4" />
                    Call Client
                  </Button>
                )}
              </div>
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

'use client';

import { DialogTrigger } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Trash,
  Loader2,
  Award,
  Calendar,
  CheckCircle,
  AlertCircle,
  X,
  Star,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  getAllApprovedExpertise,
  getPendingAndRejectedExpertise,
  addProviderExpertise,
  deleteProviderExpertise,
  deleteApplicationExpertise,
} from '@/app/actions/expertise-actions';
import { AddExpertiseForm } from './add-expertise-form';
import { toast } from 'sonner';

export function ProviderExpertiseTable({
  providerId,
}: {
  providerId?: number;
}) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [expertiseToDelete, setExpertiseToDelete] = useState<{
    id?: number;
    name?: string;
    source?: string;
    applicationId?: number;
  } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [approvedExpertise, setApprovedExpertise] = useState<any[]>([]);

  const [pendingRejectedExpertise, setPendingRejectedExpertise] = useState<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch all expertise data
  const fetchData = async () => {
    if (!providerId) {
      console.log('No providerId available, skipping expertise fetch');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log(`Fetching expertise for provider ID: ${providerId}`);

      // Fetch both approved and pending/rejected expertise
      const [approvedResult, pendingRejectedResult] = await Promise.all([
        getAllApprovedExpertise(providerId),
        getPendingAndRejectedExpertise(providerId),
      ]);

      if (approvedResult.success) {
        console.log('Approved expertise loaded:', approvedResult.data);
        setApprovedExpertise(approvedResult.data || []);
      } else {
        console.error(
          'Error loading approved expertise:',
          approvedResult.error,
        );
        toast('Error', {
          description:
            approvedResult.error || 'Failed to load approved expertise',
        });
      }

      if (pendingRejectedResult.success) {
        console.log(
          'Pending/Rejected expertise loaded:',
          pendingRejectedResult.data,
        );
        setPendingRejectedExpertise(pendingRejectedResult.data || []);
      } else {
        console.error(
          'Error loading pending/rejected expertise:',
          pendingRejectedResult.error,
        );
        // Don't show error toast for this as it's not critical
      }
    } catch (error) {
      console.error('Exception in fetchData:', error);
      toast('Error', {
        description: 'Failed to load expertise. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [providerId]);

  const handleAddExpertise = async (expertise: string) => {
    if (!providerId) return;

    // Check if expertise already exists in any form
    const allExistingNames = [
      ...approvedExpertise.map((item) => item.name),
      ...pendingRejectedExpertise.map((item) => item.name),
    ];

    if (allExistingNames.includes(expertise)) {
      toast('Expertise already exists', {
        description: 'This expertise already exists in your profile.',
      });
      setIsAddDialogOpen(false);
      return;
    }

    try {
      console.log(`Adding expertise "${expertise}" for provider ${providerId}`);
      const result = await addProviderExpertise(providerId, expertise);

      if (result.success) {
        console.log('Expertise added successfully:', result.data);
        // Add the new expertise to the pending/rejected list
        setPendingRejectedExpertise([...pendingRejectedExpertise, result.data]);

        setIsAddDialogOpen(false);

        toast('Expertise added', {
          description: 'Your expertise has been added and is pending approval.',
        });
      } else {
        console.error('Error adding expertise:', result.error);
        throw new Error(result.error || 'Failed to add expertise');
      }
    } catch (error) {
      console.error('Exception adding expertise:', error);
      toast('Error', {
        description:
          'There was an error adding your expertise. Please try again.',
      });
    }
  };

  const handleDeleteExpertise = async () => {
    if (!expertiseToDelete || !providerId) return;

    try {
      setDeleteLoading(true);
      console.log('Deleting expertise:', expertiseToDelete);

      let result;
      if (
        expertiseToDelete.source === 'application' &&
        expertiseToDelete.applicationId &&
        expertiseToDelete.name
      ) {
        // Delete from application
        console.log('Deleting from application:', expertiseToDelete);
        result = await deleteApplicationExpertise(
          providerId,
          expertiseToDelete.name,
          expertiseToDelete.applicationId,
        );
      } else if (expertiseToDelete.id) {
        // Delete from provider expertise table
        console.log(
          'Deleting from provider expertise table:',
          expertiseToDelete,
        );
        result = await deleteProviderExpertise(expertiseToDelete.id);
      } else {
        throw new Error('Invalid expertise data for deletion');
      }

      if (result?.success) {
        console.log('Expertise deleted successfully');

        // Refresh the data to get the updated state
        await fetchData();

        setIsDeleteDialogOpen(false);
        setExpertiseToDelete(null);

        toast('Expertise removed', {
          description: 'Your expertise has been removed successfully.',
        });
      } else {
        throw new Error(result?.error || 'Failed to delete expertise');
      }
    } catch (error) {
      console.error('Exception deleting expertise:', error);
      toast('Error', {
        description:
          'There was an error removing your expertise. Please try again.',
      });
    } finally {
      setDeleteLoading(false);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openDeleteDialog = (item: any) => {
    console.log('Opening delete dialog for item:', item);

    if (item.source === 'application') {
      setExpertiseToDelete({
        name: item.name,
        source: item.source,
        applicationId: item.application_id,
      });
    } else {
      // For additional expertise
      setExpertiseToDelete({
        id: item.id,
        name: item.name,
        source: 'additional',
      });
    }

    setIsDeleteDialogOpen(true);
  };

  // Get all existing expertise names for validation
  const allExistingExpertise = [
    ...approvedExpertise.map((item) => item.name),
    ...pendingRejectedExpertise.map((item) => item.name),
  ];

  const hasApprovedExpertise =
    approvedExpertise && approvedExpertise.length > 0;
  const hasPendingRejectedExpertise =
    pendingRejectedExpertise && pendingRejectedExpertise.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[#42C3EE]/20 pb-5">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#3069FE] to-[#42C3EE] bg-clip-text text-transparent">
            My Expertise
          </h2>
          <p className="text-muted-foreground mt-2">
            Manage your areas of expertise and add new skills
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-[#3069FE]/20 text-white font-medium px-4 py-2 rounded-md">
              <Plus className="mr-2 h-4 w-4" />
              Add Expertise
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-gray-900 to-[#3069FE]/90 text-white border border-[#42C3EE]/30 space-y-8 rounded-xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center">
                <Award className="h-5 w-5 mr-2 text-[#42C3EE]" />
                Add New Expertise
              </DialogTitle>
              <DialogDescription className="text-gray-300 mt-2">
                Add a new area of expertise to showcase your skills
              </DialogDescription>
            </DialogHeader>

            <AddExpertiseForm
              onSubmit={handleAddExpertise}
              onCancel={() => setIsAddDialogOpen(false)}
              existingExpertise={allExistingExpertise}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Approved Expertise Table */}
      <Card className="border border-[#42C3EE]/30 shadow-md hover:shadow-lg hover:shadow-[#3069FE]/10 transition-all duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#3069FE]/5 to-[#42C3EE]/5 border-b border-[#42C3EE]/20">
          <CardTitle className="text-xl font-bold text-[#3069FE] flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            Approved Expertise
          </CardTitle>
          <CardDescription>
            Your approved areas of expertise from applications and additional
            submissions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#3069FE]" />
            </div>
          ) : !hasApprovedExpertise ? (
            <div className="text-center py-8 bg-gradient-to-r from-[#3069FE]/5 to-[#42C3EE]/5 rounded-lg border border-dashed border-[#42C3EE]/30">
              <Award className="h-12 w-12 mx-auto mb-3 text-[#42C3EE] opacity-50" />
              <p className="text-[#3069FE] font-medium mb-2">
                No approved expertise yet
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Submit your first expertise or wait for your application to be
                approved
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gradient-to-r from-[#3069FE]/5 to-[#42C3EE]/5">
                <TableRow>
                  <TableHead className="font-medium text-[#3069FE]">
                    Expertise
                  </TableHead>
                  <TableHead className="font-medium text-[#3069FE]">
                    Source
                  </TableHead>
                  <TableHead className="font-medium text-[#3069FE]">
                    Approved On
                  </TableHead>
                  <TableHead className="text-right font-medium text-[#3069FE]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedExpertise.map((item, index) => (
                  <TableRow
                    key={`${item.name}-${item.source}-${item.id || item.application_id}-${index}`}
                    className="hover:bg-gradient-to-r hover:from-[#3069FE]/5 hover:to-[#42C3EE]/5 transition-colors"
                  >
                    <TableCell className="font-medium flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      {item.name}
                    </TableCell>
                    <TableCell>
                      {item.source === 'application' ? (
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-blue-500/20 to-blue-400/20 text-blue-700 border border-blue-300 flex items-center w-fit"
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Partner Application
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-[#3069FE]/20 to-[#42C3EE]/20 text-[#3069FE] border border-[#42C3EE]/30 flex items-center w-fit"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Additional Expertise
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-[#42C3EE]" />
                      {new Date(
                        item.reviewed_at || item.created_at,
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(item)}
                          className="hover:bg-red-100 hover:text-red-600 rounded-full h-8 w-8 transition-all duration-200"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pending/Rejected Expertise Table */}
      {hasPendingRejectedExpertise && (
        <Card className="border border-[#42C3EE]/30 shadow-md hover:shadow-lg hover:shadow-[#3069FE]/10 transition-all duration-300 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-500/5 to-red-500/5 border-b border-orange-200">
            <CardTitle className="text-xl font-bold text-orange-600 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Pending & Rejected Expertise
            </CardTitle>
            <CardDescription>
              Expertise awaiting approval or that have been rejected
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Table>
              <TableHeader className="bg-gradient-to-r from-orange-500/5 to-red-500/5">
                <TableRow>
                  <TableHead className="font-medium text-orange-600">
                    Expertise
                  </TableHead>
                  <TableHead className="font-medium text-orange-600">
                    Status
                  </TableHead>
                  <TableHead className="font-medium text-orange-600">
                    Submitted On
                  </TableHead>
                  <TableHead className="text-right font-medium text-orange-600">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRejectedExpertise.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gradient-to-r hover:from-orange-500/5 hover:to-red-500/5 transition-colors"
                  >
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      {item.status === 'rejected' ? (
                        <Badge
                          variant="destructive"
                          className="bg-gradient-to-r from-red-500/20 to-red-400/20 text-red-700 border border-red-300 flex items-center w-fit"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Rejected
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-orange-500/20 to-orange-400/20 text-orange-700 border border-orange-300 flex items-center w-fit"
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-orange-500" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(item)}
                          className="hover:bg-red-100 hover:text-red-600 rounded-full h-8 w-8 transition-all duration-200"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-gray-900 to-[#3069FE]/90 text-white border border-[#42C3EE]/30 rounded-xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-2">
              Are you sure you want to remove &quot;{expertiseToDelete?.name}
              &quot; expertise? This action cannot be undone.
              {expertiseToDelete?.source === 'application' && (
                <div className="mt-2 p-2 bg-yellow-500/20 rounded border border-yellow-300 text-yellow-200">
                  <strong>Note:</strong> This will remove the expertise from
                  your partner application.
                </div>
              )}
              {expertiseToDelete?.source === 'additional' && (
                <div className="mt-2 p-2 bg-blue-500/20 rounded border border-blue-300 text-blue-200">
                  <strong>Note:</strong> This will remove the additional
                  expertise you added.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-600 text-white hover:bg-gray-800"
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteExpertise}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </div>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

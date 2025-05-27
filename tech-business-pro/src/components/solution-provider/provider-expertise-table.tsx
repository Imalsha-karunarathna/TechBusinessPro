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
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  getProviderExpertise,
  addProviderExpertise,
  deleteProviderExpertise,
} from '@/app/actions/expertise-actions';
import { AddExpertiseForm } from './add-expertise-form';
import { toast } from 'sonner';

export function ProviderExpertiseTable({
  providerId,
  applicationExpertise = [],
}: {
  providerId?: number;
  applicationExpertise?: string[];
}) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [expertiseToDelete, setExpertiseToDelete] = useState<number | null>(
    null,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [providerExpertise, setProviderExpertise] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Debug logging for applicationExpertise
  useEffect(() => {
    console.log(
      'ProviderExpertiseTable received applicationExpertise:',
      applicationExpertise,
    );
  }, [applicationExpertise]);

  // Fetch provider expertise when component mounts or providerId changes
  useEffect(() => {
    async function fetchExpertise() {
      if (!providerId) {
        console.log('No providerId available, skipping expertise fetch');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(`Fetching expertise for provider ID: ${providerId}`);
        const result = await getProviderExpertise(providerId);

        if (result.success) {
          console.log('Provider expertise loaded:', result.data);
          // Show all expertise including rejected ones
          setProviderExpertise(result.data || []);
        } else {
          console.error('Error loading provider expertise:', result.error);
          toast('Error', {
            description: result.error || 'Failed to load expertise',
          });
        }
      } catch (error) {
        console.error('Exception in fetchExpertise:', error);
        toast('Error', {
          description: 'Failed to load expertise. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchExpertise();
  }, [providerId, toast]);

  // Render application expertise section
  const renderApplicationExpertise = () => {
    if (
      !applicationExpertise ||
      !Array.isArray(applicationExpertise) ||
      applicationExpertise.length === 0
    ) {
      console.log('No application expertise to render');
      return null;
    }

    console.log('Rendering application expertise:', applicationExpertise);
    return (
      <div className="bg-gradient-to-r from-[#3069FE]/10 to-[#42C3EE]/10 p-6 rounded-lg border border-[#42C3EE]/30 mb-6 shadow-sm">
        <h3 className="text-md font-medium text-[#3069FE] mb-3 flex items-center">
          <Award className="h-5 w-5 mr-2 text-[#42C3EE]" />
          Your Approved Expertise from Application
        </h3>
        <div className="flex flex-wrap gap-2">
          {applicationExpertise.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-[#3069FE]/20 text-[#3069FE] border border-[#42C3EE]/30 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover:bg-[#3069FE]/30"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  const handleAddExpertise = async (expertise: string) => {
    if (!providerId) return;

    // Check if expertise already exists in application expertise
    if (applicationExpertise && applicationExpertise.includes(expertise)) {
      toast('Expertise already exists', {
        description:
          'This expertise is already in your profile from your application.',
      });
      setIsAddDialogOpen(false);
      return;
    }

    try {
      console.log(`Adding expertise "${expertise}" for provider ${providerId}`);
      const result = await addProviderExpertise(providerId, expertise);

      if (result.success) {
        console.log('Expertise added successfully:', result.data);
        // Add the new expertise to the local state
        setProviderExpertise([...providerExpertise, result.data]);

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
    if (!expertiseToDelete) return;

    try {
      console.log(`Deleting expertise ID: ${expertiseToDelete}`);
      const result = await deleteProviderExpertise(expertiseToDelete);

      if (result.success) {
        console.log('Expertise deleted successfully');
        // Remove the deleted expertise from the local state
        setProviderExpertise(
          providerExpertise.filter((item) => item.id !== expertiseToDelete),
        );

        setIsDeleteDialogOpen(false);
        setExpertiseToDelete(null);

        toast('Expertise removed', {
          description: 'Your expertise has been removed successfully.',
        });
      } else {
        console.error('Error deleting expertise:', result.error);
        throw new Error(result.error || 'Failed to delete expertise');
      }
    } catch (error) {
      console.error('Exception deleting expertise:', error);
      toast('Error', {
        description:
          'There was an error removing your expertise. Please try again.',
      });
    }
  };

  const openDeleteDialog = (id: number) => {
    setExpertiseToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Debug output for rendering decisions
  const hasApplicationExpertise =
    applicationExpertise &&
    Array.isArray(applicationExpertise) &&
    applicationExpertise.length > 0;
  const hasProviderExpertise =
    providerExpertise && providerExpertise.length > 0;
  console.log('Rendering state:', {
    hasApplicationExpertise,
    hasProviderExpertise,
    loading,
    applicationExpertiseLength: applicationExpertise?.length || 0,
    providerExpertiseLength: providerExpertise?.length || 0,
  });

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
              existingExpertise={applicationExpertise}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Display application expertise */}
      {renderApplicationExpertise()}

      <Card className="border border-[#42C3EE]/30 shadow-md hover:shadow-lg hover:shadow-[#3069FE]/10 transition-all duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#3069FE]/5 to-[#42C3EE]/5 border-b border-[#42C3EE]/20">
          <CardTitle className="text-xl font-bold text-[#3069FE]">
            Expertise Management
          </CardTitle>
          <CardDescription>
            View and manage additional areas of expertise
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#3069FE]" />
            </div>
          ) : !hasProviderExpertise && !hasApplicationExpertise ? (
            <div className="text-center py-8 bg-gradient-to-r from-[#3069FE]/5 to-[#42C3EE]/5 rounded-lg border border-dashed border-[#42C3EE]/30">
              <Award className="h-12 w-12 mx-auto mb-3 text-[#42C3EE] opacity-50" />
              <p className="text-[#3069FE] font-medium mb-2">
                No expertise found
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Add your first expertise to get started
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-[#3069FE]/20 text-white font-medium px-4 py-2 rounded-md"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Expertise
              </Button>
            </div>
          ) : !hasProviderExpertise && hasApplicationExpertise ? (
            <div className="text-center py-8 bg-gradient-to-r from-[#3069FE]/5 to-[#42C3EE]/5 rounded-lg border border-dashed border-[#42C3EE]/30">
              <Award className="h-12 w-12 mx-auto mb-3 text-[#42C3EE] opacity-50" />
              <p className="text-[#3069FE] font-medium mb-2">
                No additional expertise
              </p>
              <p className="text-sm text-gray-500 mb-4">
                You can add more expertise beyond your application
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-[#3069FE]/20 text-white font-medium px-4 py-2 rounded-md"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Expertise
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gradient-to-r from-[#3069FE]/5 to-[#42C3EE]/5">
                <TableRow>
                  <TableHead className="font-medium text-[#3069FE]">
                    Expertise
                  </TableHead>
                  <TableHead className="font-medium text-[#3069FE]">
                    Status
                  </TableHead>
                  <TableHead className="font-medium text-[#3069FE]">
                    Added On
                  </TableHead>
                  <TableHead className="text-right font-medium text-[#3069FE]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providerExpertise.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gradient-to-r hover:from-[#3069FE]/5 hover:to-[#42C3EE]/5 transition-colors"
                  >
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      {item.status === 'approved' ? (
                        <Badge
                          variant="default"
                          className="bg-gradient-to-r from-green-500/20 to-green-400/20 text-green-700 border border-green-300 flex items-center w-fit"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
                      ) : item.status === 'rejected' ? (
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
                          className="bg-gradient-to-r from-[#3069FE]/20 to-[#42C3EE]/20 text-[#3069FE] border border-[#42C3EE]/30 flex items-center w-fit"
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-[#42C3EE]" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(item.id)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-gray-900 to-[#3069FE]/90 text-white border border-[#42C3EE]/30 rounded-xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-2">
              Are you sure you want to remove this expertise? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteExpertise}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

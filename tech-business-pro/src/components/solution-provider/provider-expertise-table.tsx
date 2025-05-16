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
import { Plus, Trash, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  getProviderExpertise,
  addProviderExpertise,
  deleteProviderExpertise,
} from '@/app/actions/expertise-actions';
import { AddExpertiseForm } from './add-expertise-form';

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
  const { toast } = useToast();

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
          setProviderExpertise(result.data || []);
        } else {
          console.error('Error loading provider expertise:', result.error);
          toast({
            title: 'Error',
            description: result.error || 'Failed to load expertise',
          });
        }
      } catch (error) {
        console.error('Exception in fetchExpertise:', error);
        toast({
          title: 'Error',
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
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          Your Approved Expertise from Application
        </h3>
        <div className="flex flex-wrap gap-2">
          {applicationExpertise.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-blue-100 text-blue-800"
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
      toast({
        title: 'Expertise already exists',
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

        toast({
          title: 'Expertise added',
          description: 'Your expertise has been added and is pending approval.',
        });
      } else {
        console.error('Error adding expertise:', result.error);
        throw new Error(result.error || 'Failed to add expertise');
      }
    } catch (error) {
      console.error('Exception adding expertise:', error);
      toast({
        title: 'Error',
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

        toast({
          title: 'Expertise removed',
          description: 'Your expertise has been removed successfully.',
        });
      } else {
        console.error('Error deleting expertise:', result.error);
        throw new Error(result.error || 'Failed to delete expertise');
      }
    } catch (error) {
      console.error('Exception deleting expertise:', error);
      toast({
        title: 'Error',
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Expertise</h2>
          <p className="text-muted-foreground">
            Manage your areas of expertise and add new skills
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Expertise
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-gray-800 text-white space-y-8">
            <DialogHeader>
              <DialogTitle>Add New Expertise</DialogTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Expertise Management</CardTitle>
          <CardDescription>
            View and manage additional areas of expertise
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : !hasProviderExpertise && !hasApplicationExpertise ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-gray-500 mb-2">No expertise found</p>
              <p className="text-sm text-gray-400 mb-4">
                Add your first expertise to get started
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Expertise
              </Button>
            </div>
          ) : !hasProviderExpertise && hasApplicationExpertise ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-gray-500 mb-2">No additional expertise</p>
              <p className="text-sm text-gray-400 mb-4">
                You can add more expertise beyond your application
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Expertise
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expertise</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providerExpertise.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === 'approved' ? 'default' : 'secondary'
                        }
                        className={
                          item.status === 'approved'
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                        }
                      >
                        {item.status === 'approved' ? 'Approved' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(item.id)}
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this expertise? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteExpertise}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

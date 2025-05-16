// 'use client';

// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { Edit, Eye, Plus, Trash, Loader2 } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { AddSolutionForm } from './add-solution-form';
// import { useToast } from '@/hooks/use-toast';
// import { getProviderSolutions } from '@/app/actions/solution-actions';

// // Category mapping
// const categoryMap: Record<string, string> = {
//   cloud_computing: 'Cloud Computing',
//   artificial_intelligence: 'Artificial Intelligence',
//   cybersecurity: 'Cybersecurity',
//   data_analytics: 'Data Analytics',
//   iot: 'Internet of Things',
//   blockchain: 'Blockchain',
//   erp: 'ERP Systems',
//   crm: 'CRM Solutions',
// };

// interface ProviderSolutionsTableProps {
//   providerId?: number;
// }

// export function ProviderSolutionsTable({
//   providerId,
// }: ProviderSolutionsTableProps) {
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [solutions, setSolutions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { toast } = useToast();

//   // Fetch provider solutions when component mounts
//   useEffect(() => {
//     async function fetchSolutions() {
//       if (!providerId) return;

//       try {
//         setLoading(true);
//         const result = await getProviderSolutions(providerId);

//         if (result.success) {
//           setSolutions(result.data || []);
//         } else {
//           toast({
//             title: 'Error',
//             description: result.error || 'Failed to load solutions',
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching solutions:', error);
//         toast({
//           title: 'Error',
//           description: 'Failed to load solutions. Please try again later.',
//         });
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchSolutions();
//   }, [providerId, toast]);

//   const handleAddSolution = async (newSolution: any) => {
//     // In a real app, you would add the solution to the database
//     // and then refresh the solutions list

//     // For now, we'll just add it to the local state
//     setSolutions([
//       ...solutions,
//       {
//         ...newSolution,
//         id: Date.now(), // Temporary ID
//         status: 'pending',
//         views: 0,
//         inquiries: 0,
//         created_at: new Date().toISOString().split('T')[0],
//       },
//     ]);

//     setIsAddDialogOpen(false);

//     toast({
//       title: 'Solution added',
//       description: 'Your solution has been added and is pending approval.',
//     });
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold tracking-tight">My Solutions</h2>
//           <p className="text-muted-foreground">
//             Manage your technology solutions and track their performance
//           </p>
//         </div>
//         <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="mr-2 h-4 w-4" />
//               Add Solution
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[600px]">
//             <DialogTitle>Add New Solution</DialogTitle>
//             <DialogDescription>
//               Create a new technology solution to showcase to potential clients
//             </DialogDescription>

//             <AddSolutionForm
//               onSuccess={() => setIsAddDialogOpen(false)}
//               onSubmit={handleAddSolution}
//               providerId={providerId}
//             />
//           </DialogContent>
//         </Dialog>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Solutions</CardTitle>
//           <CardDescription>
//             View and manage all your technology solutions
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {loading ? (
//             <div className="flex justify-center py-8">
//               <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
//             </div>
//           ) : solutions.length === 0 ? (
//             <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
//               <p className="text-gray-500 mb-2">No solutions found</p>
//               <p className="text-sm text-gray-400 mb-4">
//                 Add your first solution to get started
//               </p>
//               <Button onClick={() => setIsAddDialogOpen(true)}>
//                 <Plus className="mr-2 h-4 w-4" />
//                 Add Solution
//               </Button>
//             </div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Solution</TableHead>
//                   <TableHead>Category</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Views</TableHead>
//                   <TableHead className="text-right">Inquiries</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {solutions.map((solution) => (
//                   <TableRow key={solution.id}>
//                     <TableCell className="font-medium">
//                       {solution.title}
//                     </TableCell>
//                     <TableCell>
//                       {categoryMap[solution.category] || solution.category}
//                     </TableCell>
//                     <TableCell>
//                       <Badge
//                         variant={
//                           solution.status === 'active' ? 'default' : 'secondary'
//                         }
//                         className={
//                           solution.status === 'active'
//                             ? 'bg-green-100 text-green-800 hover:bg-green-100'
//                             : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
//                         }
//                       >
//                         {solution.status === 'active' ? 'Active' : 'Pending'}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       {solution.views || 0}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       {solution.inquiries || 0}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end gap-2">
//                         <Button variant="ghost" size="icon">
//                           <Eye className="h-4 w-4" />
//                           <span className="sr-only">View</span>
//                         </Button>
//                         <Button variant="ghost" size="icon">
//                           <Edit className="h-4 w-4" />
//                           <span className="sr-only">Edit</span>
//                         </Button>
//                         <Button variant="ghost" size="icon">
//                           <Trash className="h-4 w-4" />
//                           <span className="sr-only">Delete</span>
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

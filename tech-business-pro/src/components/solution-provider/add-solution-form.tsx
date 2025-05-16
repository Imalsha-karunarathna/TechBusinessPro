// 'use client';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { useState } from 'react';
// import { useToast } from '@/hooks/use-toast';
// import { createSolution } from '@/app/actions/solution-actions';
// import { Loader2 } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';

// // Update the solutionFormSchema to use the correct category types
// const solutionFormSchema = z.object({
//   title: z.string().min(5, 'Title must be at least 5 characters'),
//   description: z.string().min(20, 'Description must be at least 20 characters'),
//   category: z.enum(
//     [
//       'website_development',
//       'it_security',
//       'crm_systems',
//       'business_applications',
//       'other',
//     ],
//     {
//       errorMap: () => ({ message: 'Please select a valid category' }),
//     },
//   ),
//   image_url: z
//     .string()
//     .url('Please enter a valid URL')
//     .optional()
//     .or(z.literal('')),
//   regions: z.array(z.string()).min(1, 'Please select at least one region'),
//   features: z.array(z.string()).min(1, 'Please add at least one feature'),
//   pricing_model: z.string().min(1, 'Please select a pricing model'),
//   pricing_details: z.string().optional(),
// });

// type SolutionFormValues = z.infer<typeof solutionFormSchema>;

// interface AddSolutionFormProps {
//   onSuccess?: () => void;
//   onSubmit?: (data: SolutionFormValues) => void;
//   providerId?: number;
//   expertise?: string[];
// }

// export function AddSolutionForm({
//   onSuccess,
//   onSubmit,
//   providerId,
//   expertise = [],
// }: AddSolutionFormProps) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [features, setFeatures] = useState<string[]>([]);
//   const [featureInput, setFeatureInput] = useState('');
//   const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
//   const { toast } = useToast();

//   // Default values for the form
//   const defaultValues: Partial<SolutionFormValues> = {
//     title: '',
//     description: '',
//     category: 'other',
//     image_url: '',
//     regions: [],
//     features: [],
//     pricing_model: '',
//     pricing_details: '',
//   };

//   const form = useForm<SolutionFormValues>({
//     resolver: zodResolver(solutionFormSchema),
//     defaultValues,
//   });

//   const addFeature = () => {
//     if (featureInput.trim()) {
//       const updatedFeatures = [...features, featureInput.trim()];
//       setFeatures(updatedFeatures);
//       form.setValue('features', updatedFeatures);
//       setFeatureInput('');
//     }
//   };

//   const removeFeature = (index: number) => {
//     const updatedFeatures = features.filter((_, i) => i !== index);
//     setFeatures(updatedFeatures);
//     form.setValue('features', updatedFeatures);
//   };

//   const addRegion = (value: string) => {
//     if (!selectedRegions.includes(value)) {
//       const updatedRegions = [...selectedRegions, value];
//       setSelectedRegions(updatedRegions);
//       form.setValue('regions', updatedRegions);
//     }
//   };

//   const removeRegion = (value: string) => {
//     const updatedRegions = selectedRegions.filter((region) => region !== value);
//     setSelectedRegions(updatedRegions);
//     form.setValue('regions', updatedRegions);
//   };

//   async function handleSubmit(data: SolutionFormValues) {
//     setIsLoading(true);
//     try {
//       console.log('Submitting solution form with data:', data);
//       console.log('Provider ID:', providerId);

//       // Add provider ID to the data
//       const solutionData = {
//         ...data,
//         provider_id: providerId,
//         expertise: expertise, // Include expertise from props
//       };

//       // If onSubmit prop is provided, call it
//       if (onSubmit) {
//         onSubmit(solutionData);
//         if (onSuccess) {
//           onSuccess();
//         }
//         return;
//       }

//       // Otherwise, call the server action
//       const result = await createSolution(solutionData);

//       if (result.success) {
//         toast({
//           title: 'Solution added',
//           description:
//             'Your solution has been added successfully and is pending approval.',
//         });

//         if (onSuccess) {
//           onSuccess();
//         }
//       } else {
//         throw new Error(result.error || 'Failed to add solution');
//       }
//     } catch (error) {
//       console.error(error);
//       toast({
//         title: 'Error',
//         description:
//           'There was an error adding your solution. Please try again.',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
//         {expertise && expertise.length > 0 && (
//           <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
//             <h3 className="text-sm font-medium text-blue-800 mb-2">
//               Your Expertise
//             </h3>
//             <div className="flex flex-wrap gap-2">
//               {expertise.map((skill, index) => (
//                 <Badge
//                   key={index}
//                   variant="secondary"
//                   className="bg-blue-100 text-blue-800"
//                 >
//                   {skill}
//                 </Badge>
//               ))}
//             </div>
//             <p className="text-xs text-blue-600 mt-2">
//               These expertise areas will be automatically associated with your
//               solution.
//             </p>
//           </div>
//         )}

//         <FormField
//           control={form.control}
//           name="title"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Solution Title</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter your solution title" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Rest of the form remains unchanged */}

//         {/* ... */}

//         <div className="flex justify-end gap-2">
//           <Button type="button" variant="outline" onClick={onSuccess}>
//             Cancel
//           </Button>
//           <Button type="submit" disabled={isLoading}>
//             {isLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Adding...
//               </>
//             ) : (
//               'Add Solution'
//             )}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }

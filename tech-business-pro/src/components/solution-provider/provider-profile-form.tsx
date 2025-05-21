'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createOrUpdateProvider } from '@/app/actions/provider-actions';
import {
  Loader2,
  Save,
  Building,
  Mail,
  Globe,
  Phone,
  ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().optional(),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  website: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
  logo_url: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .optional()
    .or(z.literal('')),
  regions_served: z
    .array(z.string())
    .min(1, { message: 'Please select at least one region' }),
});

type ProviderProfileFormValues = z.infer<typeof formSchema>;

interface ProviderProfileFormProps {
  /*eslint-disable @typescript-eslint/no-explicit-any */
  initialData?: any; // Replace with a more specific type if possible
}

export function ProviderProfileForm({ initialData }: ProviderProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Initialize form with default values
  const form = useForm<ProviderProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      email: '',
      website: '',
      phone: '',
      logo_url: '',
      regions_served: [],
    },
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log('Setting form values with initialData:', initialData);

      // Ensure regions_served is an array
      let regionsServed = initialData.regions_served;
      if (!Array.isArray(regionsServed)) {
        regionsServed = regionsServed ? [regionsServed] : [];
      }

      form.reset({
        name: initialData.name || '',
        description: initialData.description || '',
        email: initialData.email || '',
        website: initialData.website || '',
        phone: initialData.phone || '',
        logo_url: initialData.logo_url || '',
        regions_served: regionsServed,
      });
    }
  }, [initialData, form]);

  // Handle form submission
  async function onSubmit(data: ProviderProfileFormValues) {
    setIsLoading(true);
    try {
      console.log('initialData.id:', initialData?.id);
      console.log('Submitting form with data:', data);
      console.log('Initial data:', initialData);

      // Ensure regions_served is an array
      if (!Array.isArray(data.regions_served)) {
        data.regions_served = data.regions_served ? [data.regions_served] : [];
      }

      const result = await createOrUpdateProvider({
        id: initialData?.user_id, // Make sure to include the ID for updates
        name: data.name,
        email: data.email,
        website: data.website,
        phone: data.phone,
        logo_url: data.logo_url,
        description: data.description ?? '',
        user_id: initialData.user_id,
        verification_status: initialData.verification_status,
        regions_served: data.regions_served,
      });

      if (result.success) {
        toast('Profile updated', {
          description: 'Your provider profile has been updated successfully.',
        });
        router.refresh();
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast('Error', {
        description:
          'There was an error updating your profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-[#42C3EE]/20 pb-5">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#3069FE] to-[#42C3EE] bg-clip-text text-transparent">
          Provider Profile
        </h2>
        <p className="text-muted-foreground mt-2">
          Manage your company profile and information
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="transition-all duration-200 hover:shadow-md hover:shadow-[#3069FE]/10 p-4 rounded-lg border border-[#42C3EE]/20">
                  <FormLabel className="flex items-center text-[#3069FE] font-medium">
                    <Building className="h-4 w-4 mr-2 text-[#42C3EE]" />
                    Company Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your company name"
                      {...field}
                      className="border-[#42C3EE]/30 focus:border-[#3069FE] focus:ring-[#3069FE]/20"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="transition-all duration-200 hover:shadow-md hover:shadow-[#3069FE]/10 p-4 rounded-lg border border-[#42C3EE]/20">
                  <FormLabel className="flex items-center text-[#3069FE] font-medium">
                    <Mail className="h-4 w-4 mr-2 text-[#42C3EE]" />
                    Contact Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="contact@example.com"
                      {...field}
                      value={field.value || ''}
                      className="border-[#42C3EE]/30 focus:border-[#3069FE] focus:ring-[#3069FE]/20"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="transition-all duration-200 hover:shadow-md hover:shadow-[#3069FE]/10 p-4 rounded-lg border border-[#42C3EE]/20">
                  <FormLabel className="flex items-center text-[#3069FE] font-medium">
                    <Globe className="h-4 w-4 mr-2 text-[#42C3EE]" />
                    Website
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      {...field}
                      value={field.value || ''}
                      className="border-[#42C3EE]/30 focus:border-[#3069FE] focus:ring-[#3069FE]/20"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="transition-all duration-200 hover:shadow-md hover:shadow-[#3069FE]/10 p-4 rounded-lg border border-[#42C3EE]/20">
                  <FormLabel className="flex items-center text-[#3069FE] font-medium">
                    <Phone className="h-4 w-4 mr-2 text-[#42C3EE]" />
                    Phone
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      {...field}
                      value={field.value || ''}
                      className="border-[#42C3EE]/30 focus:border-[#3069FE] focus:ring-[#3069FE]/20"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem className="transition-all duration-200 hover:shadow-md hover:shadow-[#3069FE]/10 p-4 rounded-lg border border-[#42C3EE]/20 md:col-span-2">
                  <FormLabel className="flex items-center text-[#3069FE] font-medium">
                    <ImageIcon className="h-4 w-4 mr-2 text-[#42C3EE]" />
                    Logo URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/logo.png"
                      {...field}
                      value={field.value || ''}
                      className="border-[#42C3EE]/30 focus:border-[#3069FE] focus:ring-[#3069FE]/20"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500 text-sm mt-1">
                    Provide a URL to your company logo (recommended size:
                    200x200px)
                  </FormDescription>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="transition-all duration-200 hover:shadow-md hover:shadow-[#3069FE]/10 p-4 rounded-lg border border-[#42C3EE]/20">
                <FormLabel className="flex items-center text-[#3069FE] font-medium">
                  Company Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your company and the solutions you provide..."
                    className="min-h-32 border-[#42C3EE]/30 focus:border-[#3069FE] focus:ring-[#3069FE]/20"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription className="text-gray-500 text-sm mt-1">
                  This description will be displayed on your provider profile
                  and solution listings
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-[#3069FE]/20 text-white font-medium px-6 py-2 rounded-md cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

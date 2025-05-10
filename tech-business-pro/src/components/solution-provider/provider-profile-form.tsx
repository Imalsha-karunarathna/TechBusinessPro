'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { createOrUpdateProvider } from '@/app/actions/provider-actions';
import { Loader2, X } from 'lucide-react';
import { insertSolutionProviderSchema } from '@/lib/db/schema';

type ProviderProfileFormValues = z.infer<typeof insertSolutionProviderSchema>;

// Available regions
const regions = [
  { label: 'North America', value: 'north_america' },
  { label: 'South America', value: 'south_america' },
  { label: 'Europe', value: 'europe' },
  { label: 'Asia', value: 'asia' },
  { label: 'Africa', value: 'africa' },
  { label: 'Australia/Oceania', value: 'oceania' },
  { label: 'Global', value: 'global' },
];

interface ProviderProfileFormProps {
  initialData?: Partial<ProviderProfileFormValues> & { id?: number };
}

export function ProviderProfileForm({ initialData }: ProviderProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Initialize form with default values or initial data
  const form = useForm<ProviderProfileFormValues>({
    resolver: zodResolver(insertSolutionProviderSchema),
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
      // Ensure regions_served is an array
      if (!Array.isArray(data.regions_served)) {
        data.regions_served = data.regions_served ? [data.regions_served] : [];
      }

      const result = await createOrUpdateProvider({
        ...data,
        id: initialData?.id,
      });

      if (result.success) {
        toast({
          title: 'Profile updated',
          description: 'Your provider profile has been updated successfully.',
        });
        router.refresh();
      } else {
        throw new Error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description:
          'There was an error updating your profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Add a region to the regions_served array
  const addRegion = (value: string) => {
    const currentValues = form.getValues('regions_served');
    const regionsArray = Array.isArray(currentValues)
      ? currentValues
      : currentValues
        ? [currentValues]
        : [];

    if (!regionsArray.includes(value)) {
      form.setValue('regions_served', [...regionsArray, value]);
    }
  };

  // Remove a region from the regions_served array
  const removeRegion = (value: string) => {
    const currentValues = form.getValues('regions_served');
    const regionsArray = Array.isArray(currentValues)
      ? currentValues
      : currentValues
        ? [currentValues]
        : [];

    form.setValue(
      'regions_served',
      regionsArray.filter((region) => region !== value),
    );
  };

  // Get the current regions as an array
  const getRegionsArray = () => {
    const regions = form.getValues('regions_served');
    return Array.isArray(regions) ? regions : regions ? [regions] : [];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Provider Profile</h2>
        <p className="text-muted-foreground">
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
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="contact@example.com"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/logo.png"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a URL to your company logo (recommended size:
                    200x200px)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="regions_served"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regions Served</FormLabel>
                  <Select onValueChange={(value) => addRegion(value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select regions" {...field} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.value} value={region.value}>
                          {region.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {getRegionsArray().length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {getRegionsArray().map((region) => (
                        <Badge
                          key={region}
                          variant="secondary"
                          className="px-2 py-1 bg-blue-100 text-blue-800"
                        >
                          {regions.find((r) => r.value === region)?.label ||
                            region}
                          <button
                            type="button"
                            className="ml-1 text-blue-600 hover:text-blue-800"
                            onClick={() => removeRegion(region)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <FormDescription>
                    Select all regions where your solutions are available
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your company and the solutions you provide..."
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This description will be displayed on your provider profile
                  and solution listings
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

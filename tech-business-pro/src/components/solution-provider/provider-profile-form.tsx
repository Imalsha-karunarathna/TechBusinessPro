'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
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
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { insertSolutionProviderSchema } from '@/lib/db/schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createOrUpdateProvider } from '@/app/actions/provider-actions';
import { useRouter } from 'next/navigation';

type ProfileFormValues = z.infer<typeof insertSolutionProviderSchema>;

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
  initialData?: ProfileFormValues;
}

export function ProviderProfileForm({ initialData }: ProviderProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(insertSolutionProviderSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      description: '',
      website: '',
      phone: '',
      logo_url: '',
      regions_served: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    console.log('Form data submitted:', data);

    try {
      // Make sure regions_served is an array
      if (typeof data.regions_served === 'string') {
        data.regions_served = [data.regions_served];
      }

      const result = await createOrUpdateProvider(data);
      console.log('Server action result:', result);

      if (result.success) {
        toast({
          title: 'Profile updated',
          description: 'Your provider profile has been updated successfully.',
        });

        // Refresh the page to show updated data
        router.refresh();
      } else {
        throw new Error(result.error || 'Unknown error occurred');
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="contact@example.com" {...field} />
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
                <FormLabel>Region Served</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange([value])}
                  value={field.value?.[0] || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a region" />
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
                <FormDescription>
                  Select the region where your solutions are available
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
                This description will be displayed on your provider profile and
                solution listings
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} className="cursor-pointer">
            {isLoading ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

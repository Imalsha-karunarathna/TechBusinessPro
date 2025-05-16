'use client';

import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { getAllExpertiseCategories } from '@/app/actions/expertise-actions';

const formSchema = z.object({
  expertise: z.string().min(2, {
    message: 'Expertise must be at least 2 characters.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddExpertiseFormProps {
  onSubmit: (expertise: string) => void;
  onCancel: () => void;
  existingExpertise?: string[];
}

export function AddExpertiseForm({
  onSubmit,
  onCancel,
  existingExpertise = [],
}: AddExpertiseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expertiseOptions, setExpertiseOptions] = useState<string[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [customExpertise, setCustomExpertise] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expertise: '',
    },
  });

  useEffect(() => {
    async function fetchExpertiseOptions() {
      try {
        setIsLoadingOptions(true);
        const result = await getAllExpertiseCategories();
        if (result.success) {
          // Filter out expertise that already exists in the provider's profile
          const filteredOptions = result.data?.filter(
            (option) => !existingExpertise.includes(option),
          );
          setExpertiseOptions(filteredOptions || []);
        }
      } catch (error) {
        console.error('Error fetching expertise options:', error);
      } finally {
        setIsLoadingOptions(false);
      }
    }

    fetchExpertiseOptions();
  }, [existingExpertise]);

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values.expertise);
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {!customExpertise ? (
          <FormField
            control={form.control}
            name="expertise"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Expertise</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoadingOptions}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-700">
                      <SelectValue placeholder="Select an expertise" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-700 text-white">
                    {isLoadingOptions ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading...
                      </div>
                    ) : expertiseOptions.length === 0 ? (
                      <div className="p-2 text-sm text-gray-500">
                        No available expertise options. Try adding a custom one.
                      </div>
                    ) : (
                      expertiseOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select from existing expertise categories or{' '}
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => setCustomExpertise(true)}
                  >
                    add a custom one
                  </Button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="expertise"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Expertise</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your expertise" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a custom expertise or{' '}
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => setCustomExpertise(false)}
                  >
                    select from existing ones
                  </Button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={onCancel}
            className="cursor-pointer bg-red-500"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer bg-green-600"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Add Expertise'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

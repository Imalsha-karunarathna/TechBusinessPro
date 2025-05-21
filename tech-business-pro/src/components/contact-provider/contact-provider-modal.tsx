'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/auth';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sendContactRequest } from '@/app/actions/contact-provider-action';
import { timeSlots } from '@/lib/constants';
import { toast } from 'sonner';

const contactFormSchema = z.object({
  requirements: z
    .string()
    .min(10, 'Please describe your requirements in at least 10 characters'),
  preferredDate: z.date().min(new Date(), 'Please select a future date'),
  preferredTimeSlot: z.string().min(1, 'Please select a time slot'),
  urgency: z.enum(['low', 'medium', 'high']),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  budget: z.string().optional(),
  additionalInfo: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms to proceed',
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerId: number;
  providerName: string;
}

export function ContactProviderModal({
  isOpen,
  onClose,
  providerId,
  providerName,
}: ContactProviderModalProps) {
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      requirements: '',
      preferredDate: new Date(),
      preferredTimeSlot: '',
      urgency: 'medium',
      phone: '',
      companyName: '',
      budget: '',
      additionalInfo: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      const result = await sendContactRequest({
        providerId,
        seekerId: user.id,
        providerName: providerName || 'Unknown',
        seekerName: user.name || 'Unknown',
        seekerEmail: user.email,
        requirements: data.requirements,
        preferredDate: data.preferredDate.toISOString(),
        preferredTimeSlot: data.preferredTimeSlot,
        urgency: data.urgency,
        phone: data.phone || '',
        companyName: data.companyName || '',
        budget: data.budget || '',
        additionalInfo: data.additionalInfo || '',
        status: 'pending',
      });

      if (result.success) {
        toast('Request sent successfully', {
          description: `Your request has been sent to ${providerName}. They will contact you soon.`,
        });
        onClose();
        form.reset();
      } else {
        toast('Error sending request', {
          description: `An error occurred. Please try again.`,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast('Error sending request', {
        description: `An error occurred. Please try again.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Contact {providerName}</DialogTitle>
          <DialogDescription>
            Fill out this form to contact the solution provider. They will
            receive your request and get back to you.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Requirements <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your requirements or questions in detail..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be specific about what you&apos;re looking for to get the
                    best response.
                  </FormDescription>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="preferredDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Preferred Meeting Date{' '}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      {/* <PopoverContent className="bg-amber-100 " align="start"> */}
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date: Date) => date < new Date()}
                        initialFocus
                      />
                      {/* </PopoverContent> */}
                    </Popover>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredTimeSlot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Preferred Time Slot{' '}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time slot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-50 bg-amber-50">
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="urgency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Urgency Level <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="flex space-x-4">
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="radio"
                          checked={field.value === 'low'}
                          onChange={() => field.onChange('low')}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Low
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="radio"
                          checked={field.value === 'medium'}
                          onChange={() => field.onChange('medium')}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Medium
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="radio"
                          checked={field.value === 'high'}
                          onChange={() => field.onChange('high')}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        High
                      </FormLabel>
                    </FormItem>
                  </div>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your contact number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a phone number if you prefer to be contacted that
                      way
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your company name" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Range</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., $5,000 - $10,000" {...field} />
                  </FormControl>
                  <FormDescription>
                    Optional: Provide a budget range for your project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any other details that might be helpful..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className=" flex flex-col">
                    <FormLabel>
                      I agree that my contact information will be shared with
                      the solution provider
                    </FormLabel>
                    <FormMessage className="text-red-500" />
                    <FormDescription className="mt-5">
                      Your information will only be used for the purpose of
                      responding to this inquiry
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                className="bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Request'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

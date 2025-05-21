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
import {
  CalendarIcon,
  Loader2,
  MessageSquare,
  Clock,
  AlertTriangle,
  Phone,
  Building,
  DollarSign,
  FileText,
  CheckCircle2,
  CalendarPlus2Icon as CalendarIcon2,
  Clock3,
} from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto border border-[#42C3EE]/20 shadow-lg rounded-xl p-0 bg-white">
        <DialogHeader className="bg-gradient-to-r from-[#3069FE] to-[#42C3EE] text-white p-6 rounded-t-xl">
          <DialogTitle className="text-2xl font-bold flex items-center">
            <MessageSquare className="h-6 w-6 mr-2" />
            Contact {providerName}
          </DialogTitle>
          <DialogDescription className="text-white/90 mt-2">
            Fill out this form to contact the solution provider. They will
            receive your request and get back to you.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-[#3069FE] font-medium">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Requirements <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your requirements or questions in detail..."
                        className="min-h-[120px] border-[#42C3EE]/30 focus:border-[#3069FE] focus:ring-[#3069FE]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500 text-sm">
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
                      <FormLabel className="flex items-center text-[#3069FE] font-medium">
                        <CalendarIcon2 className="h-4 w-4 mr-2" />
                        Preferred Meeting Date{' '}
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'pl-3 text-left font-normal border-[#42C3EE]/30 hover:bg-[#3069FE]/5 hover:border-[#3069FE]',
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
                        {/* <PopoverContent
                          className="bg-white border border-[#42C3EE]/20 p-0"
                          align="start"
                        > */}
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date: Date) => date < new Date()}
                          initialFocus
                          className="rounded-md border-0"
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
                      <FormLabel className="flex items-center text-[#3069FE] font-medium">
                        <Clock3 className="h-4 w-4 mr-2" />
                        Preferred Time Slot{' '}
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-[#42C3EE]/30 focus:ring-[#3069FE] focus:border-[#3069FE]">
                            <SelectValue placeholder="Select a time slot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border border-[#42C3EE]/20">
                          {timeSlots.map((slot) => (
                            <SelectItem
                              key={slot}
                              value={slot}
                              className="hover:bg-[#3069FE]/5"
                            >
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-[#42C3EE]" />
                                {slot}
                              </div>
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
                  <FormItem className="bg-gray-50 p-4 rounded-lg border border-[#42C3EE]/20">
                    <FormLabel className="flex items-center text-[#3069FE] font-medium">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Urgency Level <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <FormItem
                        className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-all ${
                          field.value === 'low'
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => field.onChange('low')}
                      >
                        <FormControl>
                          <input
                            type="radio"
                            checked={field.value === 'low'}
                            onChange={() => field.onChange('low')}
                            className="text-green-500 focus:ring-green-500"
                          />
                        </FormControl>
                        <div>
                          <FormLabel className="font-medium cursor-pointer mb-0">
                            Low
                          </FormLabel>
                          <p className="text-xs text-gray-500">
                            Not time-sensitive
                          </p>
                        </div>
                      </FormItem>

                      <FormItem
                        className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-all ${
                          field.value === 'medium'
                            ? 'bg-blue-50 border border-blue-200'
                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => field.onChange('medium')}
                      >
                        <FormControl>
                          <input
                            type="radio"
                            checked={field.value === 'medium'}
                            onChange={() => field.onChange('medium')}
                            className="text-blue-500 focus:ring-blue-500"
                          />
                        </FormControl>
                        <div>
                          <FormLabel className="font-medium cursor-pointer mb-0">
                            Medium
                          </FormLabel>
                          <p className="text-xs text-gray-500">
                            Somewhat urgent
                          </p>
                        </div>
                      </FormItem>

                      <FormItem
                        className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-all ${
                          field.value === 'high'
                            ? 'bg-red-50 border border-red-200'
                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => field.onChange('high')}
                      >
                        <FormControl>
                          <input
                            type="radio"
                            checked={field.value === 'high'}
                            onChange={() => field.onChange('high')}
                            className="text-red-500 focus:ring-red-500"
                          />
                        </FormControl>
                        <div>
                          <FormLabel className="font-medium cursor-pointer mb-0">
                            High
                          </FormLabel>
                          <p className="text-xs text-gray-500">
                            Very time-sensitive
                          </p>
                        </div>
                      </FormItem>
                    </div>
                    <FormMessage className="text-red-500 mt-2" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-[#3069FE] font-medium">
                        <Phone className="h-4 w-4 mr-2" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your contact number"
                          {...field}
                          className="border-[#42C3EE]/30 focus:border-[#3069FE] focus:ring-[#3069FE]"
                        />
                      </FormControl>
                      {/* <FormDescription className="text-gray-500 text-sm">
                        Provide a phone number if you prefer to be contacted
                        that way
                      </FormDescription> */}
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-[#3069FE] font-medium">
                        <Building className="h-4 w-4 mr-2" />
                        Company Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your company name"
                          {...field}
                          className="border-[#42C3EE]/30 focus:border-[#3069FE] focus:ring-[#3069FE]"
                        />
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
                    <FormLabel className="flex items-center text-[#3069FE] font-medium">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Budget Range
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., $5,000 - $10,000"
                        {...field}
                        className="border-[#42C3EE]/30 focus:border-[#3069FE] focus:ring-[#3069FE]"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500 text-sm">
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
                    <FormLabel className="flex items-center text-[#3069FE] font-medium">
                      <FileText className="h-4 w-4 mr-2" />
                      Additional Information
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any other details that might be helpful..."
                        {...field}
                        className="border-[#42C3EE]/30 focus:border-[#3069FE] focus:ring-[#3069FE]"
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
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-[#3069FE]/5 p-4 rounded-lg border border-[#42C3EE]/20">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#3069FE] data-[state=checked]:border-[#3069FE]"
                      />
                    </FormControl>
                    <div className="flex flex-col">
                      <FormLabel className="font-medium">
                        I agree that my contact information will be shared with
                        the solution provider
                      </FormLabel>
                      <FormMessage className="text-red-500" />
                      <FormDescription className="mt-2 text-gray-500 text-sm">
                        Your information will only be used for the purpose of
                        responding to this inquiry
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="bg-gray-50 p-4 rounded-lg border border-[#42C3EE]/20 mt-6">
                <div className="flex items-center mb-3">
                  <CheckCircle2 className="h-5 w-5 text-[#3069FE] mr-2" />
                  <h3 className="font-medium text-gray-900">Request Summary</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="bg-[#3069FE]/10 text-[#3069FE] border-[#42C3EE]/30"
                    >
                      <CalendarIcon2 className="h-3.5 w-3.5 mr-1.5" />
                      {format(
                        form.getValues().preferredDate || new Date(),
                        'PPP',
                      )}
                    </Badge>
                    {form.getValues().preferredTimeSlot && (
                      <Badge
                        variant="outline"
                        className="bg-[#3069FE]/10 text-[#3069FE] border-[#42C3EE]/30"
                      >
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        {form.getValues().preferredTimeSlot}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={cn('border', {
                        'bg-green-50 text-green-700 border-green-200':
                          form.getValues().urgency === 'low',
                        'bg-blue-50 text-blue-700 border-blue-200':
                          form.getValues().urgency === 'medium',
                        'bg-red-50 text-red-700 border-red-200':
                          form.getValues().urgency === 'high',
                      })}
                    >
                      <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                      {form.getValues().urgency.charAt(0).toUpperCase() +
                        form.getValues().urgency.slice(1)}{' '}
                      Urgency
                    </Badge>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:opacity-90 text-white w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Request
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
  Upload,
  File,
  X,
  Paperclip,
  Globe,
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
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { sendContactRequestWithFiles } from '@/app/actions/contact-provider-action';

// Define time slots with timezone information
const timeSlots = [
  { value: '9:00 AM - 10:00 AM', label: '9:00 AM - 10:00 AM (AEST/AEDT)' },
  { value: '10:00 AM - 11:00 AM', label: '10:00 AM - 11:00 AM (AEST/AEDT)' },
  { value: '11:00 AM - 12:00 PM', label: '11:00 AM - 12:00 PM (AEST/AEDT)' },
  { value: '12:00 PM - 1:00 PM', label: '12:00 PM - 1:00 PM (AEST/AEDT)' },
  { value: '1:00 PM - 2:00 PM', label: '1:00 PM - 2:00 PM (AEST/AEDT)' },
  { value: '2:00 PM - 3:00 PM', label: '2:00 PM - 3:00 PM (AEST/AEDT)' },
  { value: '3:00 PM - 4:00 PM', label: '3:00 PM - 4:00 PM (AEST/AEDT)' },
  { value: '4:00 PM - 5:00 PM', label: '4:00 PM - 5:00 PM (AEST/AEDT)' },
  // Sri Lankan time (UTC+5:30)
  { value: '9:00 AM - 10:00 AM (SLT)', label: '9:00 AM - 10:00 AM (SLT)' },
  { value: '10:00 AM - 11:00 AM (SLT)', label: '10:00 AM - 11:00 AM (SLT)' },
  { value: '11:00 AM - 12:00 PM (SLT)', label: '11:00 AM - 12:00 PM (SLT)' },
  { value: '12:00 PM - 1:00 PM (SLT)', label: '12:00 PM - 1:00 PM (SLT)' },
  { value: '1:00 PM - 2:00 PM (SLT)', label: '1:00 PM - 2:00 PM (SLT)' },
  { value: '2:00 PM - 3:00 PM (SLT)', label: '2:00 PM - 3:00 PM (SLT)' },
  { value: '3:00 PM - 4:00 PM (SLT)', label: '3:00 PM - 4:00 PM (SLT)' },
  { value: '4:00 PM - 5:00 PM (SLT)', label: '4:00 PM - 5:00 PM (SLT)' },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
];

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
  // We'll handle file validation separately since it's not directly part of the form data
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [summaryValues, setSummaryValues] = useState({
    preferredDate: new Date(),
    preferredTimeSlot: '',
    urgency: 'medium',
  });

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

  // Watch form values for summary updates
  const watchedValues = useWatch({
    control: form.control,
    name: ['preferredDate', 'preferredTimeSlot', 'urgency'],
  });

  // Update summary when form values change
  useEffect(() => {
    setSummaryValues({
      preferredDate: watchedValues[0] || new Date(),
      preferredTimeSlot: watchedValues[1] || '',
      urgency: watchedValues[2] || 'medium',
    });
  }, [watchedValues]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const selectedFiles = Array.from(e.target.files || []);

    // Validate file types and sizes
    for (const file of selectedFiles) {
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        setFileError(
          'Invalid file type. Please upload PDF, Word, Excel, or image files.',
        );
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setFileError('File size exceeds 5MB limit.');
        return;
      }
    }

    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ContactFormValues) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      // First check if there's an existing pending request
      const checkResponse = await fetch(`/api/admin/contact-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seekerId: user.id,
          providerId: providerId,
        }),
      });

      const checkResult = await checkResponse.json();

      if (checkResult.exists) {
        toast('Request already exists', {
          description:
            'You already have a pending request with this provider. Please wait for a response.',
        });
        setIsSubmitting(false);
        return;
      }

      // Create FormData to handle file uploads
      const formData = new FormData();

      // Add form data
      formData.append('providerId', providerId.toString());
      formData.append('seekerId', user.id.toString());
      formData.append('providerName', providerName || 'Unknown');
      formData.append('seekerName', user.name || 'Unknown');
      formData.append('seekerEmail', user.email);
      formData.append('requirements', data.requirements);
      formData.append('preferredDate', data.preferredDate.toISOString());
      formData.append('preferredTimeSlot', data.preferredTimeSlot);
      formData.append('urgency', data.urgency);
      formData.append('phone', data.phone || '');
      formData.append('companyName', data.companyName || '');
      formData.append('budget', data.budget || '');
      formData.append('additionalInfo', data.additionalInfo || '');
      formData.append('status', 'pending');

      // Add files
      files.forEach((file) => {
        formData.append('files', file);
      });

      // Send the request with files using the server action
      const result = await sendContactRequestWithFiles(formData);

      if (result.success) {
        toast('Request sent successfully', {
          description: `Your request has been sent to ${providerName}. They will contact you soon.`,
        });
        onClose();
        form.reset();
        setFiles([]);
      } else {
        toast('Error sending request', {
          description: result.error || 'An error occurred. Please try again.',
        });
      }
      /*eslint-disable @typescript-eslint/no-unused-vars */
    } catch (error) {
      toast('Error sending request', {
        description: `An error occurred. Please try again.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setFileError(null);
    const droppedFiles = Array.from(e.dataTransfer.files);

    // Validate file types and sizes
    for (const file of droppedFiles) {
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        setFileError(
          'Invalid file type. Please upload PDF, Word, Excel, or image files.',
        );
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setFileError('File size exceeds 5MB limit.');
        return;
      }
    }

    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  // Get the display label for a time slot
  const getTimeSlotLabel = (value: string) => {
    const slot = timeSlots.find((slot) => slot.value === value);
    return slot ? slot.label : value;
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
                        {/* <PopoverContent className="w-auto p-0" align="start"> */}
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
                        <SelectContent className="bg-white border border-[#42C3EE]/20 max-h-[300px]">
                          <div className="p-2 border-b border-[#42C3EE]/20">
                            <div className="flex items-center text-sm font-medium text-[#3069FE]">
                              <Globe className="h-4 w-4 mr-1.5 text-[#42C3EE]" />
                              Australian Eastern Time
                            </div>
                          </div>
                          {timeSlots.slice(0, 8).map((slot) => (
                            <SelectItem
                              key={slot.value}
                              value={slot.value}
                              className="hover:bg-[#3069FE]/5"
                            >
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-[#42C3EE]" />
                                {slot.label}
                              </div>
                            </SelectItem>
                          ))}
                          <div className="p-2 border-t border-b border-[#42C3EE]/20 mt-1">
                            <div className="flex items-center text-sm font-medium text-[#3069FE]">
                              <Globe className="h-4 w-4 mr-1.5 text-[#42C3EE]" />
                              Sri Lanka Time
                            </div>
                          </div>
                          {timeSlots.slice(8).map((slot) => (
                            <SelectItem
                              key={slot.value}
                              value={slot.value}
                              className="hover:bg-[#3069FE]/5"
                            >
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-[#42C3EE]" />
                                {slot.label}
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

              {/* Document Upload Section */}
              <div className="bg-gray-50 p-4 rounded-lg border border-[#42C3EE]/20">
                <div className="flex items-center mb-3">
                  <Paperclip className="h-4 w-4 mr-2 text-[#42C3EE]" />
                  <h3 className="text-sm font-medium text-[#3069FE]">
                    Attach Documents
                  </h3>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">
                    If you have any relevant documents, please upload them here.
                    Supported formats: PDF, Word, Excel, JPEG, PNG (max 5MB
                    each).
                  </p>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  />

                  <div
                    className="w-full border-dashed border-2 border-[#42C3EE]/40 bg-white hover:bg-[#3069FE]/5 hover:border-[#3069FE] py-6 rounded-md"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="mx-auto flex flex-col items-center justify-center border-0 bg-transparent shadow-none hover:bg-transparent"
                    >
                      <Upload className="h-6 w-6 mb-2 text-[#42C3EE]" />
                      <span className="text-sm font-medium">
                        Click to upload files
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        or drag and drop
                      </span>
                    </Button>
                  </div>

                  {fileError && (
                    <p className="text-sm text-red-500 mt-2">{fileError}</p>
                  )}
                </div>

                {files.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <h4 className="text-sm font-medium text-gray-700">
                      Attached Files:
                    </h4>
                    <div className="max-h-40 overflow-y-auto">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white p-2 rounded-md border border-[#42C3EE]/20 mb-2"
                        >
                          <div className="flex items-center">
                            <File className="h-4 w-4 mr-2 text-[#42C3EE]" />
                            <span className="text-sm truncate max-w-[200px]">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove file</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

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
                      {format(summaryValues.preferredDate, 'PPP')}
                    </Badge>
                    {summaryValues.preferredTimeSlot && (
                      <Badge
                        variant="outline"
                        className="bg-[#3069FE]/10 text-[#3069FE] border-[#42C3EE]/30"
                      >
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        {getTimeSlotLabel(summaryValues.preferredTimeSlot)}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={cn('border', {
                        'bg-green-50 text-green-700 border-green-200':
                          summaryValues.urgency === 'low',
                        'bg-blue-50 text-blue-700 border-blue-200':
                          summaryValues.urgency === 'medium',
                        'bg-red-50 text-red-700 border-red-200':
                          summaryValues.urgency === 'high',
                      })}
                    >
                      <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                      {summaryValues.urgency.charAt(0).toUpperCase() +
                        summaryValues.urgency.slice(1)}{' '}
                      Urgency
                    </Badge>
                    {files.length > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-[#3069FE]/10 text-[#3069FE] border-[#42C3EE]/30"
                      >
                        <Paperclip className="h-3.5 w-3.5 mr-1.5" />
                        {files.length}{' '}
                        {files.length === 1 ? 'Document' : 'Documents'}
                      </Badge>
                    )}
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

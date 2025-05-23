'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ContactInquiry } from '@/lib/types';
import {
  INQUIRY_TYPES,
  SOLUTION_TYPES,
  CONTACT_METHODS,
} from '@/lib/constants';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  User,
  Mail,
  Phone,
  HelpCircle,
  MessageSquare,
  Send,
  Bot,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  inquiry_type: z
    .string()
    .min(1, { message: 'Please select an inquiry type.' }),
  subject: z
    .string()
    .min(3, { message: 'Subject must be at least 3 characters.' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters.' }),
  solution_type: z.string().optional(),
  preferred_contact: z.string().optional(),
});

const ContactSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const form = useForm<ContactInquiry>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      inquiry_type: '',
      subject: '',
      message: '',
      solution_type: '',
      preferred_contact: '',
    },
  });

  const inquiryType = form.watch('inquiry_type');

  useEffect(() => {
    // Reset solution_type when inquiry_type changes
    if (inquiryType !== 'Solution Request') {
      form.setValue('solution_type', '');
    }
  }, [inquiryType, form]);

  const mutation = useMutation({
    mutationFn: async (data: ContactInquiry) => {
      const response = await apiRequest('POST', '/api/contact-inquiries', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast('Inquiry Submitted', {
        description: "We've received your message and will respond shortly.",
      });
      setIsSubmitted(true);
      if (data.inquiry && data.inquiry.ai_response) {
        setAiResponse(data.inquiry.ai_response);
      }
    },
    onError: (error) => {
      toast('Submission Failed', {
        description: error.message || 'Please try again later.',
      });
    },
  });

  const onSubmit = (data: ContactInquiry) => {
    mutation.mutate(data);
  };

  return (
    <div id="contact" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 bg-white py-1 text-sm font-medium rounded-lg  text-[#3069FE] mb-4">
            Get in Touch
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-800 sm:text-5xl">
            Let Tech Mista Assist You
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Complete the form below to receive an AI-powered response with
            potential solutions tailored to your needs.
          </p>
        </div>

        <div className="mt-12">
          <div className="lg:col-span-7">
            <Card className="border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#3069FE] to-[#42C3EE] text-white p-8 rounded-xl">
                <CardTitle className="text-2xl font-bold">Contact Us</CardTitle>
                <CardDescription className="text-white text-opacity-90">
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8">
                {isSubmitted ? (
                  <div className="text-center py-10">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 text-green-600 mb-6">
                      <CheckCircle className="h-10 w-10" />
                    </div>
                    <h4 className="text-2xl font-bold mb-4">
                      Thank You for Contacting Us!
                    </h4>
                    <p className="text-gray-600 mb-6 text-lg">
                      Your inquiry has been received and we&apos;ll get back to
                      you shortly.
                    </p>

                    {aiResponse && (
                      <div className="bg-purple-50 rounded-lg border border-purple-200 p-6 text-left">
                        <div className="flex items-center mb-3">
                          <Bot className="h-5 w-5 mr-2 text-[#3069FE]" />
                          <h5 className="font-semibold text-[#3069FE]">
                            AI-Generated Initial Response:
                          </h5>
                        </div>
                        <p className="text-gray-700">{aiResponse}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  required
                                  {...field}
                                  className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE]"
                                  placeholder="Your full name"
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
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                Email Address
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  required
                                  {...field}
                                  className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE]"
                                  placeholder="you@example.com"
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
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-500" />
                                Phone Number (Optional)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  {...field}
                                  className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE]"
                                  placeholder="+1 (555) 123-4567"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="inquiry_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <HelpCircle className="h-4 w-4 text-gray-500" />
                                Inquiry Type
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                required
                              >
                                <FormControl>
                                  <SelectTrigger className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE]">
                                    <SelectValue placeholder="Select inquiry type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white">
                                  {INQUIRY_TYPES.map((type) => (
                                    <SelectItem
                                      key={type.value}
                                      value={type.value}
                                      className="hover:bg-purple-50 cursor-pointer"
                                    >
                                      {type.label}
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
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-gray-500" />
                              Subject
                            </FormLabel>
                            <FormControl>
                              <Input
                                required
                                {...field}
                                className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE]"
                                placeholder="Brief description of your inquiry"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-gray-500" />
                              Message
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                rows={4}
                                required
                                {...field}
                                placeholder="Please describe your inquiry in detail"
                                className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE] resize-none"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      {inquiryType === 'Solution Request' && (
                        <FormField
                          control={form.control}
                          name="solution_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <HelpCircle className="h-4 w-4 text-gray-500" />
                                Preferred Solution Type
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE]">
                                    <SelectValue placeholder="Select solution type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white">
                                  {SOLUTION_TYPES.map((type) => (
                                    <SelectItem
                                      key={type.value}
                                      value={type.value}
                                      className="hover:bg-purple-50 cursor-pointer"
                                    >
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="preferred_contact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              Preferred Contact Method
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE]">
                                  <SelectValue placeholder="Select contact method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white">
                                {CONTACT_METHODS.map((method) => (
                                  <SelectItem
                                    key={method.value}
                                    value={method.value}
                                    className="hover:bg-purple-50 cursor-pointer"
                                  >
                                    {method.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full py-6 bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:from-[#42C3EE] hover:to-[#3069FE] text-white font-medium rounded-md transition-all duration-200"
                        disabled={mutation.isPending}
                      >
                        {mutation.isPending ? (
                          <div className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Submitting...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Send className="h-5 w-5 mr-2" />
                            Submit Request
                          </div>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;

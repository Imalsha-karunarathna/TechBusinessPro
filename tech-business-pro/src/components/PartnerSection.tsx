'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import {
  Briefcase,
  Globe,
  Users,
  CheckCircle,
  Building,
  User,
  Mail,
  Phone,
  Globe2,
  Award,
  FileText,
  Clock,
  MessageSquare,
} from 'lucide-react';
import Image from 'next/image';

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';

const partnerFormSchema = z.object({
  partner_name: z
    .string()
    .min(2, { message: 'Partner name must be at least 2 characters.' }),
  organization_name: z
    .string()
    .min(2, { message: 'Organization name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  website: z.string().url({ message: 'Please enter a valid URL.' }).optional(),
  expertise: z.union([
    z
      .string()
      .min(1, { message: 'Please select at least one area of expertise.' }),
    z
      .array(z.string())
      .min(1, { message: 'Please select at least one area of expertise.' }),
  ]),
  description: z.string().min(3, {
    message: 'Please provide your Company description',
  }),
  designation: z.string().min(3, {
    message: 'Please provide your Job Title.',
  }),
  experience_years: z.number().int().positive().optional(),
  reason: z
    .string()
    .max(100, { message: 'Response should be 100 words or less.' })
    .optional(),
  additional_notes: z.string().optional(),
  accept_privacy: z.boolean().refine((val) => val === true, {
    message: 'You must accept the policy.',
  }),
});

type PartnerFormValues = z.infer<typeof partnerFormSchema>;

export function PartnerSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      partner_name: '',
      organization_name: '',
      email: '',
      phone: '',
      website: '',
      expertise: [],
      designation: '',
      experience_years: 0,
      reason: '',
      additional_notes: '',
      accept_privacy: false,
    },
  });

  async function onSubmit(data: PartnerFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/partner-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        toast('Application Submitted', {
          description:
            'Your partner application has been submitted successfully.',
        });
      } else {
        throw new Error(result.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast('Submission Failed', {
        description:
          'There was an error submitting your application. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div id="partner" className="py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-white text-sm font-medium rounded-lg text-[#3069FE] mb-4">
            Partnership Program
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Partner with Us &{' '}
            <span className="text-transparent bg-clip-text bg-[#3069FE]">
              Unlock Global Growth
            </span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Tap into international markets and expand your reach with strategic
            collaborations.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-start gap-8 lg:gap-12">
          <div className="w-full lg:w-5/12">
            {/* EOI Image */}
            <div className="relative mb-20 mt-20 rounded-2xl overflow-hidden shadow-xl transform transition-all hover:scale-105 duration-300">
              <Image
                src="/assets/EOI.jpg"
                alt="Partnership collaboration"
                width={600}
                height={400}
                className="w-full h-64 lg:h-80 object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  Join Our Global Network
                </h3>
                <p className="text-white/90">
                  Connect with businesses worldwide
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-105 duration-300">
              <div className="space-y-6 mb-10 mt-10">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-[#3069FE] to-[#42C3EE] text-white">
                      <Briefcase className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      Showcase Your Expertise
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Display your solutions and capabilities to a targeted
                      audience looking for your specific services.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-[#3069FE] to-[#42C3EE] text-white">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      Expand Your Client Base
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Reach new clients in Sri Lanka, Australia, and eventually
                      around the globe as we expand.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-[#3069FE] to-[#42C3EE] text-white">
                      <Globe className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      Access Premium Resources
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Get exclusive tools, insights, and support to help grow
                      your business and deliver better solutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-7/12">
            <Card className="border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#3069FE] to-[#42C3EE] text-white p-8 rounded-xl">
                <CardTitle className="text-2xl font-bold">
                  Expression of Interest
                </CardTitle>
                <CardDescription className="text-white text-opacity-90">
                  Fill out the form below to join our partner network
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8">
                {isSubmitted ? (
                  <div className="text-center py-10">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 text-green-600 mb-6">
                      <CheckCircle className="h-10 w-10" />
                    </div>
                    <h4 className="text-2xl font-bold mb-4">
                      Thank You for Your Interest!
                    </h4>
                    <p className="text-gray-600 mb-6 text-lg">
                      Your expression of interest has been received. We&apos;ll
                      review your application and get back to you soon.
                    </p>
                  </div>
                ) : (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="partner_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                Partner Name
                              </FormLabel>
                              <FormControl>
                                <Input
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
                          name="organization_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-gray-500" />
                                Organization Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE]"
                                  placeholder="Your company name"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                Contact Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  {...field}
                                  className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE]"
                                  placeholder="you@company.com"
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
                                Contact Phone Number
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
                      </div>

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Globe2 className="h-4 w-4 text-gray-500" />
                              Website
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="url"
                                {...field}
                                className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE]"
                                placeholder="https://yourcompany.com"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="expertise"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-gray-500" />
                              Areas of Expertise
                            </FormLabel>
                            <div className="relative">
                              <Select
                                onValueChange={(value) => {
                                  // Convert single selection to array if it's the first selection
                                  const currentValues = Array.isArray(
                                    field.value,
                                  )
                                    ? field.value
                                    : field.value
                                      ? [field.value]
                                      : [];

                                  // If value is already selected, remove it, otherwise add it
                                  const newValues = currentValues.includes(
                                    value,
                                  )
                                    ? currentValues.filter((v) => v !== value)
                                    : [...currentValues, value];

                                  field.onChange(newValues);
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE]">
                                    <SelectValue
                                      placeholder={
                                        Array.isArray(field.value) &&
                                        field.value.length > 0
                                          ? `${field.value.length} area${field.value.length > 1 ? 's' : ''} selected`
                                          : 'Select expertise areas'
                                      }
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-[600px] bg-white">
                                  <SelectItem
                                    value="IT Security"
                                    className="hover:bg-purple-50 cursor-pointer"
                                  >
                                    IT Security
                                  </SelectItem>
                                  <SelectItem
                                    value="CRM Implementation"
                                    className="hover:bg-purple-50 cursor-pointer"
                                  >
                                    CRM Implementation
                                  </SelectItem>
                                  <SelectItem
                                    value="Web Development"
                                    className="hover:bg-purple-50 cursor-pointer"
                                  >
                                    Web Development
                                  </SelectItem>
                                  <SelectItem
                                    value="Business Applications"
                                    className="hover:bg-purple-50 cursor-pointer"
                                  >
                                    Business Applications
                                  </SelectItem>
                                  <SelectItem
                                    value="Cloud Computing"
                                    className="hover:bg-purple-50 cursor-pointer"
                                  >
                                    Cloud Computing
                                  </SelectItem>
                                  <SelectItem
                                    value="Data Analytics"
                                    className="hover:bg-purple-50 cursor-pointer"
                                  >
                                    Data Analytics
                                  </SelectItem>
                                  <SelectItem
                                    value="Artificial Intelligence"
                                    className="hover:bg-purple-50 cursor-pointer"
                                  >
                                    Artificial Intelligence
                                  </SelectItem>
                                  <SelectItem
                                    value="Other"
                                    className="hover:bg-purple-50 cursor-pointer"
                                  >
                                    Other
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {Array.isArray(field.value) &&
                              field.value.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {field.value.map((item) => (
                                    <Badge
                                      key={item}
                                      variant="secondary"
                                      className="px-3 py-1 bg-purple-100 text-[#3069FE] rounded-full"
                                    >
                                      {item}
                                      <button
                                        type="button"
                                        className="ml-2 text-[#3069FE] hover:text-[#3069FE]"
                                        onClick={() => {
                                          if (Array.isArray(field.value)) {
                                            field.onChange(
                                              field.value.filter(
                                                (v) => v !== item,
                                              ),
                                            );
                                          }
                                        }}
                                      >
                                        ×
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            <FormDescription className="text-gray-500 text-sm">
                              Select all areas that apply to your expertise
                            </FormDescription>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-500" />
                                Company Description
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  rows={3}
                                  {...field}
                                  placeholder="Tell us about your company"
                                  className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE] resize-none"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="designation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                Designation
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  rows={3}
                                  {...field}
                                  placeholder="Your role in the company"
                                  className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE] resize-none"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="experience_years"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                Years of Experience
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? Number.parseInt(e.target.value)
                                        : undefined,
                                    )
                                  }
                                  className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE]"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="reason"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-gray-500" />
                                Why Partner with Tech Mista?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  rows={3}
                                  {...field}
                                  placeholder="100 words max"
                                  className="border-gray-300 focus:border-[#3069FE] focus:ring-[#3069FE] resize-none"
                                />
                              </FormControl>
                              <FormDescription className="text-gray-500 text-sm">
                                Briefly explain why you want to partner with us
                              </FormDescription>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="accept_privacy"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center h-5">
                                <input
                                  type="checkbox"
                                  checked={field.value ?? false}
                                  onChange={field.onChange}
                                  id="accept_privacy"
                                  className="h-4 w-4 text-[#3069FE] border-gray-300 rounded focus:ring-[#3069FE]"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <FormLabel
                                  htmlFor="accept_privacy"
                                  className="text-sm text-gray-700 flex flex-wrap gap-1"
                                >
                                  I confirm that I have read, understood and
                                  accept the terms and conditions in the{' '}
                                  <a
                                    href="/privacy-policy"
                                    target="_blank"
                                    className="text-[#3069FE] underline hover:text-[#3069FE]"
                                    rel="noreferrer"
                                  >
                                    Privacy Policy
                                  </a>
                                  of Tech Mista
                                </FormLabel>
                                <FormMessage className="text-red-500 mt-1" />
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full cursor-pointer py-6 bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:from-[#42C3EE] hover:to-[#3069FE] text-white font-medium rounded-md transition-all duration-200"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
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
                          'Submit Application'
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
}

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Briefcase, Globe, Users } from 'lucide-react';

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
  const { toast } = useToast();
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
        toast({
          title: 'Application Submitted',
          description:
            'Your partner application has been submitted successfully.',
        });
      } else {
        throw new Error(result.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Submission Failed',
        description:
          'There was an error submitting your application. Please try again.',
        //variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div id="partner" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
              Become a Partner
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Partner with Us & Unlock Global Growth
            </p>
            <p className="mt-4 text-lg text-gray-500">
              Tap into international markets and expand your reach with
              strategic collaborations.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary-500 text-black">
                    <Briefcase className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Showcase Your Expertise
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Display your solutions and capabilities to a targeted
                    audience looking for your specific services.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary-500 text-black">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Expand Your Client Base
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Reach new clients in Sri Lanka, Australia, and eventually
                    around the globe as we expand.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary-500 text-black">
                    <Globe className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Access Premium Resources
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Get exclusive tools, insights, and support to help grow your
                    business and deliver better solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 lg:mt-0 bg-gray-50 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Expression of Interest
            </h3>
            {isSubmitted ? (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-2">
                  Thank You for Your Interest!
                </h4>
                <p className="text-gray-600 mb-4">
                  Your expression of interest has been received. We &apos;ll
                  review your application and get back to you soon.
                </p>
                <p className="text-gray-500 text-sm">
                  A confirmation email has been sent to your provided email
                  address.
                </p>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="partner_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Partner Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel>Organization Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
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
                          <FormLabel>Contact Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
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
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input type="url" {...field} />
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
                        <FormLabel>Areas of Expertise</FormLabel>
                        <div className="relative">
                          <Select
                            onValueChange={(value) => {
                              // Convert single selection to array if it's the first selection
                              const currentValues = Array.isArray(field.value)
                                ? field.value
                                : field.value
                                  ? [field.value]
                                  : [];

                              // If value is already selected, remove it, otherwise add it
                              const newValues = currentValues.includes(value)
                                ? currentValues.filter((v) => v !== value)
                                : [...currentValues, value];

                              field.onChange(newValues);
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className="text-gray-400">
                                <SelectValue
                                  className="placeholder:text-muted-foreground"
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
                                className="hover:bg-blue-500 cursor-pointer"
                              >
                                IT Security
                              </SelectItem>
                              <SelectItem
                                value="CRM Implementation"
                                className="hover:bg-blue-500 cursor-pointer"
                              >
                                CRM Implementation
                              </SelectItem>
                              <SelectItem
                                value="Web Development"
                                className="hover:bg-blue-500 cursor-pointer"
                              >
                                Web Development
                              </SelectItem>
                              <SelectItem
                                value="Business Applications"
                                className="hover:bg-blue-500 cursor-pointer"
                              >
                                Business Applications
                              </SelectItem>
                              <SelectItem
                                value="Cloud Computing"
                                className="hover:bg-blue-500 cursor-pointer"
                              >
                                Cloud Computing
                              </SelectItem>
                              <SelectItem
                                value="Data Analytics"
                                className="hover:bg-blue-500 cursor-pointer"
                              >
                                Data Analytics
                              </SelectItem>
                              <SelectItem
                                value="Artificial Intelligence"
                                className="hover:bg-blue-500 cursor-pointer"
                              >
                                Artificial Intelligence
                              </SelectItem>
                              <SelectItem
                                value="Other"
                                className="hover:bg-blue-500 cursor-pointer"
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
                                  className="px-2 py-1 bg-blue-100 text-blue-800"
                                >
                                  {item}
                                  <button
                                    type="button"
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                    onClick={() => {
                                      if (Array.isArray(field.value)) {
                                        field.onChange(
                                          field.value.filter((v) => v !== item),
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
                        <FormDescription>
                          Select all areas that apply to your expertise
                        </FormDescription>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Description</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            {...field}
                            placeholder="Describe your company here"
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
                        <FormLabel>Designation</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            {...field}
                            placeholder="Describe your job here"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experience_years"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
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
                        <FormLabel>
                          Why Partner with Tech Mista? (100 words max)
                        </FormLabel>
                        <FormControl>
                          <Textarea rows={3} {...field} />
                        </FormControl>
                        <FormDescription>
                          Briefly explain why you want to partner with us
                        </FormDescription>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accept_privacy"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start space-x-2">
                          <input
                            type="checkbox"
                            checked={field.value ?? false}
                            onChange={field.onChange}
                            id="accept_privacy"
                            className="mt-1"
                          />
                          <FormLabel
                            htmlFor="accept_privacy"
                            className="text-sm text-gray-700 flex flex-wrap gap-1"
                          >
                            I confirm that I have read, understood and accept
                            the terms and conditions in the&nbsp;
                            <a
                              href="/privacy-policy"
                              target="_blank"
                              className="text-blue-600 underline"
                            >
                              Privacy Policy
                            </a>
                            &nbsp;of Tech Mista
                          </FormLabel>
                        </div>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Globe } from "lucide-react";
import type { PartnerApplication } from "@/lib/types";
import { useState } from "react";

const partnerFormSchema = z.object({
  partner_name: z
    .string()
    .min(2, { message: "Partner name must be at least 2 characters." }),
  organization_name: z
    .string()
    .min(2, { message: "Organization name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL." }).optional(),
  expertise: z
    .string()
    .min(1, { message: "Please select an area of expertise." }),
  collaboration: z.string().min(10, {
    message: "Please provide details about your proposed collaboration.",
  }),
  experience_years: z.number().int().positive().optional(),
  reason: z
    .string()
    .max(100, { message: "Response should be 100 words or less." })
    .optional(),
  additional_notes: z.string().optional(),
});

const PartnerSection = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<PartnerApplication>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      partner_name: "",
      organization_name: "",
      email: "",
      phone: "",
      website: "",
      expertise: "",
      collaboration: "",
      experience_years: undefined,
      reason: "",
      additional_notes: "",
    },
  });

  async function onSubmit(data: PartnerApplication) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/partner-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        toast({
          title: "Application Submitted",
          description:
            "Your partner application has been submitted successfully.",
        });
      } else {
        throw new Error(result.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Failed",
        description:
          "There was an error submitting your application. Please try again.",
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
              Join Our Growing Network
            </p>
            <p className="mt-4 text-lg text-gray-500">
              Partner with Tech Mista to showcase your solutions and connect
              with businesses worldwide. We provide the platform while you
              provide the expertise.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary-500 text-white">
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
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary-500 text-white">
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
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary-500 text-white">
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
                  Your expression of interest has been received. We'll review
                  your application and get back to you soon.
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
                          <FormMessage />
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
                          <FormMessage />
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
                          <FormMessage />
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
                          <FormMessage />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expertise"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area of Expertise</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="text-gray-400">
                              <SelectValue
                                className="placeholder:text-muted-foreground"
                                placeholder="Select expertise area"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className=" max-h-[600px] bg-white">
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
                              value="Other"
                              className="hover:bg-blue-500 cursor-pointer"
                            >
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="collaboration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proposed Collaboration</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            {...field}
                            placeholder="Describe how you'd like to collaborate with Tech Mista"
                          />
                        </FormControl>
                        <FormMessage />
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
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-blue-500 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerSection;

"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ContactInquiry } from "@/lib/types";
import {
  INQUIRY_TYPES,
  SOLUTION_TYPES,
  CONTACT_METHODS,
} from "@/lib/constants";
import {
  Form,
  FormControl,
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
import { CheckIcon } from "lucide-react";
import Link from "next/link";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  inquiry_type: z
    .string()
    .min(1, { message: "Please select an inquiry type." }),
  subject: z
    .string()
    .min(3, { message: "Subject must be at least 3 characters." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
  solution_type: z.string().optional(),
  preferred_contact: z.string().optional(),
});

const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const form = useForm<ContactInquiry>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      inquiry_type: "",
      subject: "",
      message: "",
      solution_type: "",
      preferred_contact: "",
    },
  });

  const inquiryType = form.watch("inquiry_type");

  useEffect(() => {
    // Reset solution_type when inquiry_type changes
    if (inquiryType !== "Solution Request") {
      form.setValue("solution_type", "");
    }
  }, [inquiryType, form]);

  //   const mutation = useMutation({
  //     mutationFn: async (data: ContactInquiry) => {
  //       const response = await apiRequest("POST", "/api/contact-inquiries", data);
  //       return response.json();
  //     },
  //     onSuccess: (data) => {
  //       toast({
  //         title: "Inquiry Submitted",
  //         description: "We've received your message and will respond shortly.",
  //       });
  //       setIsSubmitted(true);
  //       if (data.inquiry && data.inquiry.ai_response) {
  //         setAiResponse(data.inquiry.ai_response);
  //       }
  //     },
  //     onError: (error) => {
  //       toast({
  //         title: "Submission Failed",
  //         description: error.message || "Please try again later.",
  //         //variant: "destructive",
  //       });
  //     },
  //   });

  //   const onSubmit = (data: ContactInquiry) => {
  //     mutation.mutate(data);
  //   };

  return (
    <div id="contact" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
            Contact Us
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Let Tech Mista Assist You
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Complete the form below to receive an AI-powered response with
            potential solutions tailored to your needs.
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="bg-gray-50 rounded-lg p-8">
              {isSubmitted ? (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                    <CheckIcon className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">
                    Thank You for Contacting Us!
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Your inquiry has been received and we'll get back to you
                    shortly.
                  </p>

                  {aiResponse && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6 text-left">
                      <h5 className="font-semibold mb-2">
                        AI-Generated Initial Response:
                      </h5>
                      <p className="text-gray-700">{aiResponse}</p>
                    </div>
                  )}
                </div>
              ) : (
                <Form {...form}>
                  <form
                    //onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input required {...field} />
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
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" required {...field} />
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
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input type="tel" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="inquiry_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Inquiry Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              required
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select inquiry type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {INQUIRY_TYPES.map((type) => (
                                  <SelectItem
                                    key={type.value}
                                    value={type.value}
                                  >
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input required {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              required
                              {...field}
                              placeholder="Please describe your inquiry in detail"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {inquiryType === "Solution Request" && (
                      <FormField
                        control={form.control}
                        name="solution_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Solution Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select solution type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SOLUTION_TYPES.map((type) => (
                                  <SelectItem
                                    key={type.value}
                                    value={type.value}
                                  >
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="preferred_contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Contact Method</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select contact method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CONTACT_METHODS.map((method) => (
                                <SelectItem
                                  key={method.value}
                                  value={method.value}
                                >
                                  {method.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-blue-500 text-white"
                      //disabled={mutation.isPending}
                    >
                      {/* {mutation.isPending ? "Submitting..." : "Submit Request"} */}
                      Submit Request
                    </Button>
                  </form>
                </Form>
              )}
            </div>

            <div>
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg p-8 h-full">
                <h3 className="text-xl font-bold mb-4">
                  AI-Powered Initial Response
                </h3>
                <p className="mb-6">
                  Once you submit the form, our AI system will analyze your
                  request and provide an instant initial response with suggested
                  solutions.
                </p>

                <div className="bg-white bg-opacity-10 rounded-lg p-6 mb-8">
                  <h4 className="font-bold mb-2">Example Response:</h4>
                  <p className="italic text-sm">
                    "Thank you for reaching out to Tech Mista! Based on your
                    request for IT Security Assessment, we recommend exploring
                    our tailored packages, including comprehensive vulnerability
                    scanning and penetration testing. A detailed overview has
                    been sent to your email for review."
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-white">
                        Instant acknowledgment of your request
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-white">
                        AI-suggested solutions based on your needs
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-white">
                        Relevant resources and next steps
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white border-opacity-20">
                  <h4 className="font-bold mb-4">Need immediate assistance?</h4>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <Link
                      href="mailto:support@techmista.com"
                      className="text-white hover:underline"
                    >
                      support@techmista.com
                    </Link>
                  </div>
                  <div className="flex items-center mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="text-white">+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;

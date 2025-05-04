"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

const providerRegistrationSchema = z
  .object({
    // User account details
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),

    // Provider details
    companyName: z
      .string()
      .min(2, "Company name must be at least 2 characters"),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters"),
    website: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
    phone: z.string().optional(),
    regions_served: z
      .array(z.string())
      .min(1, "Please select at least one region"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProviderRegistrationValues = z.infer<typeof providerRegistrationSchema>;

const regions = [
  { label: "North America", value: "north_america" },
  { label: "South America", value: "south_america" },
  { label: "Europe", value: "europe" },
  { label: "Asia", value: "asia" },
  { label: "Africa", value: "africa" },
  { label: "Australia/Oceania", value: "oceania" },
  { label: "Global", value: "global" },
];

export default function ProviderRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { registerMutation } = useAuth();

  const form = useForm<ProviderRegistrationValues>({
    resolver: zodResolver(providerRegistrationSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      description: "",
      website: "",
      phone: "",
      regions_served: [],
    },
  });

  async function onSubmit(data: ProviderRegistrationValues) {
    setIsLoading(true);
    try {
      // First register the user account
      await registerMutation.mutateAsync({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        //  role: "solution_provider",
      });

      // Then create the provider profile
      const providerResponse = await fetch("/api/solution-providers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.companyName,
          description: data.description,
          email: data.email,
          website: data.website,
          phone: data.phone,
          regions_served: data.regions_served,
        }),
      });

      if (!providerResponse.ok) {
        throw new Error("Failed to create provider profile");
      }

      toast({
        title: "Registration successful",
        description:
          "Your provider account has been created and is pending verification.",
      });

      router.push("/auth-page?registered=true");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description:
          "There was an error creating your provider account. Please try again.",
        // variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Become a Solution Provider</h1>
          <p className="text-gray-600 mt-2">
            Register your company to showcase your technology solutions on our
            marketplace
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Provider Registration</CardTitle>
            <CardDescription>
              Create your provider account and submit your company details for
              verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-lg font-medium border-b pb-2 mb-4">
                    Account Information
                  </h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} />
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
                            <Input
                              type="email"
                              placeholder="Your email address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4 col-span-full md:col-span-1">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Create a password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Confirm password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-medium border-b pb-2 mb-4">
                    Company Information
                  </h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="companyName"
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
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com"
                              {...field}
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
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="regions_served"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>Regions Served</FormLabel>
                          <FormControl>
                            {/* <MultiSelect
                              options={regions}
                              selected={field.value}
                              onChange={field.onChange}
                              placeholder="Select regions"
                            /> */}
                          </FormControl>
                          <FormDescription>
                            Select all regions where your solutions are
                            available
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>Company Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your company and the solutions you provide..."
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This description will be displayed on your provider
                            profile and solution listings
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <CardFooter className="flex justify-between px-0">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => router.push("/")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Register as Provider"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth-page"
              className="text-primary-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

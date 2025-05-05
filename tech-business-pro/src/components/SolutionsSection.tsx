'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  Star,
  Building2,
  Globe,
  Mail,
  MapPin,
  Verified,
} from 'lucide-react';

import { SOLUTION_CATEGORIES, CATEGORY_COLORS } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getAllProviders } from '@/app/actions/provider-actions';
import type { SolutionProvider } from '@/lib/db/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Type for solution with provider
interface Solution {
  id: number;
  title: string;
  description: string;
  category: string;
  provider_id: number;
  image_url?: string;
  regions?: string[];
  features?: string[];
  provider?: {
    id: number;
    name: string;
    description: string;
    email: string;
    verification_status: string;
    created_at: string;
    logo_url?: string;
    regions_served?: string[];
    rating?: number;
    reviews?: number;
  } | null;
}

const SolutionsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [providers, setProviders] = useState<SolutionProvider[]>([]);
  const [activeTab, setActiveTab] = useState<'solutions' | 'providers'>(
    'solutions',
  );

  // Fetch providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const result = await getAllProviders();
        if (result.success && result.data) {
          setProviders(result.data);
          console.log('Fetched providers:', result.data);
        }
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };

    fetchProviders();
  }, []);

  // Fetch solutions with category filter
  const { data: solutions, isLoading } = useQuery({
    queryKey: [
      selectedCategory === 'all'
        ? 'solutions'
        : `solutions-${selectedCategory}`,
    ],
    queryFn: async () => {
      const url =
        selectedCategory === 'all'
          ? '/api/solutions'
          : `/api/solutions?category=${selectedCategory}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch solutions');
      }
      return response.json() as Promise<Solution[]>;
    },
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const getCategoryLabel = (category: string) => {
    return (
      SOLUTION_CATEGORIES.find((c) => c.value === category)?.label || 'Other'
    );
  };

  const getCategoryColor = (category: string) => {
    const colorName =
      CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || 'gray';
    return {
      bg: `bg-${colorName}-100`,
      text: `text-${colorName}-800`,
    };
  };

  const getRegionLabel = (regionValue: string) => {
    const regions = [
      { label: 'North America', value: 'north_america' },
      { label: 'South America', value: 'south_america' },
      { label: 'Europe', value: 'europe' },
      { label: 'Asia', value: 'asia' },
      { label: 'Africa', value: 'africa' },
      { label: 'Australia/Oceania', value: 'oceania' },
      { label: 'Global', value: 'global' },
    ];

    return regions.find((r) => r.value === regionValue)?.label || regionValue;
  };

  return (
    <div id="solutions" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
            Solution Marketplace
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Find the Perfect Tech Solution
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Browse our curated collection of technology solutions and providers
            designed to address your business challenges.
          </p>
        </div>

        <div className="mt-10">
          <Tabs
            defaultValue="solutions"
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as 'solutions' | 'providers')
            }
            className="w-full"
          >
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger value="solutions">Solutions</TabsTrigger>
                <TabsTrigger value="providers">Solution Providers</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="solutions">
              <div className="flex flex-wrap justify-center mb-8 gap-2">
                <button
                  key="all"
                  className={`px-4 py-2 rounded-full font-medium text-sm ${
                    selectedCategory === 'all'
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } transition-colors`}
                  onClick={() => handleCategoryChange('all')}
                >
                  All Categories
                </button>
                {SOLUTION_CATEGORIES.map((category) => (
                  <button
                    key={category.value}
                    className={`px-4 py-2 rounded-full font-medium text-sm ${
                      selectedCategory === category.value
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } transition-colors`}
                    onClick={() => handleCategoryChange(category.value)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                {isLoading ? (
                  // Skeleton loading state
                  Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <Card
                        key={index}
                        className="overflow-hidden border-gray-200 h-full"
                      >
                        <div className="aspect-video w-full bg-gray-100">
                          <Skeleton className="h-full w-full" />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center mb-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-5 w-32" />
                          </div>
                          <Skeleton className="h-7 w-full mb-2" />
                        </CardHeader>
                        <CardContent className="pb-4">
                          <Skeleton className="h-20 w-full mb-4" />
                          <div className="flex gap-2 mt-4">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-20" />
                          </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4 flex justify-between">
                          <div className="flex items-center">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-5 w-28 ml-2" />
                          </div>
                          <Skeleton className="h-9 w-32" />
                        </CardFooter>
                      </Card>
                    ))
                ) : solutions && solutions.length > 0 ? (
                  solutions.map((solution) => (
                    <Card
                      key={solution.id}
                      className="overflow-hidden border-gray-200 h-full flex flex-col hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-video w-full overflow-hidden bg-gray-100">
                        <img
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                          src={
                            solution.image_url ||
                            '/placeholder.svg?height=200&width=400'
                          }
                          alt={solution.title}
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center mb-2">
                          <Badge
                            variant="outline"
                            className={`${
                              getCategoryColor(solution.category).bg
                            } ${
                              getCategoryColor(solution.category).text
                            } border-0`}
                          >
                            {getCategoryLabel(solution.category)}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {solution.regions?.join(' & ') || 'Global'}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                          {solution.title}
                        </h3>
                      </CardHeader>
                      <CardContent className="pb-4 flex-grow">
                        <p className="text-gray-600 line-clamp-3 mb-4">
                          {solution.description}
                        </p>
                        {solution.features && solution.features.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {solution.features
                              .slice(0, 3)
                              .map((feature, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-gray-100 text-gray-700"
                                >
                                  {feature}
                                </Badge>
                              ))}
                            {solution.features.length > 3 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      variant="secondary"
                                      className="bg-gray-100 text-gray-700 cursor-help"
                                    >
                                      +{solution.features.length - 3} more
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <ul className="list-disc pl-4">
                                      {solution.features
                                        .slice(3)
                                        .map((feature, index) => (
                                          <li key={index}>{feature}</li>
                                        ))}
                                    </ul>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between items-center">
                        <div className="flex items-center">
                          {solution.provider ? (
                            <>
                              {solution.provider.logo_url ? (
                                <img
                                  src={
                                    solution.provider.logo_url ||
                                    '/placeholder.svg'
                                  }
                                  alt={solution.provider.name}
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                  <span className="text-xs font-medium text-primary-800">
                                    {solution.provider.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                              <div className="ml-2">
                                <Link
                                  href={`/providers/${solution.provider.id}`}
                                  className="text-sm font-medium text-gray-700 block leading-tight hover:text-primary-600"
                                >
                                  {solution.provider.name}
                                </Link>
                                <div className="flex items-center">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i < (solution.provider?.rating || 0)
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-500 ml-1">
                                    ({solution.provider.reviews || 0})
                                  </span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-600">SP</span>
                            </div>
                          )}
                        </div>
                        <Link href={`/solutions/${solution.id}`}>
                          <Button size="sm" className="gap-1">
                            View Details
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">
                      No solutions found for this category.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="providers">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                {providers.length === 0
                  ? // Skeleton loading state
                    Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <Card
                          key={index}
                          className="overflow-hidden border-gray-200 h-full"
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-4">
                              <Skeleton className="h-16 w-16 rounded-md" />
                              <div className="space-y-2">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-24" />
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-4">
                            <Skeleton className="h-20 w-full mb-4" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-3/4" />
                            </div>
                          </CardContent>
                          <CardFooter className="border-t pt-4 flex justify-between">
                            <Skeleton className="h-5 w-28" />
                            <Skeleton className="h-9 w-32" />
                          </CardFooter>
                        </Card>
                      ))
                  : providers.map((provider) => (
                      <Card
                        key={provider.id}
                        className="overflow-hidden border-gray-200 h-full flex flex-col hover:shadow-md transition-shadow"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-4">
                            {provider.logo_url ? (
                              <img
                                src={provider.logo_url || '/placeholder.svg'}
                                alt={provider.name}
                                className="h-16 w-16 rounded-md object-cover border"
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-md bg-primary-100 flex items-center justify-center">
                                <span className="text-2xl font-medium text-primary-800">
                                  {provider.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">
                                {provider.name}
                              </h3>
                              {provider.verification_status === 'approved' && (
                                <div className="flex items-center text-sm text-emerald-600">
                                  <Verified className="h-4 w-4 mr-1" />
                                  <span>Verified Provider</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-4 flex-grow">
                          <p className="text-gray-600 line-clamp-3 mb-4">
                            {provider.description}
                          </p>

                          <div className="space-y-2 mt-4">
                            {provider.email && (
                              <div className="flex items-center text-sm">
                                <Mail className="h-4 w-4 text-gray-500 mr-2" />
                                <span>{provider.email}</span>
                              </div>
                            )}

                            {provider.website && (
                              <div className="flex items-center text-sm">
                                <Globe className="h-4 w-4 text-gray-500 mr-2" />
                                <a
                                  href={provider.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary-600 hover:underline"
                                >
                                  {provider.website.replace(/^https?:\/\//, '')}
                                </a>
                              </div>
                            )}

                            {provider.regions_served &&
                              provider.regions_served.length > 0 && (
                                <div className="flex items-center text-sm">
                                  <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                                  <div className="flex flex-wrap gap-1">
                                    {provider.regions_served.map(
                                      (region, index) => (
                                        <Badge
                                          key={index}
                                          variant="outline"
                                          className="bg-gray-100 text-gray-700"
                                        >
                                          {getRegionLabel(region)}
                                        </Badge>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4 flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            <Building2 className="h-4 w-4 inline mr-1" />
                            Member since{' '}
                            {new Date(provider.created_at).toLocaleDateString()}
                          </div>
                          <Link href={`/providers/${provider.id}`}>
                            <Button size="sm" className="gap-1">
                              View Profile
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center">
            <Link
              href={
                activeTab === 'solutions' ? '/all-solutions' : '/all-providers'
              }
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              View All {activeTab === 'solutions' ? 'Solutions' : 'Providers'}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionsSection;

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, MapPin, CheckCircle, Briefcase, LogIn } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  getAllProviders,
  getProvidersByExpertiseRaw,
} from '@/app/actions/provider-actions';
import type { SolutionProvider } from '@/lib/db/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllExpertiseCategories } from '@/app/actions/expertise-actions';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

// Helper type to ensure expertise is available
type ProviderWithExpertise = SolutionProvider & {
  expertise: string[];
};

const SolutionsSection = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [, setProviders] = useState<SolutionProvider[]>([]);
  const [expertiseCategories, setExpertiseCategories] = useState<string[]>([]);
  const [selectedExpertise, setSelectedExpertise] = useState<string | null>(
    null,
  );
  const [expertiseProviders, setExpertiseProviders] = useState<
    SolutionProvider[]
  >([]);
  const [activeTab, setActiveTab] = useState<'providers'>('providers');
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Check if user is a solution seeker
  const isSolutionSeeker = user && user.role === 'solution_seeker';

  // Fetch all expertise categories
  useEffect(() => {
    const fetchExpertiseCategories = async () => {
      setLoadingCategories(true);
      try {
        const result = await getAllExpertiseCategories();
        if (result.success && result.data) {
          setExpertiseCategories(result.data);
          if (result.data.length > 0) {
            setSelectedExpertise(result.data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching expertise categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchExpertiseCategories();
  }, []); // <-- run only once, not based on selectedExpertise

  // Fetch all providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const result = await getAllProviders();
        if (result.success && result.data) {
          setProviders(result.data);
        }
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };

    if (isSolutionSeeker) {
      fetchProviders();
    }
  }, [isSolutionSeeker]);

  // Fetch providers by expertise when selected expertise changes
  useEffect(() => {
    const fetchProvidersByExpertise = async () => {
      if (!selectedExpertise || !isSolutionSeeker) return;

      setLoadingProviders(true);
      try {
        // Try the raw SQL version for debugging
        const result = await getProvidersByExpertiseRaw(selectedExpertise);
        console.log('Fetched expertise providers:', result);
        if (result.success && result.data) {
          setExpertiseProviders(result.data);
        } else {
          setExpertiseProviders([]);
        }
      } catch (error) {
        console.error('Error fetching providers by expertise:', error);
        setExpertiseProviders([]);
      } finally {
        setLoadingProviders(false);
      }
    };

    fetchProvidersByExpertise();
  }, [selectedExpertise, isSolutionSeeker]);

  const handleExpertiseChange = (expertise: string) => {
    setSelectedExpertise(expertise);
  };

  const handleLogin = () => {
    router.push('/auth-page');
  };

  const getRegionLabel = (regionValue: string) => {
    const regions = [
      { label: 'Australia', value: 'australia' },
      { label: 'Global', value: 'global' },
    ];

    return regions.find((r) => r.value === regionValue)?.label || regionValue;
  };

  // Helper function to safely check for expertise
  const hasExpertise = (
    provider: SolutionProvider,
  ): provider is ProviderWithExpertise => {
    return (
      'expertise' in provider &&
      Array.isArray(provider.expertise) &&
      provider.expertise.length > 0
    );
  };

  return (
    <div id="solutions" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
            Solution Marketplace
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Find Solutions to Accelerate Your Business
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Explore customised strategies designed to elevate your success
          </p>

          {/* Show message if user is logged in but not a solution seeker */}
          {user && !isSolutionSeeker && (
            <div className="mt-6">
              <div className="inline-block bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
                <p className="text-yellow-800">
                  You need a solution seeker account to view providers. Please
                  contact support if you need assistance.
                </p>
              </div>
            </div>
          )}
        </div>

        {isSolutionSeeker ? (
          <div className="mt-10">
            <Tabs
              defaultValue="providers"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as 'providers')}
              className="w-full"
            >
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-[400px] grid-cols-1">
                  <TabsTrigger value="providers">
                    Solution Providers
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="providers">
                {/* Expertise Categories */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    Browse by Expertise
                  </h3>

                  {loadingCategories ? (
                    <div className="flex justify-center space-x-2 mb-6">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-10 w-32 rounded-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      {expertiseCategories.map((expertise) => (
                        <button
                          key={expertise}
                          className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                            selectedExpertise === expertise
                              ? 'bg-blue-100 text-black-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                          onClick={() => handleExpertiseChange(expertise)}
                        >
                          {expertise}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Providers by Expertise */}
                  {selectedExpertise && (
                    <div className="mb-8">
                      <div className="flex items-center mb-6">
                        <div className="flex-grow h-px bg-gray-200"></div>
                        <div className="px-4 flex items-center">
                          <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                          <h3 className="text-lg font-bold text-gray-900">
                            {selectedExpertise} Specialists
                          </h3>
                        </div>
                        <div className="flex-grow h-px bg-gray-200"></div>
                      </div>

                      {loadingProviders ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                            >
                              <div className="flex items-center mb-4">
                                <Skeleton className="h-16 w-16 rounded-lg" />
                                <div className="ml-4 flex-1">
                                  <Skeleton className="h-5 w-32 mb-2" />
                                  <Skeleton className="h-4 w-24" />
                                </div>
                              </div>
                              <Skeleton className="h-16 w-full mb-4" />
                              <div className="mt-auto">
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-3/4" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : expertiseProviders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {expertiseProviders.map((provider, index) => (
                            <Link
                              href={`/providers/${provider.id}`}
                              key={`${provider.id}-${index}`}
                              className="block group"
                            >
                              <div className="bg-gradient-to-r from-blue-300 to-blue-200 rounded-xl p-6 border border-blue-100 hover:shadow-md transition-all duration-300 h-full flex flex-col relative overflow-hidden">
                                {/* Verified badge */}
                                {provider.verification_status ===
                                  'approved' && (
                                  <div className="absolute top-4 right-4">
                                    <div className="bg-green-600 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                                      <CheckCircle className="h-3 w-3 mr-1 text-amber-300" />
                                      Verified
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center mb-4">
                                  {provider.logo_url ? (
                                    <div className="h-16 w-16 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                                      <img
                                        src={
                                          provider.logo_url ||
                                          '/placeholder.svg'
                                        }
                                        alt={provider.name}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold border-2 border-white shadow-sm">
                                      {provider.name?.charAt(0)}
                                    </div>
                                  )}
                                  <div className="ml-4 flex-1">
                                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                      {provider.name}
                                    </h4>
                                  </div>
                                </div>

                                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                  {provider.description}
                                </p>

                                <div className="mt-auto">
                                  {/* Expertise areas - using type guard */}
                                  {hasExpertise(provider) && (
                                    <div className="mb-3">
                                      <div className="text-xs font-medium text-gray-500 mb-1.5">
                                        Expertise
                                      </div>
                                      <div className="flex flex-wrap gap-1.5">
                                        {provider.expertise
                                          .slice(0, 3)
                                          .map((skill, index) => (
                                            <Badge
                                              key={index}
                                              variant="outline"
                                              className="bg-white/80 text-blue-800 border-blue-200 text-xs"
                                            >
                                              {skill}
                                            </Badge>
                                          ))}
                                        {provider.expertise.length > 5 && (
                                          <Badge
                                            variant="outline"
                                            className="bg-white/80 text-blue-800 border-blue-200 text-xs"
                                          >
                                            +{provider.expertise.length - 5}{' '}
                                            more
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Regions */}
                                  {provider.regions_served &&
                                    provider.regions_served.length > 0 && (
                                      <div className="flex items-center text-xs text-gray-600">
                                        <MapPin className="h-3.5 w-3.5 text-black mr-1.5" />
                                        <span>
                                          {provider.regions_served
                                            .map((region) =>
                                              getRegionLabel(region),
                                            )
                                            .join(', ')}
                                        </span>
                                      </div>
                                    )}
                                </div>
                                <div className="space-y-2 mt-4">
                                  {/* {provider.email && (
                                    <div className="flex items-center text-sm">
                                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                                      <span>{provider.email}</span>
                                    </div>
                                  )} */}

                                  {/* {provider.website && (
                                    <div className="flex items-center text-sm">
                                      <Globe className="h-4 w-4 text-gray-500 mr-2" />
                                      <Link
                                        href={provider.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-600 hover:underline"
                                      >
                                        {provider.website.replace(
                                          /^https?:\/\//,
                                          '',
                                        )}
                                      </Link>
                                    </div>
                                  )} */}
                                  <div className="text-sm text-gray-500">
                                    <Building2 className="h-4 w-4 inline mr-1" />
                                    Member since{' '}
                                    {new Date(
                                      provider.created_at,
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                                {/* Hover effect overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-indigo-600/0 group-hover:from-blue-600/5 group-hover:to-indigo-600/10 transition-all duration-300"></div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-gray-500">
                            No providers found with {selectedExpertise}{' '}
                            expertise.
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            Providers with expertise in {selectedExpertise} will
                            appear here when available.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* All Providers Section */}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="mt-16 text-center">
            <div className="bg-blue-50 p-8 rounded-lg border border-blue-100 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Login Required
              </h3>
              <p className="text-gray-600 mb-6">
                Please log in as a solution seeker to view our solution
                providers and their expertise.
              </p>
              <Button
                onClick={handleLogin}
                className="gap-2 text-white bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-700 hover:to-blue-600 cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                Log in to view solutions
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolutionsSection;

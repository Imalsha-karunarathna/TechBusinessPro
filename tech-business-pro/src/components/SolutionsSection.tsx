'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  CheckCircle,
  Briefcase,
  LogIn,
  Star,
  ExternalLink,
} from 'lucide-react';
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
import { ContactProviderButton } from './contact-provider/contact-provider-button';
import { Card, CardContent } from '@/components/ui/card';

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
    <div id="solutions" className="py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full  text-[#3069FE] mb-4">
            Solution Marketplace
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Find Solutions to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3069FE] to-[#42C3EE]">
              Accelerate
            </span>{' '}
            Your Business
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Explore customised strategies designed to elevate your success
          </p>

          {/* Show message if user is logged in but not a solution seeker */}
          {user && !isSolutionSeeker && (
            <div className="mt-8">
              <div className="inline-block bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-left shadow-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-yellow-800">
                      Access Restricted
                    </h3>
                    <p className="mt-2 text-yellow-700">
                      You need a solution seeker account to view providers.
                      Please contact support if you need assistance.
                    </p>
                  </div>
                </div>
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
              <div className="flex justify-center mb-10">
                <TabsList className="grid w-[400px] grid-cols-1 p-1  rounded-full">
                  <TabsTrigger value="providers" className="rounded-lg py-3 ">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Solution Providers
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="providers">
                {/* Search and filter bar */}

                {/* Expertise Categories */}
                <div className="mb-12">
                  <div className="flex items-center mb-6">
                    <div className="flex-grow h-px bg-gray-200"></div>
                    <div className="px-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        Browse by Expertise
                      </h3>
                    </div>
                    <div className="flex-grow h-px bg-gray-200"></div>
                  </div>

                  {loadingCategories ? (
                    <div className="flex justify-center space-x-3 mb-8">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-12 w-36 rounded-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                      {expertiseCategories.map((expertise) => (
                        <button
                          key={expertise}
                          className={`px-5 py-2 rounded-lg cursor-pointer font-medium text-sm transition-all duration-300 ${
                            selectedExpertise === expertise
                              ? 'bg-gradient-to-r from-[#3069FE] to-[#42C3EE] text-white shadow-md transform scale-105'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm'
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
                    <div className="mb-12">
                      <div className="flex items-center mb-8">
                        <div className="flex-grow h-px bg-gray-200"></div>

                        <div className="flex-grow h-px bg-gray-200"></div>
                      </div>

                      {loadingProviders ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {[1, 2, 3].map((i) => (
                            <Card
                              key={i}
                              className="overflow-hidden border-none shadow-lg"
                            >
                              <CardContent className="p-0">
                                <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4">
                                  <div className="flex items-center">
                                    <Skeleton className="h-16 w-16 rounded-lg" />
                                    <div className="ml-4 flex-1">
                                      <Skeleton className="h-5 w-32 mb-2" />
                                      <Skeleton className="h-4 w-24" />
                                    </div>
                                  </div>
                                </div>
                                <div className="p-6">
                                  <Skeleton className="h-16 w-full mb-4" />
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-6 w-14 rounded-full" />
                                  </div>
                                  <Skeleton className="h-4 w-full mb-2" />
                                  <Skeleton className="h-4 w-3/4 mb-6" />
                                  <Skeleton className="h-10 w-full rounded-md" />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : expertiseProviders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {expertiseProviders.map((provider, index) => (
                            <Card
                              key={`${provider.id}-${index}`}
                              className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 group"
                            >
                              <CardContent className="p-0">
                                <div className="bg-gradient-to-r from-[#3069FE] to-[#42C3EE] p-6 relative rounded-lg">
                                  {/* Verified badge */}
                                  {provider.verification_status ===
                                    'approved' && (
                                    <div className="absolute top-4 right-4">
                                      <div className="bg-white text-green-600 text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-md">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Verified
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex items-center">
                                    {provider.logo_url ? (
                                      <div className="h-16 w-16 rounded-lg overflow-hidden border-2 border-white shadow-md">
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
                                      <div className="h-16 w-16 rounded-lg bg-white flex items-center justify-center text-purple-600 text-2xl font-bold border-2 border-white shadow-md">
                                        {provider.name?.charAt(0)}
                                      </div>
                                    )}
                                    <div className="ml-4 flex-1">
                                      <h4 className="text-lg font-bold text-white">
                                        {provider.name}
                                      </h4>
                                      <div className="flex items-center mt-1">
                                        <div className="flex">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                              key={star}
                                              className="h-4 w-4 text-yellow-300"
                                              fill="currentColor"
                                            />
                                          ))}
                                        </div>
                                        <span className="ml-1 text-xs text-white text-opacity-90">
                                          5.0
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-6">
                                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 h-[4.5rem]">
                                    {provider.description}
                                  </p>

                                  {/* Expertise areas - using type guard */}
                                  {hasExpertise(provider) && (
                                    <div className="mb-4">
                                      <div className="text-xs font-medium text-gray-500 mb-2">
                                        Expertise
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {provider.expertise
                                          .slice(0, 3)
                                          .map((skill, index) => (
                                            <Badge
                                              key={index}
                                              variant="outline"
                                              className="bg-purple-50 text-[#3069FE] border-purple-200 px-3 py-1 rounded-full"
                                            >
                                              {skill}
                                            </Badge>
                                          ))}
                                        {provider.expertise.length > 3 && (
                                          <Badge
                                            variant="outline"
                                            className="bg-gray-50 text-gray-600 border-gray-200 px-3 py-1 rounded-full"
                                          >
                                            +{provider.expertise.length - 3}{' '}
                                            more
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  <div className="space-y-2 mb-6">
                                    {/* Regions */}
                                    {provider.regions_served &&
                                      provider.regions_served.length > 0 && (
                                        <div className="flex items-center text-sm text-gray-600">
                                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                          <span>
                                            {provider.regions_served
                                              .map((region) =>
                                                getRegionLabel(region),
                                              )
                                              .join(', ')}
                                          </span>
                                        </div>
                                      )}

                                    <div className="text-sm text-gray-600">
                                      <Building2 className="h-4 w-4 text-gray-400 inline mr-2" />
                                      Member since{' '}
                                      {new Date(
                                        provider.created_at,
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    <Link
                                      href={`/providers/${provider.id}`}
                                      className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md flex items-center justify-center transition-colors"
                                    >
                                      <ExternalLink className="h-4 w-4 mr-1.5" />
                                      View Profile
                                    </Link>

                                    <div className="flex-1">
                                      <ContactProviderButton
                                        providerId={provider.id}
                                        providerName={provider.name}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Hover effect overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/5 group-hover:to-blue-600/10 transition-all duration-300 pointer-events-none"></div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-md">
                          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                            <svg
                              className="h-8 w-8"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 mb-2">
                            No Providers Found
                          </h4>
                          <p className="text-gray-500 max-w-md mx-auto">
                            No providers found with {selectedExpertise}{' '}
                            expertise.
                          </p>
                          <p className="text-sm text-gray-400 mt-2">
                            Providers with expertise in {selectedExpertise} will
                            appear here when available.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-10 rounded-xl border border-purple-100 max-w-2xl mx-auto shadow-xl">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-[#3069FE] to-[#42C3EE] text-white mb-6">
                <LogIn className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Login Required
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Please log in as a solution seeker to view our solution
                providers and their expertise.
              </p>
              <Button
                onClick={handleLogin}
                className="px-8 py-6 gap-2 text-white bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:from-[#42C3EE] hover:to-[#3069FE] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <LogIn className="h-5 w-5 mr-2" />
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

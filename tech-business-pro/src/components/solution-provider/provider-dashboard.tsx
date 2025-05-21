'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { ProviderProfileForm } from './provider-profile-form';
import { ProviderSidebar } from './provider-sidebar';
import { ProviderHeader } from './provider-header';
import { useRouter } from 'next/navigation';
import { ProviderExpertiseTable } from './provider-expertise-table';
import { getOrCreateProviderProfileByEmail } from '@/app/actions/provider-actions';
import { toast } from 'sonner';

export function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState<string>('solutions');
  const { user, isLoading } = useAuth();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [providerData, setProviderData] = useState<any>(null);
  const [providerLoading, setProviderLoading] = useState(true);

  // Fetch provider profile data when component mounts
  useEffect(() => {
    async function fetchProviderProfile() {
      if (!user || user.role !== 'solution_provider') return;

      try {
        setProviderLoading(true);
        console.log('Fetching provider profile for user:', user.id);
        const result = await getOrCreateProviderProfileByEmail(user.email);

        if (result.success) {
          console.log('Provider profile loaded successfully:', result.data);
          setProviderData(result.data);

          // Show toast if this is a new profile
          if (result.isNew) {
            toast('Profile created', {
              description:
                'Your provider profile has been created. Please complete your profile information.',
            });
            // Switch to profile tab for new profiles
            setActiveTab('profile');
          }

          // Show toast if profile was created from application
          if (result.isFromApplication) {
            toast('Profile created from application', {
              description:
                'Your provider profile has been created based on your partner application.',
            });
          }
        } else {
          console.error('Error loading provider profile:', result.error);
          toast('Error', {
            description: result.error || 'Failed to load provider profile',
          });
        }
      } catch (error) {
        console.error('Error fetching provider profile:', error);
        toast('Error', {
          description:
            'Failed to load provider profile. Please try again later.',
        });
      } finally {
        setProviderLoading(false);
      }
    }

    if (user && !isLoading) {
      fetchProviderProfile();
    }
  }, [user, isLoading, toast]);

  // Redirect if not logged in or not a provider
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'solution_provider')) {
      router.push('/auth-page?error=provider_required');
    }
  }, [user, isLoading, router]);

  // Show loading state
  if (isLoading || providerLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading provider dashboard...</p>
        </div>
      </div>
    );
  }

  // If user is not a solution provider, don't render the dashboard
  if (!user || user.role !== 'solution_provider') {
    return null;
  }

  // Get application expertise from provider data
  const applicationExpertise = providerData?.applicationExpertise || [];
  console.log('Application expertise in dashboard:', applicationExpertise);

  return (
    <div className="flex h-screen -mt-10 bg-gray-50">
      <ProviderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ProviderHeader providerData={providerData} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {activeTab === 'solutions' && (
            <ProviderExpertiseTable
              providerId={providerData?.id}
              applicationExpertise={applicationExpertise}
            />
          )}
          {/* {activeTab === 'messages' && (
            <ProviderContactRequests providerId={providerData?.id} />
          )} */}
          {activeTab === 'profile' && (
            <ProviderProfileForm initialData={providerData} />
          )}
          {/* {activeTab === "analytics" && <ProviderAnalytics />} */}
        </main>
      </div>
    </div>
  );
}

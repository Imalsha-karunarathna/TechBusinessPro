'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { ProviderProfileForm } from './provider-profile-form';
import { ProviderSidebar } from './provider-sidebar';
import { ProviderHeader } from './provider-header';
import { ProviderSolutionsTable } from './provider-solutions-table';

export function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState<string>('solutions');
  const { isLoading } = useAuth();

  //Redirect if not logged in or not a provider
  //   if (!isLoading && (!user || user.role !== "solution_provider")) {
  //     router.push("/auth-page?error=provider_required");
  //     return null;
  //   }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ProviderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ProviderHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {activeTab === 'solutions' && <ProviderSolutionsTable />}
          {activeTab === 'profile' && <ProviderProfileForm />}
          {/* {activeTab === "analytics" && <ProviderAnalytics />} */}
        </main>
      </div>
    </div>
  );
}

import { getPartnerApplications } from '@/app/actions/partner-applications';
import { PartnerApplicationsTable } from '@/components/admin/partner-applications-table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Suspense } from 'react';

// Async data fetching component
async function FetchApplications({ status }: { status: string }) {
  const applications = await getPartnerApplications(status);
  return <PartnerApplicationsTable applications={applications} />;
}

type PartnerApplicationsPageProps = {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
};

export default async function PartnerApplicationsPage(
  props: PartnerApplicationsPageProps,
) {
  const searchParams = await props.searchParams;
  // Normalize the status parameter
  const statusParam = searchParams?.['status']?.trim().toLowerCase() || 'all';
  const status = statusParam;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Partner Applications</h1>

      <Tabs value={status} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending" asChild>
            <Link
              href="/admin/partner-application?status=pending"
              prefetch={false}
            >
              Pending
            </Link>
          </TabsTrigger>
          <TabsTrigger value="approved" asChild>
            <Link
              href="/admin/partner-application?status=approved"
              prefetch={false}
            >
              Approved
            </Link>
          </TabsTrigger>
          <TabsTrigger value="rejected" asChild>
            <Link
              href="/admin/partner-application?status=rejected"
              prefetch={false}
            >
              Rejected
            </Link>
          </TabsTrigger>
          <TabsTrigger value="all" asChild>
            <Link href="/admin/partner-application?status=all" prefetch={false}>
              All
            </Link>
          </TabsTrigger>
        </TabsList>

        {/* Use a key to force re-render when status changes */}
        <Suspense key={status} fallback={<div>Loading applications...</div>}>
          <FetchApplications status={status} />
        </Suspense>
      </Tabs>
    </div>
  );
}

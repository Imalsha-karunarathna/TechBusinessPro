import { getPartnerApplicationById } from '@/app/actions/partner-applications';
import { PartnerApplicationDetail } from '@/components/admin/partner-application-detail';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function PartnerApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const applicationId = Number.parseInt(params.id, 10);

  if (isNaN(applicationId)) {
    notFound();
  }

  const application = await getPartnerApplicationById(applicationId);

  if (!application) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/admin/partner-application">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Partner Application</h1>
        <p className="text-muted-foreground">
          Review application from {application.organization_name}
        </p>
      </div>

      <PartnerApplicationDetail application={application} />
    </div>
  );
}

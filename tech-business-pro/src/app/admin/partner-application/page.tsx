import { getPartnerApplications } from "@/app/actions/partner-applications";
import { PartnerApplicationsTable } from "@/components/admin/partner-applications-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function PartnerApplicationsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status || "pending";
  const applications = await getPartnerApplications(status);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Partner Applications</h1>

      <Tabs defaultValue={status} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending" asChild>
            <a href="/admin/partner-application?status=pending">Pending</a>
          </TabsTrigger>
          <TabsTrigger value="approved" asChild>
            <a href="/admin/partner-application?status=approved">Approved</a>
          </TabsTrigger>
          <TabsTrigger value="rejected" asChild>
            <a href="/admin/partner-application?status=rejected">Rejected</a>
          </TabsTrigger>
          <TabsTrigger value="all" asChild>
            <a href="/admin/partner-application?status=all">All</a>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={status} className="mt-0">
          <PartnerApplicationsTable applications={applications} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

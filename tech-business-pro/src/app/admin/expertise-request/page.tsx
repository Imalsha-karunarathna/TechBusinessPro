import { getPendingExpertiseRequests } from '@/app/actions/expertise-actions';
import { ExpertiseRequestsTable } from '@/components/admin/expertise-request-table';

export default async function ExpertiseRequestsPage() {
  const result = await getPendingExpertiseRequests();
  const pendingRequests = result.success && result.data ? result.data : [];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Expertise Approval Requests</h1>
          <p className="text-gray-500">
            Review and approve provider expertise requests
          </p>
        </div>

        <ExpertiseRequestsTable requests={pendingRequests} />
      </div>
    </div>
  );
}

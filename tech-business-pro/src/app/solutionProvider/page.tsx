import { ProviderDashboard } from '@/components/solution-provider/provider-dashboard';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/server-auth';

export default async function ProviderDashboardPage() {
  // Check if user is authenticated and has the solution_provider role
  const session = await auth();

  if (!session?.user) {
    // Redirect to login if not authenticated
    redirect('/login?callbackUrl=/solutionProvider');
  }

  // Check if user has the solution_provider role
  if (session.user.role !== 'solution_provider') {
    // Redirect to unauthorized page if not a solution provider
    redirect('/unauthorized');
  }

  return <ProviderDashboard />;
}

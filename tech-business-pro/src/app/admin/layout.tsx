import type React from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { requireAdmin } from '@/lib/server-auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="ml-64 min-h-screen">
        <div className="p-6 max-w-full overflow-x-auto">{children}</div>
      </div>
    </div>
  );
}

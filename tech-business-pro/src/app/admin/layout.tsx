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
    <div className="flex min-h-screen p-4 ">
      <AdminSidebar />
      <div className="ml-64 flex-1 p-8">{children}</div>
    </div>
  );
}

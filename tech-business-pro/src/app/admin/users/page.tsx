import { getAllUsers } from "@/app/actions/users";
import { UsersTable } from "@/components/admin/users-table";

export default async function UsersPage() {
  const users = await getAllUsers();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <p className="text-muted-foreground mb-6">
        View and manage all registered users in the system.
      </p>

      <UsersTable users={users} />
    </div>
  );
}

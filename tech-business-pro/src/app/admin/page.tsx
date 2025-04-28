import { redirect } from "next/navigation";

export default function AdminPage() {
  // Redirect to partner applications by default
  redirect("/admin/partner-application");
}

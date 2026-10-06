import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export default function AdminSystemPage() {
  return (
    <AdminPlaceholder
      title="System health"
      subtitle="Live checks for the gateway, database, and billing will appear here. The dashboard lists those services as not checked."
    />
  );
}

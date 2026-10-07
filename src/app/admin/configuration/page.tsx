import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export default function AdminConfigurationPage() {
  return (
    <AdminPlaceholder
      title="Configuration"
      subtitle="Plan prices and other settings will be edited here. Plans stay read-only on Subscriptions until billing is connected."
    />
  );
}
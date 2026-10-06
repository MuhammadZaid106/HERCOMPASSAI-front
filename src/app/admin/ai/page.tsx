"use client";

import { AdminReviewQueue } from "@/components/admin/AdminReviewQueue";

export default function AdminAiPage() {
  return (
    <AdminReviewQueue
      title="AI Safety"
      subtitle="Quality signals and the review queue"
      safetyIntro
    />
  );
}

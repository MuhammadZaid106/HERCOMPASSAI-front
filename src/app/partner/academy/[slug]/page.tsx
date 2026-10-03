"use client";

import { useParams } from "next/navigation";
import { PartnerLessonPage } from "@/components/partner/PartnerLesson";

export default function PartnerLessonRoute() {
  const params = useParams<{ slug: string }>();
  const slug = typeof params.slug === "string" ? params.slug : "";
  return <PartnerLessonPage slug={slug} />;
}

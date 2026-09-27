import type { Metadata } from "next";
import { MemberShell } from "@/components/member/MemberShell";

export const metadata: Metadata = {
  title: "My HerCompassAI Space",
  description: "Your personal patterns, tracking, and next steps.",
};

export default function MemberLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <MemberShell>{children}</MemberShell>;
}

import { authClient } from "@/lib/auth/authClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

export interface CommunityTopic {
  id: string;
  title: string;
  starter: string;
}

export interface CommunityNoteCard {
  id: string;
  topic: string;
  body: string;
  status: "pending" | "approved" | "hidden";
  firstName: string;
  mine: boolean;
}

export interface CommunityBoard {
  notice: string;
  topics: CommunityTopic[];
  notes: CommunityNoteCard[];
}

interface ApiResult<T> {
  success: boolean;
  message: string;
  data?: T;
}

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const response = await authClient.authenticatedFetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  return (await response.json()) as ApiResult<T>;
}

export const communityClient = {
  board: () => request<CommunityBoard>("/api/member/community"),
  post: (body: { topic: string; body: string }) =>
    request<{ note: CommunityNoteCard }>("/api/member/community/notes", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

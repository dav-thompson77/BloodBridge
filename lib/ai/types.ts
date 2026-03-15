import type { DonorStatus, UrgencyLevel } from "@/lib/types";

export interface AiOutreachRequest {
  bloodType: string;
  urgency: UrgencyLevel;
  centreName: string;
  requiredBy: string;
  approvalStatus?: DonorStatus;
  donorName?: string;
  messageContext?: string;
}

export interface AiOutreachResponse {
  suggestions: string[];
  provider: "openrouter" | "fallback";
  model: string;
  error?: string;
}

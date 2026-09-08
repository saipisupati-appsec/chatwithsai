export type Mode = "general" | "recruiter" | "career";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface SuggestedQuestion {
  text: string;
  mode?: Mode;
}

export interface Keyword {
  id: string;
  word: string;
  enabled: boolean;
  link: string;
  message: string;
  buttonText: string;
  createdAt: Date;
  triggersCount: number;
}

export interface AutomationConfig {
  accessToken: string;
  instagramId: string;
  baseUrl: string;
  apiKey: string;
  delaySeconds: number;
  replyToComment: boolean;
  sendDM: boolean;
}

export interface DashboardStats {
  totalTriggers: number;
  activeKeywords: number;
  messagesSent: number;
  lastActivity: Date | null;
}

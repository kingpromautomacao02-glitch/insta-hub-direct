import { useState, useCallback } from "react";
import type { Keyword, AutomationConfig, DashboardStats } from "@/types/automation";

const defaultConfig: AutomationConfig = {
  accessToken: "",
  instagramId: "",
  baseUrl: "",
  apiKey: "",
  delaySeconds: 5,
  replyToComment: true,
  sendDM: true,
};

const defaultKeywords: Keyword[] = [
  {
    id: "1",
    word: "quero",
    enabled: true,
    link: "https://pay.kiwify.com.br/mIqt4HB",
    message: "Opa, vi que você teve interesse! Clique no botão abaixo:",
    buttonText: "Comprar Agora",
    createdAt: new Date(),
    triggersCount: 127,
  },
  {
    id: "2", 
    word: "link",
    enabled: true,
    link: "https://wa.me/556191592205",
    message: "Aqui está o link que você pediu!",
    buttonText: "Acessar WhatsApp",
    createdAt: new Date(),
    triggersCount: 84,
  },
];

export function useAutomation() {
  const [keywords, setKeywords] = useState<Keyword[]>(defaultKeywords);
  const [config, setConfig] = useState<AutomationConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(false);

  const stats: DashboardStats = {
    totalTriggers: keywords.reduce((acc, k) => acc + k.triggersCount, 0),
    activeKeywords: keywords.filter((k) => k.enabled).length,
    messagesSent: keywords.reduce((acc, k) => acc + k.triggersCount, 0),
    lastActivity: new Date(),
  };

  const addKeyword = useCallback((keyword: Omit<Keyword, "id" | "createdAt" | "triggersCount">) => {
    const newKeyword: Keyword = {
      ...keyword,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      triggersCount: 0,
    };
    setKeywords((prev) => [...prev, newKeyword]);
  }, []);

  const updateKeyword = useCallback((id: string, updates: Partial<Keyword>) => {
    setKeywords((prev) =>
      prev.map((k) => (k.id === id ? { ...k, ...updates } : k))
    );
  }, []);

  const deleteKeyword = useCallback((id: string) => {
    setKeywords((prev) => prev.filter((k) => k.id !== id));
  }, []);

  const toggleKeyword = useCallback((id: string) => {
    setKeywords((prev) =>
      prev.map((k) => (k.id === id ? { ...k, enabled: !k.enabled } : k))
    );
  }, []);

  const updateConfig = useCallback((updates: Partial<AutomationConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    keywords,
    config,
    stats,
    isLoading,
    addKeyword,
    updateKeyword,
    deleteKeyword,
    toggleKeyword,
    updateConfig,
  };
}

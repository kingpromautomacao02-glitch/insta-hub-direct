import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Keyword, AutomationConfig, DashboardStats } from "@/types/automation";
import type { Database } from "@/types/database";

type KeywordRow = Database['public']['Tables']['keywords']['Row'];
type ConfigRow = Database['public']['Tables']['automation_configs']['Row'];

export function useAutomation() {
  const { user } = useAuth();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [config, setConfig] = useState<AutomationConfig>({
    accessToken: "",
    instagramId: "",
    baseUrl: "",
    apiKey: "",
    delaySeconds: 5,
    replyToComment: true,
    sendDM: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  const mapKeywordFromDB = (row: KeywordRow): Keyword => ({
    id: row.id,
    word: row.word,
    enabled: row.enabled,
    link: row.link,
    message: row.message,
    buttonText: row.button_text,
    createdAt: new Date(row.created_at),
    triggersCount: row.triggers_count,
  });

  const mapConfigFromDB = (row: ConfigRow): AutomationConfig => ({
    accessToken: row.access_token,
    instagramId: row.instagram_id,
    baseUrl: row.base_url,
    apiKey: row.api_key,
    delaySeconds: row.delay_seconds,
    replyToComment: row.reply_to_comment,
    sendDM: row.send_dm,
  });

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);

      const { data: keywordsData } = await supabase
        .from('keywords')
        .select('*')
        .order('created_at', { ascending: false });

      if (keywordsData) {
        setKeywords(keywordsData.map(mapKeywordFromDB));
      }

      const { data: configData } = await supabase
        .from('automation_configs')
        .select('*')
        .maybeSingle();

      if (configData) {
        setConfig(mapConfigFromDB(configData));
      } else {
        const { data: newConfig } = await supabase
          .from('automation_configs')
          .insert({
            user_id: user.id,
          })
          .select()
          .single();

        if (newConfig) {
          setConfig(mapConfigFromDB(newConfig));
        }
      }

      setIsLoading(false);
    };

    fetchData();
  }, [user]);

  const stats: DashboardStats = {
    totalTriggers: keywords.reduce((acc, k) => acc + k.triggersCount, 0),
    activeKeywords: keywords.filter((k) => k.enabled).length,
    messagesSent: keywords.reduce((acc, k) => acc + k.triggersCount, 0),
    lastActivity: keywords.length > 0 ? keywords[0].createdAt : null,
  };

  const addKeyword = useCallback(async (keyword: Omit<Keyword, "id" | "createdAt" | "triggersCount">) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('keywords')
      .insert({
        user_id: user.id,
        word: keyword.word,
        enabled: keyword.enabled,
        link: keyword.link,
        message: keyword.message,
        button_text: keyword.buttonText,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding keyword:', error);
      return;
    }

    if (data) {
      setKeywords((prev) => [mapKeywordFromDB(data), ...prev]);
    }
  }, [user]);

  const updateKeyword = useCallback(async (id: string, updates: Partial<Keyword>) => {
    const { error } = await supabase
      .from('keywords')
      .update({
        word: updates.word,
        enabled: updates.enabled,
        link: updates.link,
        message: updates.message,
        button_text: updates.buttonText,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating keyword:', error);
      return;
    }

    setKeywords((prev) =>
      prev.map((k) => (k.id === id ? { ...k, ...updates } : k))
    );
  }, []);

  const deleteKeyword = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('keywords')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting keyword:', error);
      return;
    }

    setKeywords((prev) => prev.filter((k) => k.id !== id));
  }, []);

  const toggleKeyword = useCallback(async (id: string) => {
    const keyword = keywords.find((k) => k.id === id);
    if (!keyword) return;

    const { error } = await supabase
      .from('keywords')
      .update({ enabled: !keyword.enabled })
      .eq('id', id);

    if (error) {
      console.error('Error toggling keyword:', error);
      return;
    }

    setKeywords((prev) =>
      prev.map((k) => (k.id === id ? { ...k, enabled: !k.enabled } : k))
    );
  }, [keywords]);

  const updateConfig = useCallback(async (updates: Partial<AutomationConfig>) => {
    if (!user) return;

    const { error } = await supabase
      .from('automation_configs')
      .update({
        access_token: updates.accessToken,
        instagram_id: updates.instagramId,
        base_url: updates.baseUrl,
        api_key: updates.apiKey,
        delay_seconds: updates.delaySeconds,
        reply_to_comment: updates.replyToComment,
        send_dm: updates.sendDM,
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating config:', error);
      return;
    }

    setConfig((prev) => ({ ...prev, ...updates }));
  }, [user]);

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

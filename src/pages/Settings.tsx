import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Settings as SettingsIcon,
  Key,
  Instagram,
  Globe,
  Clock,
  MessageCircle,
  Reply,
  Save,
  Eye,
  EyeOff,
  ExternalLink,
  Zap,
} from "lucide-react";
import { useAutomation } from "@/hooks/useAutomation";
import { toast } from "sonner";

export default function Settings() {
  const { config, updateConfig } = useAutomation();
  const [showToken, setShowToken] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [localConfig, setLocalConfig] = useState(config);

  const handleSave = () => {
    updateConfig(localConfig);
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Configure sua conexão com Instagram e n8n
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Instagram API */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-primary" />
              Instagram API
            </CardTitle>
            <CardDescription>
              Credenciais para conectar com o Graph API do Instagram
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accessToken">Token de Acesso</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="accessToken"
                  type={showToken ? "text" : "password"}
                  placeholder="EAAxxxxxxx..."
                  value={localConfig.accessToken}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, accessToken: e.target.value })
                  }
                  className="pl-9 pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Token de longa duração do Facebook/Instagram
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagramId">ID do Instagram</Label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="instagramId"
                  placeholder="17841400000000000"
                  value={localConfig.instagramId}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, instagramId: e.target.value })
                  }
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                ID da conta profissional do Instagram
              </p>
            </div>
          </CardContent>
        </Card>

        {/* n8n Integration */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Integração n8n
            </CardTitle>
            <CardDescription>
              Configurações do workflow de automação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="baseUrl">URL Base do n8n</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="baseUrl"
                  placeholder="https://seu-n8n.com"
                  value={localConfig.baseUrl}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, baseUrl: e.target.value })
                  }
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  placeholder="n8n_api_..."
                  value={localConfig.apiKey}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, apiKey: e.target.value })
                  }
                  className="pl-9 pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium">Workflow conectado</span>
              </div>
              <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                Ativo
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Automation Behavior */}
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-primary" />
              Comportamento da Automação
            </CardTitle>
            <CardDescription>
              Configure como a automação responde às interações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="delay">Delay entre respostas</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="delay"
                    type="number"
                    min="0"
                    max="60"
                    value={localConfig.delaySeconds}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        delaySeconds: parseInt(e.target.value) || 0,
                      })
                    }
                    className="pl-9"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Segundos de espera antes de enviar a DM
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Reply className="h-4 w-4 text-muted-foreground" />
                    <Label>Responder comentários</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enviar resposta automática nos comentários antes da DM
                  </p>
                </div>
                <Switch
                  checked={localConfig.replyToComment}
                  onCheckedChange={(checked) =>
                    setLocalConfig({ ...localConfig, replyToComment: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <Label>Enviar DM automática</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enviar mensagem direta com o link após o comentário
                  </p>
                </div>
                <Switch
                  checked={localConfig.sendDM}
                  onCheckedChange={(checked) =>
                    setLocalConfig({ ...localConfig, sendDM: checked })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Webhook Info */}
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Webhooks Configurados
            </CardTitle>
            <CardDescription>
              Endpoints ativos no seu workflow n8n
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-accent/30 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">GET</Badge>
                  <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                    Ativo
                  </Badge>
                </div>
                <p className="font-mono text-sm text-foreground">/webhook/encha</p>
                <p className="text-xs text-muted-foreground mt-1">Challenge do Meta</p>
              </div>

              <div className="p-4 rounded-lg bg-accent/30 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">POST</Badge>
                  <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                    Ativo
                  </Badge>
                </div>
                <p className="font-mono text-sm text-foreground">/webhook/encha</p>
                <p className="text-xs text-muted-foreground mt-1">Recebe comentários e DMs</p>
              </div>

              <div className="p-4 rounded-lg bg-accent/30 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">POST</Badge>
                  <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                    Ativo
                  </Badge>
                </div>
                <p className="font-mono text-sm text-foreground">/webhook/DM</p>
                <p className="text-xs text-muted-foreground mt-1">Evolution API</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

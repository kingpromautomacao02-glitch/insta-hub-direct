import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Hash, MessageCircle, Zap, Clock, TrendingUp, Instagram } from "lucide-react";
import { useAutomation } from "@/hooks/useAutomation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const { stats, keywords, isLoading } = useAutomation();

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-8">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-border bg-card">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral da sua automação do Instagram
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Palavras Ativas
            </CardTitle>
            <Hash className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.activeKeywords}</div>
            <p className="text-xs text-muted-foreground mt-1">
              de {keywords.length} cadastradas
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mensagens Enviadas
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.messagesSent}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +12% esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Triggers
            </CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalTriggers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              interações captadas
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Última Atividade
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-foreground">
              {stats.lastActivity
                ? formatDistanceToNow(stats.lastActivity, { addSuffix: true, locale: ptBR })
                : "Nenhuma"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              workflow executado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Keywords Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-primary" />
              Palavras-Chave Ativas
            </CardTitle>
            <CardDescription>
              Triggers configurados na automação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {keywords.filter(k => k.enabled).map((keyword) => (
              <div
                key={keyword.id}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/30 border border-border"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="font-mono">
                    #{keyword.word}
                  </Badge>
                  <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                    {keyword.link}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {keyword.triggersCount}
                  </span>
                  <Zap className="h-3 w-3 text-primary" />
                </div>
              </div>
            ))}
            {keywords.filter(k => k.enabled).length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma palavra-chave ativa
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-primary" />
              Status da Automação
            </CardTitle>
            <CardDescription>
              Conexão com n8n e Instagram
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                <div>
                  <p className="font-medium text-foreground">n8n Workflow</p>
                  <p className="text-xs text-muted-foreground">Arma Secreta de Insta</p>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                Ativo
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-3">
                <Instagram className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Instagram API</p>
                  <p className="text-xs text-muted-foreground">Graph API v21.0</p>
                </div>
              </div>
              <Badge className="bg-primary/20 text-primary border-primary/30">
                Conectado
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-accent border border-border">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Webhooks</p>
                  <p className="text-xs text-muted-foreground">3 endpoints ativos</p>
                </div>
              </div>
              <Badge variant="outline">Configurado</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

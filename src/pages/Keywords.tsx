import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Hash, Plus, Pencil, Trash2, Link, Zap, MessageSquare } from "lucide-react";
import { useAutomation } from "@/hooks/useAutomation";
import { toast } from "sonner";
import type { Keyword } from "@/types/automation";

export default function Keywords() {
  const { keywords, addKeyword, updateKeyword, deleteKeyword, toggleKeyword } = useAutomation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<Keyword | null>(null);
  const [formData, setFormData] = useState({
    word: "",
    link: "",
    message: "",
    buttonText: "",
    enabled: true,
  });

  const resetForm = () => {
    setFormData({
      word: "",
      link: "",
      message: "",
      buttonText: "",
      enabled: true,
    });
    setEditingKeyword(null);
  };

  const handleOpenDialog = (keyword?: Keyword) => {
    if (keyword) {
      setEditingKeyword(keyword);
      setFormData({
        word: keyword.word,
        link: keyword.link,
        message: keyword.message,
        buttonText: keyword.buttonText,
        enabled: keyword.enabled,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.word.trim()) {
      toast.error("Digite uma palavra-chave");
      return;
    }
    if (!formData.link.trim()) {
      toast.error("Digite um link");
      return;
    }

    if (editingKeyword) {
      updateKeyword(editingKeyword.id, formData);
      toast.success("Palavra-chave atualizada!");
    } else {
      addKeyword(formData);
      toast.success("Palavra-chave adicionada!");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteKeyword(id);
    toast.success("Palavra-chave removida!");
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Palavras-Chave</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os triggers da sua automação
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Palavra
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingKeyword ? "Editar Palavra-Chave" : "Nova Palavra-Chave"}
              </DialogTitle>
              <DialogDescription>
                Configure o trigger e a resposta automática
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="word">Palavra-Chave</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="word"
                    placeholder="quero"
                    value={formData.word}
                    onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Link de Destino</Label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="link"
                    placeholder="https://..."
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  placeholder="Opa, vi que você teve interesse..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonText">Texto do Botão</Label>
                <Input
                  id="buttonText"
                  placeholder="Comprar Agora"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="enabled">Ativar imediatamente</Label>
                <Switch
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                {editingKeyword ? "Salvar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Keywords List */}
      <div className="grid gap-4">
        {keywords.map((keyword) => (
          <Card key={keyword.id} className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Left side - Keyword info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={keyword.enabled ? "default" : "secondary"}
                      className="font-mono text-base px-3 py-1"
                    >
                      #{keyword.word}
                    </Badge>
                    <Switch
                      checked={keyword.enabled}
                      onCheckedChange={() => toggleKeyword(keyword.id)}
                    />
                    {keyword.enabled ? (
                      <span className="text-xs text-green-600 font-medium">Ativo</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Inativo</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Link className="h-4 w-4" />
                      <span className="truncate max-w-[200px]">{keyword.link}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-primary" />
                      <span>{keyword.triggersCount} triggers</span>
                    </div>
                  </div>

                  {keyword.message && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/30 border border-border">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-foreground">{keyword.message}</p>
                        {keyword.buttonText && (
                          <Badge variant="outline" className="mt-2">
                            {keyword.buttonText}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenDialog(keyword)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover palavra-chave?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Isso vai remover o trigger #{keyword.word} da automação.
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(keyword.id)}>
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {keywords.length === 0 && (
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Hash className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">
                Nenhuma palavra-chave
              </h3>
              <p className="text-muted-foreground text-center max-w-sm">
                Adicione sua primeira palavra-chave para começar a automatizar
                suas respostas no Instagram.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

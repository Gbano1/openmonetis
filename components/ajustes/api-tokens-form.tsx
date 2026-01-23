"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  RiSmartphoneLine,
  RiDeleteBinLine,
  RiAddLine,
  RiFileCopyLine,
  RiCheckLine,
  RiAlertLine,
} from "@remixicon/react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { createApiTokenAction, revokeApiTokenAction } from "@/app/(dashboard)/ajustes/actions";

interface ApiToken {
  id: string;
  name: string;
  tokenPrefix: string;
  lastUsedAt: Date | null;
  lastUsedIp: string | null;
  createdAt: Date;
  expiresAt: Date | null;
  revokedAt: Date | null;
}

interface ApiTokensFormProps {
  tokens: ApiToken[];
}

export function ApiTokensForm({ tokens }: ApiTokensFormProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [tokenName, setTokenName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeTokens = tokens.filter((t) => !t.revokedAt);

  const handleCreate = async () => {
    if (!tokenName.trim()) return;

    setIsCreating(true);
    setError(null);

    try {
      const result = await createApiTokenAction({ name: tokenName.trim() });

      if (result.success && result.data?.token) {
        setNewToken(result.data.token);
        setTokenName("");
      } else {
        setError(result.error || "Erro ao criar token");
      }
    } catch {
      setError("Erro ao criar token");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async () => {
    if (!newToken) return;

    try {
      await navigator.clipboard.writeText(newToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = newToken;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRevoke = async () => {
    if (!revokeId) return;

    setIsRevoking(true);

    try {
      const result = await revokeApiTokenAction({ tokenId: revokeId });

      if (!result.success) {
        setError(result.error || "Erro ao revogar token");
      }
    } catch {
      setError("Erro ao revogar token");
    } finally {
      setIsRevoking(false);
      setRevokeId(null);
    }
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setNewToken(null);
    setTokenName("");
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Dispositivos conectados</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie os dispositivos que podem enviar notificações para o OpenSheets.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          if (!open) handleCloseCreate();
          else setIsCreateOpen(true);
        }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <RiAddLine className="h-4 w-4 mr-1" />
              Novo Token
            </Button>
          </DialogTrigger>
          <DialogContent>
            {!newToken ? (
              <>
                <DialogHeader>
                  <DialogTitle>Criar Token de API</DialogTitle>
                  <DialogDescription>
                    Crie um token para conectar o OpenSheets Companion no seu dispositivo Android.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="tokenName">Nome do dispositivo</Label>
                    <Input
                      id="tokenName"
                      placeholder="Ex: Meu Celular, Galaxy S24..."
                      value={tokenName}
                      onChange={(e) => setTokenName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreate();
                      }}
                    />
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <RiAlertLine className="h-4 w-4" />
                      {error}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseCreate}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreate} disabled={isCreating || !tokenName.trim()}>
                    {isCreating ? "Criando..." : "Criar Token"}
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Token Criado</DialogTitle>
                  <DialogDescription>
                    Copie o token abaixo e cole no app OpenSheets Companion. Este token
                    <strong> não será exibido novamente</strong>.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Seu token de API</Label>
                    <div className="relative">
                      <Input
                        value={newToken}
                        readOnly
                        className="pr-10 font-mono text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={handleCopy}
                      >
                        {copied ? (
                          <RiCheckLine className="h-4 w-4 text-green-500" />
                        ) : (
                          <RiFileCopyLine className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 p-3 text-sm text-amber-800 dark:text-amber-200">
                    <p className="font-medium">Importante:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Guarde este token em local seguro</li>
                      <li>Ele não será exibido novamente</li>
                      <li>Use-o para configurar o app Android</li>
                    </ul>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCloseCreate}>Fechar</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {activeTokens.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <RiSmartphoneLine className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              Nenhum dispositivo conectado.
            </p>
            <p className="text-sm text-muted-foreground">
              Crie um token para conectar o app OpenSheets Companion.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {activeTokens.map((token) => (
            <Card key={token.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-muted p-2">
                      <RiSmartphoneLine className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{token.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {token.tokenPrefix}...
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {token.lastUsedAt ? (
                          <span>
                            Usado{" "}
                            {formatDistanceToNow(token.lastUsedAt, {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                            {token.lastUsedIp && (
                              <span className="text-xs ml-1">
                                ({token.lastUsedIp})
                              </span>
                            )}
                          </span>
                        ) : (
                          <span>Nunca usado</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Criado em{" "}
                        {new Date(token.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setRevokeId(token.id)}
                  >
                    <RiDeleteBinLine className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Revoke Confirmation Dialog */}
      <AlertDialog open={!!revokeId} onOpenChange={(open) => !open && setRevokeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revogar token?</AlertDialogTitle>
            <AlertDialogDescription>
              O dispositivo associado a este token será desconectado e não poderá mais
              enviar notificações. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRevoking}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              disabled={isRevoking}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isRevoking ? "Revogando..." : "Revogar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

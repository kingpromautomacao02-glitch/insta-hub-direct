# Guia Rápido - Instagram Automation SaaS

## Como Usar a Aplicação

### 1. Criar Conta
1. Acesse `/signup`
2. Preencha:
   - Nome completo (opcional)
   - Email
   - Senha (mínimo 6 caracteres)
3. Clique em "Criar conta"
4. Você será redirecionado automaticamente para o dashboard

### 2. Fazer Login
1. Acesse `/login`
2. Entre com seu email e senha
3. Clique em "Entrar"

### 3. Adicionar Palavras-Chave
1. Vá para "Palavras-Chave" no menu
2. Clique em "Nova Palavra"
3. Configure:
   - **Palavra-Chave**: palavra que ativa a automação (ex: "quero")
   - **Link de Destino**: URL para enviar ao usuário
   - **Mensagem**: texto da DM automática
   - **Texto do Botão**: texto do botão de ação
   - **Ativar imediatamente**: liga/desliga o trigger
4. Clique em "Adicionar"

### 4. Configurar Instagram e n8n
1. Vá para "Configurações"
2. Preencha suas credenciais:
   - **Token de Acesso**: token do Instagram Graph API
   - **ID do Instagram**: ID da sua conta profissional
   - **URL Base do n8n**: endereço do seu servidor n8n
   - **API Key**: chave de API do n8n
3. Configure comportamento:
   - **Delay entre respostas**: segundos de espera
   - **Responder comentários**: ativa resposta automática
   - **Enviar DM automática**: ativa envio de DM
4. Clique em "Salvar Alterações"

### 5. Gerenciar Perfil
1. Clique no seu avatar no rodapé do menu lateral
2. Selecione "Perfil"
3. Atualize suas informações
4. Clique em "Salvar Alterações"

## Funcionalidades

### Dashboard
- Visualize estatísticas em tempo real
- Veja palavras-chave ativas
- Status da conexão com Instagram e n8n

### Palavras-Chave
- Crie triggers ilimitados
- Edite ou exclua keywords existentes
- Ative/desative palavras individualmente
- Cada palavra pode ter link, mensagem e botão personalizados

### Configurações
- Configure API do Instagram
- Integre com n8n
- Ajuste comportamento da automação
- Visualize webhooks configurados

## Segurança e Privacidade

### Dados Isolados
- Cada usuário tem seus próprios dados
- Impossível ver ou modificar dados de outros usuários
- Row Level Security (RLS) ativa no banco de dados

### Autenticação
- Senhas criptografadas com Supabase Auth
- Sessões seguras com tokens JWT
- Logout em todos os dispositivos quando necessário

## Estrutura de Dados

### Sua Conta Contém
- **Perfil**: nome, email, avatar
- **Keywords**: suas palavras-chave e triggers
- **Configuração**: credenciais API e preferências

### Persistência
- Todos os dados são salvos automaticamente
- Dados permanecem após logout
- Sincronização em tempo real entre dispositivos

## Fluxo de Trabalho Típico

1. **Setup Inicial**
   - Criar conta
   - Configurar Instagram API
   - Configurar n8n

2. **Criar Automações**
   - Adicionar palavras-chave
   - Configurar mensagens e links
   - Ativar triggers

3. **Monitorar**
   - Ver estatísticas no dashboard
   - Acompanhar triggers executados
   - Verificar status das conexões

4. **Ajustar**
   - Editar palavras-chave conforme necessário
   - Ajustar delays e comportamentos
   - Desativar/reativar triggers

## Dicas

### Melhores Práticas
- Use palavras-chave específicas para evitar falsos positivos
- Configure delays adequados para parecer mais humano
- Teste suas mensagens antes de ativar em produção
- Monitore regularmente o dashboard

### Otimização
- Desative keywords que não estão performando
- Ajuste mensagens baseado em feedback
- Use links rastreáveis (UTM params)

### Segurança
- Nunca compartilhe suas credenciais API
- Use senhas fortes
- Faça logout em computadores públicos
- Verifique regularmente suas configurações

## Solução de Problemas

### Não Consigo Ver Minhas Palavras-Chave
- Verifique se está logado
- Atualize a página (F5)
- Verifique o console do navegador

### Configurações Não Salvam
- Certifique-se de clicar em "Salvar Alterações"
- Verifique conexão com internet
- Tente fazer logout e login novamente

### Erro ao Criar Conta
- Verifique se o email já não está cadastrado
- Senha deve ter no mínimo 6 caracteres
- Tente usar outro navegador

## Suporte

### Recursos Disponíveis
- `TESTING_GUIDE.md` - Guia completo de testes
- `implementation_plan.md` - Detalhes técnicos
- Dashboard Supabase - Verificar logs do banco

### Logs e Debug
- Abra o Console do Navegador (F12)
- Verifique erros em vermelho
- Verifique aba Network para requisições

## Próximos Passos

### Funcionalidades Futuras
- [ ] Analytics detalhado
- [ ] Exportação de dados
- [ ] Planos de assinatura
- [ ] Equipes e compartilhamento
- [ ] Integrações adicionais
- [ ] Webhooks personalizados

---

**Importante**: Esta é uma aplicação Micro SaaS com multi-tenancy completo. Seus dados estão seguros e isolados de outros usuários.

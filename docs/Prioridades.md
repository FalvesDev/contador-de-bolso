# Prioridades - Contador de Bolso

Ultima atualizacao: 2026-04-16

---

## Concluido

- [x] Transacoes (adicionar, editar, excluir)
- [x] Persistencia local com AsyncStorage
- [x] Parcelas com exclusao por grupo (so esta / todas)
- [x] Edicao de parcelas com escopo (so esta / todas as parcelas)
- [x] Filtros por periodo e categoria na tela de transacoes
- [x] Busca por descricao e categoria
- [x] Orcamento por categoria (BudgetManager)
- [x] Metas financeiras (GoalsCard)
- [x] Meta marcada como concluida automaticamente ao atingir 100%
- [x] Analise de saude financeira com score circular
- [x] Risco de negativar, padroes de gasto
- [x] Sugestoes inteligentes (SmartInsights)
- [x] Gastos futuros projetados (FutureExpenses)
- [x] Temas (claro, escuro e outros)
- [x] Animacoes em todas as 4 telas (Home, Transacoes, Relatorios, Perfil)
- [x] Calendario financeiro com modal de transacoes por dia
- [x] Graficos: pizza, barras, linha
- [x] Notificacoes internas (in-app)
- [x] Notificacoes push (expo-notifications) com throttle de 1h
- [x] Exportacao CSV
- [x] Compartilhar resumo por texto
- [x] Saldo total da conta e reservas na HomeScreen
- [x] Navegacao por mes na HomeScreen
- [x] Haptic feedback nos botoes e acoes principais
- [x] Banco de dados Supabase configurado (schema + RLS + triggers + views)
- [x] Tela de login / cadastro com email e senha
- [x] Modo offline persistido no AsyncStorage
- [x] Tratamento de erros de autenticacao com mensagens claras em portugues
- [x] Memory leak do AuthContext corrigido (subscription.unsubscribe)
- [x] Mapeamento correto category_key no Supabase (era UUID, corrigido para texto)
- [x] Loop de useEffect corrigido no useNotifications (useCallback)
- [x] upsertBudget corrigido (nao usava mais category_id null como chave)
- [x] checkBudgets/checkGoals adicionados nos deps arrays dos useEffects

---

## FASE 2 — Sync Supabase (proxima)

- [ ] **Sincronizacao offline-first**
  - Ao fazer login, migrar dados do AsyncStorage para o Supabase
  - Manter dados sincronizados em tempo real
  - Resolver conflitos por timestamp (ultimo salvo ganha)
  - Indicador visual de sync no header

- [ ] **Campo de parcelas no AddTransactionModal**
  - Mostrar opcao "Parcelar em X vezes" ao adicionar despesa (visivel na UI)
  - Preview do valor de cada parcela

- [ ] **Backup e restauracao de dados**
  - Exportar todos os dados em JSON
  - Importar JSON para restaurar (troca de celular)

---

## FASE 3 — Captura Automatica (Android)

- [ ] **NotificationListener**
  - Ler notificacoes de Nubank, Inter, C6, Itau, Bradesco etc.
  - Parser extrai: valor + descricao + banco
  - Modal de confirmacao ao detectar gasto
  - Modo automatico vs. confirmacao manual
  - iOS: inviavel por restricoes da Apple

- [ ] **Open Finance via Pluggy/Belvo**
  - Conectar conta bancaria via Open Finance do Banco Central
  - Importar extrato automaticamente
  - Custo: ~R$0,50/conexao/mes

---

## Media Prioridade (Fase 4+)

- [ ] **Tela de detalhes por categoria**
  - Ao tocar em categoria no relatorio, abrir historico completo
  - Grafico de evolucao mensal da categoria
  - Comparativo com mes anterior

- [ ] **Modo de planejamento mensal**
  - Definir meta de gastos por categoria antes do mes comecar
  - Acompanhar progresso em tempo real

- [ ] **Tela de metas melhorada**
  - Adicionar aporte manual
  - Historico de aportes
  - Projecao de quando vai atingir a meta

---

## Baixa Prioridade

- [ ] Relatorio em PDF (mensal com graficos)
- [ ] Modo familiar (multiplos usuarios, gastos compartilhados)
- [ ] Widget na home do celular (saldo + adicao rapida)
- [ ] Importar extrato OFX

---

## Bugs Conhecidos / Melhorias Tecnicas

- [ ] Animacoes para graficos (draw animation no PieChart e BarChart)
- [ ] Gesture-based animations (swipe para deletar transacao)
- [ ] Testar performance em dispositivos low-end
- [ ] Adicionar testes automatizados (Jest + Testing Library)
- [ ] Revisar acessibilidade (screen readers, fontes grandes)

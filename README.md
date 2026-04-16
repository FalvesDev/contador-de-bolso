# Contador de Bolso

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" />
</p>

> Aplicativo mobile de financas pessoais com graficos, animacoes, notificacoes push e suporte a modo offline.

---

## Sobre

**Contador de Bolso** e um app de controle financeiro pessoal construido com React Native + Expo. O objetivo e oferecer uma experiencia fluida e moderna para quem quer acompanhar receitas e despesas sem complicacao.

Funciona completamente **offline** (AsyncStorage) ou **sincronizado com a nuvem** via Supabase.

---

## Funcionalidades

| Feature | Status |
|---|---|
| Dashboard com saldo, receitas e despesas | OK |
| Cadastro de receitas e despesas com categorias | OK |
| Parcelamento com exclusao/edicao por grupo | OK |
| Orcamentos por categoria com alertas visuais | OK |
| Metas financeiras com progresso automatico | OK |
| Score de saude financeira + SmartInsights | OK |
| Projecao de gastos futuros | OK |
| Calendario financeiro com transacoes por dia | OK |
| Graficos: pizza, barras, linha | OK |
| Animacoes em todas as telas | OK |
| Haptic feedback | OK |
| Notificacoes push (alertas de orcamento + lembrete diario) | OK |
| 15 temas visuais | OK |
| Entrada por voz | OK |
| Exportar CSV + compartilhar resumo em texto | OK |
| Login / cadastro com email e senha (Supabase) | OK |
| Modo offline persistido | OK |
| Sincronizacao Supabase (offline-first) | Em desenvolvimento |
| Captura automatica via notificacoes bancarias | Planejado |

---

## Stack

| Tecnologia | Uso |
|---|---|
| React Native 0.81 | Framework mobile cross-platform |
| Expo SDK 54 | Toolchain e APIs nativas |
| TypeScript | Tipagem estatica |
| AsyncStorage | Persistencia local offline |
| Supabase | Autenticacao e banco PostgreSQL na nuvem |
| react-native-svg | Graficos e SVG |
| expo-haptics | Feedback tatil |
| expo-notifications | Notificacoes push |
| expo-speech | Entrada por voz |
| expo-sharing + expo-file-system | Exportacao de dados |
| date-fns | Manipulacao de datas |

---

## Como rodar

```bash
git clone https://github.com/FalvesDev/contador-de-bolso.git
cd contador-de-bolso
npm install
npx expo start
```

Escaneie o QR code com o **Expo Go** no celular.

---

## Configurar Supabase (opcional)

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute no SQL Editor:
   - `docs/schema.sql`
   - `docs/migration_001_category_key.sql`
3. Atualize as credenciais em `src/services/supabase.ts`

Sem isso, o app funciona normalmente em **modo offline**.

---

## Estrutura

```
src/
  components/     # UI reutilizavel (cards, graficos, modais, animacoes)
  contexts/       # AuthContext, ThemeContext
  hooks/          # useLocalTransactions, useBudgets, useGoals, useNotifications
  screens/        # Home, Transacoes, Relatorios, Perfil
  services/       # supabase.ts, notificationsService.ts, exportService.ts
  constants/      # categorias, temas, spacing
docs/
  Prioridades.md                   # Backlog e roadmap
  schema.sql                       # Schema principal do Supabase
  migration_001_category_key.sql   # Migracao de compatibilidade
```

---

## Roadmap

Ver [docs/Prioridades.md](docs/Prioridades.md) para o planejamento completo.

Proximas fases:
- **Fase 2** — Sincronizacao Supabase (offline-first)
- **Fase 3** — Captura automatica via notificacoes bancarias (Android)

---

<p align="center">Desenvolvido por <a href="https://falves.dev">Felipe Alves</a></p>

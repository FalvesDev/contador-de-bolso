# Contador de Bolso 💰

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" />
</p>

> Aplicativo mobile de finanças pessoais com entrada por voz, gráficos e 15 temas.

---

## Sobre

**Contador de Bolso** é um app de controle financeiro pessoal construído com React Native + Expo. O objetivo é oferecer uma experiência fluida e moderna para quem quer acompanhar receitas e despesas sem complicação — com suporte a entrada por voz, múltiplos temas visuais e relatórios por categoria.

### O Problema

A maioria dos apps de finanças é complexa demais ou exige cadastro em serviços pagos. Queria algo simples, bonito e que funcionasse tanto online quanto offline.

### A Solução

App mobile completo com autenticação via Supabase, persistência local com AsyncStorage, entrada de transações por voz (expo-speech), gráficos de pizza e barras, e 15 temas de cor configuráveis.

---

## Funcionalidades

| Feature | Status |
|---|---|
| Dashboard com saldo total | ✅ |
| Cadastro de receitas e despesas | ✅ |
| Categorias personalizadas | ✅ |
| Entrada por voz | ✅ |
| 15 temas visuais | ✅ |
| Relatórios por período e categoria | ✅ |
| Exportar dados (CSV/PDF) | 🔄 Em desenvolvimento |
| Persistência offline (AsyncStorage) | 🔄 Em desenvolvimento |
| Sincronização com Supabase | 🔄 Em desenvolvimento |

---

## Stack

| Tecnologia | Uso |
|---|---|
| **React Native** | Framework mobile cross-platform |
| **Expo SDK 54** | Toolchain e APIs nativas |
| **TypeScript** | Tipagem estática |
| **Supabase** | Autenticação e banco de dados |
| **expo-speech** | Entrada por voz |
| **react-native-svg** | Gráficos e visualizações |
| **date-fns** | Manipulação de datas |

---

## Estrutura

```
src/
├── components/    # Componentes reutilizáveis
├── constants/     # Temas, cores e constantes
├── contexts/      # Contextos de estado global
├── hooks/         # Custom hooks
├── screens/       # Telas do app
│   ├── AuthScreen.tsx
│   ├── HomeScreen.tsx
│   ├── TransactionsScreen.tsx
│   ├── ReportsScreen.tsx
│   └── ProfileScreen.tsx
├── services/      # Integração com Supabase
└── types/         # Tipos TypeScript
```

---

## Como rodar

```bash
# Clone o repositório
git clone https://github.com/FalvesDev/contador-de-bolso.git
cd contador-de-bolso

# Instale as dependências
npm install

# Configure o Supabase
# Crie um arquivo .env com:
# SUPABASE_URL=sua_url
# SUPABASE_ANON_KEY=sua_chave

# Inicie o projeto
npx expo start
```

---

## Roadmap

Veja o [ROADMAP.md](ROADMAP.md) para acompanhar as próximas funcionalidades planejadas.

---

<p align="center">Desenvolvido por <a href="https://falves.dev">Felipe Alves</a></p>

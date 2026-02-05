# PRD — Cartola Minimal (MVP)

**Versão:** 1.0  
**Status:** MVP definido para execução  
**Produto:** Web App / PWA não-oficial para acompanhamento de parciais do Cartola FC  
**Design System:** shadcn/ui (Radix + Tailwind)

---

## 1. Visão do Produto

### 1.1 Objetivo
Construir um aplicativo minimalista para **acompanhar as parciais do Cartola FC**, focado em:
- **Meu Time**: parciais apenas dos atletas do usuário
- **Parciais Gerais**: lista completa de atletas pontuados para consulta

O app é **não-oficial**, não substitui o Cartola e não permite escalar/salvar times.

---

### 1.2 Problema
O app oficial do Cartola é percebido como:
- poluído visualmente
- lento para consultas rápidas
- com excesso de navegação para ver informações simples

Usuários querem:
- leitura rápida durante os jogos
- foco total no próprio time
- total parcial claro e imediato

---

### 1.3 Público-alvo
- Jogadores ativos do Cartola FC
- Usuários mobile-first
- Pessoas que acompanham jogos ao vivo (TV + celular)

---

### 1.4 Proposta de Valor
> “Acompanhe seu time do Cartola em tempo real, sem distrações.”

---

## 2. Escopo

### 2.1 Escopo do MVP (P0)

#### Funcionalidades Core
1. Conectar um time via **slug**
2. Persistir slug localmente
3. Buscar escalação do time
4. Buscar parciais da rodada
5. Cruzar escalação × parciais por `atleta_id`
6. Calcular total parcial com **capitão em dobro**
7. Aba **Meu Time**
8. Aba **Parciais (Geral)**
9. Atualização manual dos dados
10. Rodar como web app e **PWA (modo standalone)**
11. Botão **“Abrir no navegador”** quando em modo PWA

---

### 2.2 Fora do Escopo (P1+)
- Login Conta Globo
- Escalar ou salvar time no Cartola
- Ligas / rankings
- Histórico de rodadas
- Notificações push
- Monetização no MVP

---

## 3. Fluxos do Usuário

### 3.1 Primeiro Acesso
1. Usuário abre o app
2. Vê tela “Conecte seu time”
3. Insere slug do time
4. App valida via API pública
5. Slug é salvo localmente
6. App exibe “Meu Time” com parciais

---

### 3.2 Uso Recorrente
1. App abre direto em “Meu Time”
2. Usuário vê total parcial, capitão e lista
3. Usuário toca em “Atualizar”
4. Usuário navega para “Parciais” (geral)

---

### 3.3 Modo PWA
1. Usuário adiciona à tela inicial
2. App roda em modo standalone
3. Se standalone, exibir botão “Abrir no navegador”

---

## 4. Requisitos Funcionais

### RF01 — Conectar Time
- Entrada: slug (string)
- Validação via endpoint público
- Persistência local (localStorage)

---

### RF02 — Buscar Escalação
- Endpoint público por slug
- Retorna:
  - nome do time
  - nome do cartoleiro
  - lista de atletas (`atleta_id`)
  - capitão (`capitao_id`)

---

### RF03 — Buscar Parciais
- Endpoint público de atletas pontuados
- Retorna parciais por `atleta_id`
- Cache curto (30–60s)
- Atualização manual

> “Parciais gerais” = atletas com parcial disponível no endpoint.

---

### RF04 — Cálculo de Pontuação
- Pontuação individual por atleta
- Capitão com multiplicador 2x
- Soma do total parcial do time

---

### RF05 — Aba “Meu Time”
Exibir:
- Rodada atual / status do mercado (se disponível)
- Total parcial do time
- Lista do time ordenada por pontuação
- Capitão destacado
- Botão “Atualizar”

---

### RF06 — Aba “Parciais (Geral)”
Exibir:
- Lista de atletas pontuados
- Ordenação padrão: pontos desc
- Uso apenas para consulta

---

### RF07 — Web / PWA
- App deve rodar no navegador mobile
- App deve ser instalável como PWA
- Detectar modo standalone
- Exibir botão “Abrir no navegador” quando standalone

---

## 5. Requisitos Não Funcionais

### RNF01 — Performance
- Render rápido (< 1s com cache)
- Requests server-side (proxy)

---

### RNF02 — Confiabilidade
- Tratar erros de API
- Mensagens claras ao usuário

---

### RNF03 — UX/UI
- Design minimalista
- Leitura rápida
- Sem ruído visual

---

### RNF04 — Legal
- Disclaimer visível:
  > “Este aplicativo não é afiliado à Globo ou ao Cartola FC.”
- Não usar marcas/logos oficiais

---

## 6. Design System — shadcn/ui

### 6.1 Biblioteca
- shadcn/ui
- Radix UI
- TailwindCSS

---

### 6.2 Componentes Base
- Tabs (Meu Time / Parciais)
- Button
- Input
- Card / List
- Badge (capitão)
- Skeleton (loading)
- Toast (erro/sucesso)
- Separator

---

### 6.3 Estilo
- Tema claro (MVP)
- Espaçamento consistente
- Tipografia simples
- Dark mode opcional (P1)

---

## 7. Stack Técnica

### Frontend
- Next.js (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui

---

### Backend (Proxy)
- API Routes Next.js
  - `/api/cartola/status`
  - `/api/cartola/pontuados`
  - `/api/cartola/time?slug=`

---

### Persistência
- MVP: localStorage
- Futuro: Supabase

---

## 8. Definition of Done (DoD)

- App funciona em mobile web
- App instalável como PWA
- Aba “Meu Time” funcional
- Aba “Parciais” funcional
- Total com capitão 2x correto
- Loading, erro e empty states tratados
- UI feita com shadcn/ui

---

## 9. Métricas de Sucesso

- Conectar time em < 1 minuto
- Usuário entende total e capitão em < 3 segundos
- Uso recorrente durante rodada

---

## 10. Roadmap

### P0 — MVP
- Meu Time
- Parciais Gerais
- PWA

### P1
- Busca e filtros
- Multi-times
- Dark mode

### P2
- Histórico
- Notificações
- Plano Pro

---

## 11. Backlog Técnico

### Épico 1 — Infra + Design System
- Setup Next.js
- TailwindCSS
- shadcn/ui
- Componentes base

---

### Épico 2 — Integração Cartola
- Proxy APIs
- Cache curto
- Tipagem dos dados

---

### Épico 3 — Estado
- Store global
- Persistência slug
- Estados loading/error

---

### Épico 4 — Meu Time
- Tela conectar
- Lista do time
- Total parcial
- Capitão

---

### Épico 5 — Parciais Gerais
- Lista geral
- Ordenação
- Performance de lista

---

### Épico 6 — UX
- Skeleton
- Toast
- Empty states

---

### Épico 7 — PWA
- Manifest
- Ícones
- Standalone detect
- Abrir no navegador

---

### Épico 8 — Legal
- Disclaimer
- Copy básica

---

## 12. Riscos e Mitigações

### Risco
Mudança na API pública

### Mitigação
- Cache curto
- Data layer isolado
- Mensagens claras ao usuário

---

## 13. Prompt para Codex (Cursor)

Você é um Product Engineer sênior.

Vou anexar este PRD do app **Cartola Minimal (MVP)**.

Objetivo:
- Implementar o MVP end-to-end usando:
  - Next.js (App Router)
  - TypeScript
  - TailwindCSS
  - shadcn/ui

Requisitos obrigatórios:
- Conectar time via slug
- Proxy server-side para APIs do Cartola
- Aba “Meu Time” com total parcial e capitão 2x
- Aba “Parciais” com lista geral
- PWA instalável
- Detectar modo standalone
- Botão “Abrir no navegador”
- Loading/erro/empty states
- Disclaimer legal

Implemente por épicos, seguindo fielmente este PRD.
Priorize simplicidade, robustez e UI minimalista.

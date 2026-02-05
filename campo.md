Objetivo

Na tela Meu Time, o usuário deve conseguir alternar entre:

Lista (padrão atual)

Campo (visualização em um campinho com jogadores posicionados)

Comportamento esperado

O app deve lembrar a escolha do usuário (persistir em localStorage).

Ao trocar, não refaz a conexão, apenas muda a renderização.

A visualização “Campo” deve exibir:

um campo de futebol

jogadores em posições (com apelido + pontos)

capitão destacado

total parcial continua no topo (igual)

Requisitos Funcionais (RF novos)
RF08 — Alternar Visualização (Lista / Campo)

Componente de seleção: Tabs ou ToggleGroup (shadcn/ui)

Default: Lista

Persistência: viewMode = "list" | "field" em localStorage

Critérios de aceite

 Trocar o modo altera apenas a UI, sem quebrar estados

 Modo selecionado persiste ao reabrir o app

RF09 — Visualização em Campo
Entrada de dados

Usar a escalação já carregada do time:

posicao_id do atleta

capitao_id

parcial por atleta_id

Regras de posicionamento (MVP)

Como o Cartola fornece posicao_id, no MVP você pode mapear para linhas fixas:

Goleiro: 1 slot

Zagueiros: até 2 slots

Laterais: até 2 slots

Meias: até 3 slots

Atacantes: até 3 slots

Técnico: 1 slot (embaixo do campo ou na lateral)

Observação: no MVP não precisa desenhar “formação real” (4-3-3 etc). Basta agrupar por posição e distribuir os jogadores por linha.

Layout do campo (MVP)

Container com proporção de campo (ex.: 3:2 ou 16:10)

Fundo verde (ou neutro) com linhas simples (opcional)

Jogadores como “chips”/cards pequenos:

apelido

pontos

badge ⭐ para capitão

Interações (MVP)

Nenhuma interação complexa (sem drag-and-drop)

(Opcional): tocar no jogador abre um popover com scouts

Critérios de aceite

 Campo renderiza em mobile sem overflow quebrado

 Jogadores aparecem agrupados por linha/posição

 Capitão está destacado visualmente

 Pontos exibidos em cada jogador

 Se faltar jogador em uma posição, a linha fica com menos slots

Requisitos Não Funcionais (RNF adicionais)

Responsivo: deve funcionar bem em telas pequenas (iPhone)

Performance: não pode travar com re-render (usar useMemo e componentes puros)

Design (shadcn/ui) — recomendação de componentes
Alternância Lista/Campo

Tabs (shadcn/ui) com dois itens: Lista e Campo

Simples e consistente com o resto do app

Alternativamente: ToggleGroup (fica ainda mais compacto)

Jogador no campo

Card pequeno ou Badge + Text

Badge para capitão

Skeleton enquanto carrega

Tasks (quebra pra execução)
Épico 4 (Meu Time) — extensão

Feature 4.6 — View Mode

 Adicionar viewMode no store (zustand ou state local)

 Persistir viewMode no localStorage

 UI toggle Lista | Campo usando shadcn/ui

 Default = Lista

Feature 4.7 — Campo

 Criar componente FieldView.tsx

 Criar função groupPlayersByPosition(atletas) com mapeamento por posicao_id

 Definir layout do campo (CSS/Tailwind)

 Renderizar linhas por posição (GK/DEF/MID/FWD/COACH)

 Componente PlayerChip com apelido + pontos + capitão

Feature 4.8 — Responsividade

 Ajustar escalas de texto e espaçamento no mobile

 Garantir que o campo não estoure a tela

Estrutura sugerida de arquivos

src/components/my-team/ViewModeToggle.tsx

src/components/my-team/TeamListView.tsx (o que já existe, isolado)

src/components/my-team/TeamFieldView.tsx (novo)

src/components/my-team/PlayerChip.tsx

src/lib/positions.ts (mapeamentos por posicao_id)
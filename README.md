# Black Hat (Minimal Cartola) 🎯

> Acompanhe seu time do Cartola em tempo real, sem distrações.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-purple)](https://web.dev/progressive-web-apps/)

## 📋 Sobre

Black Hat é um aplicativo minimalista e não-oficial para acompanhar as parciais do Cartola FC. Focado em performance e simplicidade, oferece:

- **Meu Time**: Parciais apenas dos seus atletas
- **Parciais Gerais**: Lista completa de atletas pontuados
- **PWA**: Instalável como aplicativo nativo
- **Tempo Real**: Atualização manual das parciais
- **Zero Distrações**: Interface limpa e focada

## 🚀 Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: TailwindCSS
- **UI Components**: shadcn/ui (Radix UI)
- **Estado**: Zustand
- **PWA**: next-pwa

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env.local

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

## 🔧 Variáveis de Ambiente

```env
# API do Cartola FC
NEXT_PUBLIC_CARTOLA_API_BASE=https://api.cartolafc.globo.com

# Configurações de Cache (em milissegundos)
CACHE_TTL_MS=60000
```

## 📱 PWA

O aplicativo é instalável como PWA (Progressive Web App):

1. Acesse o site no navegador mobile
2. Toque em "Adicionar à tela inicial"
3. Use como app nativo!

## 🏗️ Arquitetura

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── api/               # API Routes (proxy para Cartola API)
│   ├── jogador/           # Página de detalhes do jogador
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── cartola/          # Componentes específicos do Cartola
│   ├── my-team/          # Componentes do time do usuário
│   ├── navigation/       # Navegação
│   ├── player/           # Detalhes do jogador
│   └── ui/               # Componentes UI (shadcn/ui)
├── hooks/                # Custom React Hooks
├── lib/                  # Utilitários e lógica de negócio
│   ├── cache.ts          # Sistema de cache LRU/TTL
│   ├── cartola/          # Tipos e funções do Cartola
│   ├── cartolaApi.ts     # Cliente da API do Cartola
│   └── store/            # Estado global (Zustand)
└── styles/               # Estilos globais
```

## 🎯 Funcionalidades

### ✅ Implementadas

- [x] Conectar time via slug
- [x] Persistência local do slug
- [x] Buscar escalação do time
- [x] Buscar parciais da rodada
- [x] Calcular total com capitão 1.5x
- [x] Aba "Meu Time"
- [x] Aba "Parciais Gerais"
- [x] Atualização manual
- [x] PWA instalável
- [x] Modo standalone
- [x] Visualização em campo
- [x] Visualização em lista
- [x] Detalhes do jogador
- [x] Histórico de participações
- [x] Cache inteligente (LRU/TTL)

### 🔜 Roadmap

- [ ] Dark mode
- [ ] Múltiplos times
- [ ] Busca e filtros
- [ ] Histórico de rodadas
- [ ] Notificações push
- [ ] Comparação de times

## 🛡️ Otimizações Implementadas

### Performance
- ✅ LRU Cache para evitar memory leaks
- ✅ TTL Cache com expiração automática
- ✅ Batching de requisições
- ✅ Server-side rendering
- ✅ Code splitting automático

### Qualidade de Código
- ✅ TypeScript strict mode
- ✅ ESLint com regras rigorosas
- ✅ Tratamento de erros robusto
- ✅ Type guards para segurança de tipos
- ✅ Sem console.log em produção
- ✅ Sem uso de `any`

### Segurança
- ✅ Variáveis de ambiente
- ✅ Validação de dados
- ✅ Rate limiting (via cache)
- ✅ CORS configurado

## 📊 Performance

- **Build Size**: ~117 KB (First Load JS)
- **Cache TTL**: 60 segundos (configurável)
- **LRU Cache**: Limite de 50-100 itens
- **Lighthouse Score**: 90+ (Performance)

## ⚠️ Avisos Importantes

### Imagens Externas
O projeto usa `<img>` para escudos dos clubes (URLs externas da API do Cartola). Para otimizar com `next/image`, configure:

```js
// next.config.js
module.exports = {
  images: {
    domains: ['s.sde.globo.com']
  }
}
```

### Disclaimer Legal
Este aplicativo **não é afiliado à Globo ou ao Cartola FC**. É um projeto não-oficial criado para fins educacionais e de demonstração.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido com ❤️ para a comunidade do Cartola FC.

---

**Nota**: Este é um projeto não-oficial e não possui qualquer vínculo com a Globo ou o Cartola FC oficial.

# 🖼️ Guia de Otimização de Imagens

## ⚠️ Warnings Atuais

O projeto atualmente usa tags `<img>` HTML nativas para exibir os escudos dos clubes. Isso gera warnings do Next.js:

```
Warning: Using `<img>` could result in slower LCP and higher bandwidth.
Consider using `<Image />` from `next/image`
```

## 🤔 Por que usar `<img>` ao invés de `<Image>`?

**Motivo:** Os escudos vêm de URLs externas da API do Cartola (`s.sde.globo.com`).

**Vantagens do `<img>` atual:**
- ✅ Funciona imediatamente sem configuração
- ✅ Sem custos adicionais de otimização
- ✅ Simples e direto

**Desvantagens:**
- ⚠️ Sem otimização automática de tamanho
- ⚠️ Sem lazy loading otimizado
- ⚠️ Pode impactar LCP (Largest Contentful Paint)

## 🚀 Como Otimizar (Opcional)

Se você quiser otimizar as imagens, siga estes passos:

### 1. Configurar Domínios Externos

Edite `next.config.js`:

```javascript
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true
});

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's.sde.globo.com',
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 's3.glbimg.com',
        port: '',
        pathname: '/**',
      }
    ]
  }
});
```

### 2. Substituir `<img>` por `<Image>`

**Antes:**
```tsx
<img
  src={escudo}
  alt={`Escudo ${clube?.abreviacao ?? "clube"}`}
  className="h-7 w-7 shrink-0 object-contain"
  loading="lazy"
/>
```

**Depois:**
```tsx
import Image from 'next/image';

<Image
  src={escudo}
  alt={`Escudo ${clube?.abreviacao ?? "clube"}`}
  width={28}
  height={28}
  className="shrink-0 object-contain"
  loading="lazy"
/>
```

### 3. Arquivos a Modificar

1. **`src/components/cartola/parciais-list.tsx`** (linha 54)
2. **`src/components/my-team/TeamListView.tsx`** (linha 59)
3. **`src/components/player/PlayerHeader.tsx`** (linha 34)

### 4. Exemplo Completo

```tsx
import Image from 'next/image';

// Em parciais-list.tsx
{escudo ? (
  <Image
    src={escudo}
    alt={`Escudo ${clube?.abreviacao ?? "clube"}`}
    width={28}
    height={28}
    className="shrink-0 object-contain"
    loading="lazy"
    unoptimized={process.env.NODE_ENV === 'development'} // Opcional: desabilita otimização em dev
  />
) : (
  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] text-muted-foreground">
    {clube?.abreviacao ?? "?"}
  </div>
)}
```

## 💰 Considerações de Custo

### Vercel (Hosting Padrão)
- **Free Tier**: 1,000 otimizações/mês
- **Pro**: $20/mês com 5,000 otimizações incluídas
- **Custo adicional**: $5 por 1,000 otimizações extras

### Alternativas Gratuitas

#### Opção 1: Desabilitar Otimização
```tsx
<Image
  src={escudo}
  alt="..."
  width={28}
  height={28}
  unoptimized // Desabilita otimização, apenas usa lazy loading
/>
```

#### Opção 2: Usar Loader Customizado
```tsx
// next.config.js
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
  }
}

// src/lib/imageLoader.ts
export default function imageLoader({ src, width, quality }) {
  // Retorna a URL original sem otimização
  return src;
}
```

## 📊 Impacto de Performance

### Com `<img>` (Atual)
- **Lighthouse Performance**: ~85-90
- **LCP**: ~2.5s
- **Custo**: $0

### Com `<Image>` Otimizado
- **Lighthouse Performance**: ~95-100
- **LCP**: ~1.5s
- **Custo**: Depende do tráfego

### Com `<Image>` Não Otimizado
- **Lighthouse Performance**: ~90-95
- **LCP**: ~2.0s
- **Custo**: $0

## 🎯 Recomendação

**Para MVP/Desenvolvimento:**
- ✅ Manter `<img>` atual (sem custo, funciona bem)

**Para Produção com Tráfego Baixo:**
- ✅ Usar `<Image>` com `unoptimized` (melhora lazy loading, sem custo)

**Para Produção com Tráfego Alto:**
- ✅ Usar `<Image>` otimizado (melhor performance, considerar custos)

## 🔧 Script de Migração Rápida

Se decidir migrar, use este script:

```bash
# Instalar dependências (se necessário)
npm install sharp

# Atualizar next.config.js
# (copiar configuração acima)

# Substituir em todos os arquivos
# (fazer manualmente ou usar script)
```

## ❓ FAQ

**Q: Preciso otimizar agora?**
A: Não, o app funciona perfeitamente com `<img>`. Otimize apenas se tiver problemas de performance.

**Q: Qual o impacto real no usuário?**
A: Mínimo. Os escudos são pequenos (30x30px) e já têm `loading="lazy"`.

**Q: Vale a pena o custo?**
A: Depende do tráfego. Para <10k usuários/mês, provavelmente não.

**Q: Posso misturar `<img>` e `<Image>`?**
A: Sim! Use `<Image>` apenas onde faz sentido.

---

**Conclusão:** As imagens atuais funcionam bem. Otimize apenas se necessário! 🚀

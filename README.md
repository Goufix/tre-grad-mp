# TRE | Envio de MPs de graduação

Página usada no fórum para enviar mensagens privadas com materiais de graduação da Companhia dos Treinadores.

## Estrutura

- `forum/index.html`: carregador mínimo para a página personalizada do fórum.
- `public/index.html`: carregador da página publicada no Cloudflare.
- `public/assets/app.js`: renderização da interface, interações e modelos das mensagens.
- `mps/*.bbcode`: modelos das MPs de graduação, sincronizados com `app.js` por `npm run build` (também executado antes de dev, testes e deploy).
- `public/assets/styles.css`: estilos da página.
- `public/_headers`: CORS e cache dos assets consumidos pelo fórum.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Verificações

```bash
npm test
npx wrangler deploy --dry-run
```

## Publicação

```bash
npm run deploy
```

O HTML a ser copiado para a página personalizada do fórum está em `forum/index.html`.

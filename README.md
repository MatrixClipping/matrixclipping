# Matrix Clipping — site e telas da plataforma

Site estático (HTML, CSS e JavaScript puro). Abre com dois cliques no `index.html` e funciona
igual no GitHub Pages, Cloudflare Pages, Netlify ou qualquer hospedagem de arquivos.

## Páginas

| Página               | O que é |
|----------------------|---------|
| `index.html`         | Home: demonstração, as cinco ferramentas, MatrixMeter e MatrixDoc interativos, perguntas |
| `plataforma/`        | Todas as ferramentas |
| `matrixshot/`        | MatrixShot: print e screenshot em lote |
| `matrixmeter/`       | MatrixMeter: altura, largura e centimetragem (demo interativa) |
| `matrixdoc/`         | MatrixDoc: PDF e Excel para JSON, INSERT, API ou relatório (demo interativa) |
| `matrixapi/`         | MatrixAPI: endpoints e segurança |
| `matrixlink/`        | MatrixLink: entrega por webhook, SFTP e e-mail |
| `print-em-lote/`     | Endereço antigo: redireciona para `matrixshot/` |
| `precos/`            | Endereço antigo: redireciona para `plataforma/` |

## Estrutura

```
/
├── assets/
│   ├── css/main.css        Estilo (cores da marca no topo, em :root)
│   ├── js/config.js        ← EDITE AQUI: e-mail, apiBase, exemplo da demonstração
│   ├── js/main.js          Fundo animado, painel 3D, demo automática, lote, abas, menu
│   ├── js/processar.js     Tela Processar (modo demonstração ou API)
│   ├── js/auth.js          Cadastro e login (modo demonstração ou API)
│   └── img/                logo.png, logo@2x.png, favicon.ico, favicon-32.png, apple-touch-icon.png, icon-*.png
├── docs/API.md             Contrato da API que o backend deve implementar
├── robots.txt, sitemap.xml, CNAME
```

## Modo demonstração × API

Enquanto `apiBase` for `null` em `config.js`:
- **Processar** mostra as etapas e, no fim, um resultado de **exemplo**, com aviso claro de que o link não foi lido.
- **Criar conta** e **Entrar** validam os campos e avisam que o acesso será liberado no lançamento. **Nada é enviado.**

Quando o backend estiver no ar, preencha `apiBase` (ex.: `https://api.matrixclipping.com.br`).
Os endpoints esperados estão em `docs/API.md`.

## O que editar

| Quero mudar…                     | Onde |
|----------------------------------|------|
| Desconto anual                   | `config.js` → `annualDiscount` |
| Tabela comparativa               | `config.js` → `comparison` |
| E-mail de contato                | `config.js` → `email` |
| Exemplo da demonstração          | `config.js` → `demoExample` |
| Cores                            | `main.css` → `:root` |
| Logo                             | `assets/img/logo.png` e `logo@2x.png` (mesmos nomes) |
| Textos                           | gerados a partir de `index.html`, `precos/` etc. |

## Métricas do veículo (atenção às licenças)

Os números exibidos são **ilustrativos** e aparecem bloqueados. Dados de audiência de provedores como
Similarweb e Semrush exigem **licença específica** para serem exibidos dentro de um produto vendido a terceiros
(a API comum é para uso interno). Antes de ativar o recurso, contrate a licença de dados (OEM/redistribuição)
com o provedor escolhido e mantenha a atribuição que ele exigir.

## Rodar no computador

Dois cliques no `index.html`, ou:
```bash
python3 -m http.server 8080   # http://localhost:8080
```

## Publicar no GitHub Pages

1. Envie os arquivos para a branch `main` do repositório.
2. Settings → Pages → Source: `main` / root.
3. No registro.br, aponte o domínio para o GitHub Pages e marque "Enforce HTTPS".

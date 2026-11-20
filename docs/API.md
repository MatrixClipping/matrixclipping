# Matrix Clipping — contrato da API (v1)

Este é o contrato que o site já usa. Quando o backend implementar estes endpoints, basta preencher
`apiBase` em `assets/js/config.js` (ex.: `https://api.matrixclipping.com.br`) e as telas de
**Processar**, **Criar conta** e **Entrar** passam a funcionar de verdade, sem mudar o HTML.

- Formato: JSON (UTF-8). Datas no formato `dd/mm/aaaa hh:mm` para exibição.
- Autenticação: cookie de sessão `HttpOnly` + `Secure` + `SameSite=Lax` (o site envia `credentials: 'include'`).
  Para integrações de clientes (plano Profissional/Agência), também aceitar `Authorization: Bearer <chave>`.
- CORS: liberar `https://matrixclipping.com.br` com `Access-Control-Allow-Credentials: true`.
- Erros: HTTP 4xx/5xx com `{ "erro": "mensagem legível em português" }`.

---

## Autenticação

### `POST /v1/auth/cadastro`
```json
{ "nome": "Maria", "empresa": "Clipadora X", "email": "maria@clipadora.com.br", "senha": "********", "plano": "profissional" }
```
Resposta `201`: `{ "ok": true }` — envia e-mail de confirmação.
Erros: `409` e-mail já cadastrado · `422` dados inválidos.

### `POST /v1/auth/login`
```json
{ "email": "maria@clipadora.com.br", "senha": "********", "lembrar": true }
```
Resposta `200`: `{ "usuario": { "nome": "Maria", "empresa": "Clipadora X", "plano": "profissional" } }` + cookie de sessão.
Erros: `401` e-mail ou senha incorretos · `429` muitas tentativas.

### `POST /v1/auth/logout` → `204`
### `POST /v1/auth/recuperar-senha` → `{ "email": "..." }` → `204` (sempre, para não revelar contas)

---

## Matérias

### `POST /v1/materias` — enfileira um link
```json
{ "url": "https://portal.com.br/materia", "cliente": "Empresa X" }
```
Resposta `202`:
```json
{ "id": "mat_01JD9X…", "status": "na_fila" }
```
Erros: `402` limite do plano atingido sem link adicional · `422` URL inválida.

### `POST /v1/materias/lote` — planilha/lista de links
```json
{ "urls": ["https://…", "https://…"], "cliente": "Empresa X" }
```
Resposta `202`: `{ "lote_id": "lot_…", "ids": ["mat_…", "mat_…"] }`

### `GET /v1/materias/{id}` — acompanha e retorna o resultado
```json
{
  "id": "mat_01JD9X…",
  "status": "processando",            // na_fila | processando | concluido | erro
  "etapas": [
    { "id": "fila",       "status": "concluida",  "duracao_ms": 380 },
    { "id": "leitura",    "status": "concluida",  "duracao_ms": 910 },
    { "id": "extracao",   "status": "executando" },
    { "id": "print",      "status": "pendente" },
    { "id": "medidas",    "status": "pendente" },
    { "id": "retorno",    "status": "pendente" },
    { "id": "sentimento", "status": "pendente" },
    { "id": "veiculo",    "status": "pendente" }
  ],
  "resultado": null,
  "erro": null
}
```
Quando `status = "concluido"`, `resultado` traz:
```json
{
  "url": "https://portal.com.br/materia",
  "veiculo": "Portal Exemplo",
  "fonte": "portalexemplo.com.br",
  "titulo": "…",
  "texto": "…",
  "autor": "Redação",
  "secao": "Economia",
  "data": "18/11/2026 09:42",
  "larguraPx": 1180,
  "alturaPx": 2640,
  "centimetragem": "31,2 × 69,8 cm (equivalente)",
  "retornoMidia": "R$ 4.860,00",
  "sentimento": "positivo",
  "confianca": 0.91,
  "justificativa": "…",
  "print_url": "https://arquivos.matrixclipping.com.br/…/print.jpg",
  "pdf_url": "https://arquivos.matrixclipping.com.br/…/materia.pdf",
  "metricas": [["Visitas mensais", "12,4 mi"], ["Duração média", "03:21"]],
  "tempo": "6,4 s"
}
```
`metricas` só vem preenchido nos planos com esse recurso **e** quando houver licença do provedor de dados de audiência.

### `GET /v1/materias?pagina=1&cliente=Empresa%20X` — histórico paginado
### `GET /v1/materias/{id}/exportar?formato=pdf|jpg|xlsx|json`

---

## Etapas do processamento (workers)

| id           | O que faz                                                        |
|--------------|------------------------------------------------------------------|
| `fila`       | Recebe o pedido, confere o limite do plano, coloca na fila        |
| `leitura`    | Abre a página (navegador headless), fecha banners de cookies       |
| `extracao`   | Título, texto limpo, autor, seção, data, veículo                 |
| `print`      | Print da página e recorte da área da matéria                     |
| `medidas`    | Altura × largura (px) e centimetragem equivalente                |
| `retorno`    | Aplica a tabela de preços do veículo cadastrada pela clipadora   |
| `sentimento` | IA: sentimento em relação ao cliente, confiança e justificativa  |
| `veiculo`    | Métricas de audiência do veículo (cache por domínio)             |

## Webhook (plano Agência)
`POST` para a URL cadastrada pelo cliente a cada matéria concluída, com o mesmo corpo de
`GET /v1/materias/{id}` e o cabeçalho `X-Matrix-Assinatura` (HMAC-SHA256 do corpo).

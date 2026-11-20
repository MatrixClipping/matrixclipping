/* =========================================================
   MATRIX CLIPPING — CONFIGURAÇÃO DO SITE
   Edite aqui preços, planos, contato e a conexão com a API.
   ========================================================= */

window.MC_CONFIG = {

  // ---------------------------------------------------------
  // CONTATO
  // ---------------------------------------------------------
  email: 'ferramentamatrix@gmail.com',

  // ---------------------------------------------------------
  // API DA PLATAFORMA
  // null = modo demonstração (nada é enviado; telas mostram exemplo).
  // Quando a API estiver no ar: 'https://api.matrixclipping.com.br'
  // Contrato dos endpoints: docs/API.md
  // ---------------------------------------------------------
  apiBase: null,

  // ---------------------------------------------------------
  // PREÇOS (valores mensais em reais)
  // ---------------------------------------------------------
  currency: 'BRL',
  annualDiscount: 0.17,                   // ≈ 2 meses grátis por ano

  plans: [
    {
      id: 'essencial',
      name: 'Essencial',
      tagline: 'Para começar a automatizar',
      monthly: 79,
      links: 500,
      users: 1,
      extraLink: 0.15,
      highlight: false,
      cta: 'Criar conta',
      features: [
        'Veículo, título, texto, autor e data',
        'Print recortado da matéria',
        'Altura × largura e centimetragem',
        'Sentimento com IA',
        'PDF, JPG e Excel'
      ]
    },
    {
      id: 'profissional',
      name: 'Profissional',
      tagline: 'Para o dia a dia da clipadora',
      monthly: 197,
      links: 3000,
      users: 3,
      extraLink: 0.08,
      highlight: true,
      badge: 'Mais escolhido',
      cta: 'Criar conta',
      features: [
        'Tudo do Essencial',
        'Retorno de mídia com a sua tabela',
        'Métricas de audiência do veículo',
        'Envio em lote por planilha',
        'Sentimento por cliente monitorado',
        'API'
      ]
    },
    {
      id: 'agencia',
      name: 'Agência',
      tagline: 'Para grandes volumes',
      monthly: 497,
      links: 12000,
      users: null,                        // null = ilimitado
      extraLink: 0.05,
      highlight: false,
      cta: 'Falar com a gente',
      contact: true,                      // botão abre e-mail em vez de cadastro
      features: [
        'Tudo do Profissional',
        'White label nos relatórios',
        'Webhook e API prioritária',
        'Suporte prioritário'
      ]
    }
  ],

  comparison: [
    { group: 'Captura da matéria' },
    { label: 'Veículo, título, texto, autor e data', values: [true, true, true] },
    { label: 'Print recortado da matéria', values: [true, true, true] },
    { label: 'Altura × largura e centimetragem', values: [true, true, true] },
    { label: 'Envio em lote (planilha de links)', values: [false, true, true] },
    { group: 'Análise' },
    { label: 'Sentimento com IA', values: [true, true, true] },
    { label: 'Sentimento por cliente monitorado', values: [false, true, true] },
    { label: 'Retorno de mídia (tabela por veículo)', values: [false, true, true] },
    { label: 'Métricas de audiência do veículo', values: [false, true, true] },
    { group: 'Entrega e integração' },
    { label: 'PDF, JPG e Excel', values: [true, true, true] },
    { label: 'API', values: [false, true, 'Prioritária'] },
    { label: 'Webhook', values: [false, false, true] },
    { label: 'White label', values: [false, false, true] },
    { group: 'Conta' },
    { label: 'Links por mês', values: ['500', '3.000', '12.000'] },
    { label: 'Usuários', values: ['1', '3', 'Ilimitados'] },
    { label: 'Suporte', values: ['E-mail', 'E-mail', 'Prioritário'] }
  ],

  // ---------------------------------------------------------
  // EXEMPLO (dados fictícios) usado na demonstração
  // ---------------------------------------------------------
  demoExample: {
    url: 'portalexemplo.com.br/economia/energia-solar',
    titulo: 'Empresa de energia anuncia investimento em usinas solares no interior',
    veiculo: 'Portal Exemplo',
    fonte: 'portalexemplo.com.br',
    data: '18/11/2026 09:42',
    autor: 'Redação',
    secao: 'Economia',
    texto: 'A companhia informou que pretende ampliar a capacidade de geração renovável nos próximos três anos. Segundo o comunicado, as novas unidades devem gerar empregos diretos durante a construção e reduzir custos para clientes industriais da região. O plano prevê ainda parcerias com prefeituras para projetos de eficiência energética em prédios públicos.',
    larguraPx: 1180,
    alturaPx: 2640,
    centimetragem: '31,2 × 69,8 cm (equivalente)',
    sentimento: 'positivo',
    confianca: 0.91,
    justificativa: 'A matéria destaca investimento, geração de empregos e redução de custos, sem críticas ou contrapontos relevantes.',
    retornoMidia: 'R$ 4.860,00',
    tempo: '6,4 s',
    // Métricas do veículo: ILUSTRATIVAS. Na plataforma virão de provedor licenciado.
    metricas: [
      ['Visitantes únicos/dia', '412.380'],
      ['Visitas mensais', '12,4 mi'],
      ['Páginas por visita', '2,87'],
      ['Duração média', '03:21'],
      ['Taxa de rejeição', '61,4%'],
      ['Ranking no Brasil', '#214'],
      ['Tráfego orgânico/mês', '3,1 mi'],
      ['Valor do tráfego orgânico', 'R$ 286 mil']
    ]
  }
};

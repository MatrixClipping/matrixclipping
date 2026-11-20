/* =========================================================
   MATRIX CLIPPING — CONFIGURAÇÃO DO SITE
   Edite aqui o contato, a conexão com a API e o exemplo da demonstração.
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

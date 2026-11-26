/*
 * CONTEÚDO EDITÁVEL: vídeos do portfólio e painel de audiência.
 * Preencha os vídeos somente com publicações reais.
 * Links precisam começar com https://
 */
window.SITE_DATA = {

  // Destaques em "Conteúdo na prática". Cada item abre a publicação original.
  // Modelo (copie para dentro dos colchetes):
  // {
  //   titulo: 'Título do vídeo',
  //   categoria: 'Reviews de produtos',   // ou Reels de corrida, Treinos, Provas, Humor, Conteúdo patrocinado
  //   plataforma: 'Instagram',            // ou YouTube, TikTok
  //   url: 'https://www.instagram.com/reel/CODIGO/',
  //   miniatura: './assets/imgs/nome-da-capa.webp'   // vertical, cerca de 600x860
  // }
  videos: [],

  // Painel "Dados detalhados da audiência".
  // ATENÇÃO: os valores abaixo são FICTÍCIOS. Troque pelos dados reais dos Insights
  // e só então mude exemplo para false (isso remove o aviso da tela).
  audiencia: {
    exemplo: true,
    indicadores: [
      { nome: 'Alcance total', valor: '25 mil' },
      { nome: 'Média de views por Reels', valor: '5 mil' },
      { nome: 'Taxa de engajamento', valor: '4,0%' }
    ],
    evolucao: [
      { mes: 'Jun', seguidores: 10000 },
      { mes: 'Jul', seguidores: 10500 },
      { mes: 'Ago', seguidores: 11000 },
      { mes: 'Set', seguidores: 11800 },
      { mes: 'Out', seguidores: 12500 },
      { mes: 'Nov', seguidores: 13000 }
    ],
    demografia: [
      { titulo: 'Gênero', itens: [
        { nome: 'Homens', percentual: 55 },
        { nome: 'Mulheres', percentual: 45 }
      ] },
      { titulo: 'Idade', itens: [
        { nome: '18 a 24', percentual: 30 },
        { nome: '25 a 34', percentual: 45 },
        { nome: '35 ou mais', percentual: 25 }
      ] }
    ]
  }
};

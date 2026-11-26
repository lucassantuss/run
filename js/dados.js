/*
 * CONTEÚDO EDITÁVEL: vídeos do portfólio e detalhes das parcerias.
 * Preencha somente com publicações e resultados reais. Campos vazios não aparecem no site.
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

  // Detalhes extras em "Marcas que já correram comigo".
  marcas: {
    'max-titanium': {
      fotos: [],       // [{ src: './assets/imgs/foto.webp', alt: 'Descrição da foto' }]
      links: [],       // [{ texto: 'Ver Reels', url: 'https://...' }]
      resultados: ''   // texto curto, só com números comprovados
    },
    'atomic-labs': {
      fotos: [],
      links: [],
      resultados: ''
    }
  }
};

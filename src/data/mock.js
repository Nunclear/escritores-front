export const genres = ['Todos', 'Fantasía', 'Romance', 'Crónica', 'Misterio', 'Realismo mágico', 'Ciencia ficción'];
export const states = [
  { label: 'Publicadas', value: 'published' },
  { label: 'Borradores visibles', value: 'draft' },
  { label: 'Todas', value: '' },
];

export const fallbackStories = [
  { id: 1, ownerUserId: 12, title: 'La casa donde germinan los nombres', slugText: 'la-casa-donde-germinan-los-nombres', description: 'Una bibliotecaria descubre que cada palabra olvidada guarda un linaje secreto.', coverImageUrl: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80', visibilityState: 'public', publicationState: 'published', genre: 'Realismo mágico', tags: ['Realismo mágico', 'Biblioteca', 'Memoria'], author: { id: 12, displayName: 'Elena Valcárcel', avatarUrl: 'https://i.pravatar.cc/120?img=47' }, averageScore: 4.8, ratingsCount: 63, views: 12840, favorites: 934 },
  { id: 2, ownerUserId: 20, title: 'Cartografía para inviernos breves', slugText: 'cartografia-para-inviernos-breves', description: 'Crónicas fragmentarias de una ciudad portuaria, entre cartas nunca enviadas y cafés al amanecer.', coverImageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80', visibilityState: 'public', publicationState: 'published', genre: 'Crónica', tags: ['Crónica', 'Romance', 'Ciudad'], author: { id: 20, displayName: 'Mateo Aranda', avatarUrl: 'https://i.pravatar.cc/120?img=12' }, averageScore: 4.6, ratingsCount: 41, views: 8422, favorites: 571 },
  { id: 3, ownerUserId: 7, title: 'El oficio de nombrar la lluvia', slugText: 'el-oficio-de-nombrar-la-lluvia', description: 'Una saga de fantasía sobria donde los escribas preservan el clima en cuadernos vivos.', coverImageUrl: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=900&q=80', visibilityState: 'public', publicationState: 'published', genre: 'Fantasía', tags: ['Fantasía', 'Artesanía', 'Mitos'], author: { id: 7, displayName: 'Inés Robledo', avatarUrl: 'https://i.pravatar.cc/120?img=32' }, averageScore: 4.9, ratingsCount: 88, views: 21710, favorites: 1560 },
  { id: 4, ownerUserId: 18, title: 'Un mapa de sal bajo la lengua', slugText: 'un-mapa-de-sal-bajo-la-lengua', description: 'Misterio literario en una isla donde nadie recuerda el nombre del faro.', coverImageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80', visibilityState: 'public', publicationState: 'published', genre: 'Misterio', tags: ['Misterio', 'Mar', 'Faro'], author: { id: 18, displayName: 'Clara Soria', avatarUrl: 'https://i.pravatar.cc/120?img=5' }, averageScore: 4.7, ratingsCount: 37, views: 10302, favorites: 719 },
];

export const fallbackArcs = [
  { id: 1, storyId: 1, title: 'Arco I: La raíz dormida', subtitle: 'El despertar del archivo', positionIndex: 1 },
  { id: 2, storyId: 1, title: 'Arco II: Los nombres abiertos', subtitle: 'La búsqueda del origen', positionIndex: 2 },
];

export const fallbackVolumes = [
  { id: 1, storyId: 1, arcId: 1, title: 'Volumen 1 · Tinta y polvo', positionIndex: 1 },
  { id: 2, storyId: 1, arcId: 2, title: 'Volumen 2 · Jardines marginales', positionIndex: 2 },
];

export const fallbackChapters = [
  { id: 101, storyId: 1, arcId: 1, volumeId: 1, title: 'Prólogo: el polvo dorado', subtitle: 'Una llave bajo el margen', positionIndex: 1, wordCount: 1420, readingMinutes: 7, publicationState: 'published' },
  { id: 102, storyId: 1, arcId: 1, volumeId: 1, title: 'Capítulo I: las tintas pacientes', subtitle: 'La biblioteca despierta', positionIndex: 2, wordCount: 2380, readingMinutes: 12, publicationState: 'published' },
  { id: 103, storyId: 1, arcId: 2, volumeId: 2, title: 'Capítulo II: raíces en voz baja', subtitle: 'Cuadernos que respiran', positionIndex: 3, wordCount: 3150, readingMinutes: 16, publicationState: 'published' },
  { id: 104, storyId: 1, arcId: 2, volumeId: 2, title: 'Capítulo III: el alfabeto enterrado', subtitle: 'Una carta que no envejece', positionIndex: 4, wordCount: 2880, readingMinutes: 14, publicationState: 'published' },
];

export function getInitials(name = 'RDP') {
  return String(name).split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'RP';
}

export function normalizeStory(story = {}) {
  const ownerId = story.ownerUserId || story.authorUserId || story.author?.id;
  return {
    ...story,
    id: story.id || story.storyId,
    title: story.title || 'Historia sin título',
    description: story.description || 'Esta historia todavía no tiene descripción pública.',
    coverImageUrl: story.coverImageUrl || story.coverUrl || '',
    author: story.author || { id: ownerId, displayName: story.authorName || story.displayName || (ownerId ? `Autor #${ownerId}` : 'Autor') },
    averageScore: story.averageScore ?? story.ratingAverage ?? null,
    views: story.views ?? story.totalViews ?? null,
    favorites: story.favorites ?? story.favoritesCount ?? null,
    genre: story.genre || story.genreName || story.categoryName || story.tags?.[0] || 'Narrativa',
    tags: story.tags || story.tagsJson || [story.genre || story.genreName || 'Narrativa'],
  };
}

export function groupChapters(chapters = [], arcs = [], volumes = []) {
  const sorted = [...chapters].sort((a, b) => (a.positionIndex ?? 0) - (b.positionIndex ?? 0));
  if (!arcs.length && !volumes.length) return [{ key: 'all', title: 'Capítulos publicados', subtitle: 'Orden de lectura', chapters: sorted }];

  const arcMap = new Map(arcs.map((arc) => [arc.id, arc]));
  const volumeMap = new Map(volumes.map((volume) => [volume.id, volume]));
  const buckets = new Map();

  sorted.forEach((chapter) => {
    const volume = volumeMap.get(chapter.volumeId);
    const arc = arcMap.get(chapter.arcId || volume?.arcId);
    const key = `${arc?.id || 'sin-arco'}-${volume?.id || 'sin-volumen'}`;
    if (!buckets.has(key)) {
      buckets.set(key, {
        key,
        arcOrder: arc?.positionIndex ?? 999,
        volumeOrder: volume?.positionIndex ?? 999,
        title: volume?.title || arc?.title || 'Capítulos sin agrupación',
        subtitle: [arc?.title, arc?.subtitle || volume?.subtitle].filter(Boolean).join(' · '),
        chapters: [],
      });
    }
    buckets.get(key).chapters.push(chapter);
  });

  return [...buckets.values()].sort((a, b) => a.arcOrder - b.arcOrder || a.volumeOrder - b.volumeOrder);
}

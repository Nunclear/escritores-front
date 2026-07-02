import { Link } from 'react-router-dom';
import { BookOpen, Clock, Hash } from 'lucide-react';

export default function ChapterGroups({ groups = [], storyId }) {
  return (
    <div className="chapter-groups">
      {groups.map((group) => (
        <section className="chapter-group editorial-card" key={group.key}>
          <div className="chapter-group-head"><span className="eyebrow">{group.subtitle || 'Orden de lectura'}</span><h2>{group.title}</h2></div>
          <div className="chapter-list-public">
            {group.chapters.map((chapter) => (
              <Link className="chapter-row" to={`/leer/${storyId}/capitulo/${chapter.id}`} key={chapter.id}>
                <span className="chapter-index">{String(chapter.positionIndex || 1).padStart(2, '0')}</span>
                <div><strong>{chapter.title}</strong><small>{chapter.subtitle || 'Sin subtítulo'}</small></div>
                <span><Clock size={14} /> {chapter.readingMinutes ?? '—'} min</span>
                <span><Hash size={14} /> {chapter.wordCount ?? '—'} palabras</span>
                <BookOpen size={18} />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

import { Link } from 'react-router-dom';
import { BookOpen, Eye, Heart, Star } from 'lucide-react';
import { getInitials, normalizeStory } from '../utils/story';

function Avatar({ author, storyId }) {
  if (author?.avatarUrl) return <img src={author.avatarUrl} alt="" />;
  return <span className="avatar-fallback small">{getInitials(author?.displayName || `Autor ${storyId}`)}</span>;
}

export default function StoryCard({ story }) {
  const item = normalizeStory(story);
  return (
    <article className="story-card">
      <Link className="cover-wrap" to={`/historia/${item.id}`}>
        {item.coverImageUrl ? <img src={item.coverImageUrl} alt={`Portada de ${item.title}`} /> : <div className="cover-placeholder"><BookOpen size={34} /><span>Sin portada</span></div>}
        <span className="status-chip">{item.publicationState || 'published'}</span>
      </Link>
      <div className="story-body">
        <div className="author-line"><Avatar author={item.author} storyId={item.id} /><span>{item.author?.displayName || 'Autor'}</span></div>
        <Link to={`/historia/${item.id}`}><h3>{item.title}</h3></Link>
        <p>{item.description}</p>
        <div className="tag-row">{(item.tags || [item.genre]).slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="card-meta"><span><Star size={15} /> {item.averageScore ?? '—'}</span><span><Eye size={15} /> {item.views ?? '—'}</span><span><Heart size={15} /> {item.favorites ?? '—'}</span><Link className="text-link" to={`/historia/${item.id}`}><BookOpen size={15} /> Portada</Link></div>
      </div>
    </article>
  );
}

import { Link } from 'react-router-dom';
import { Crown, Eye } from 'lucide-react';

export default function RankingPanel({ stories = [] }) {
  return (
    <aside className="ranking-panel editorial-card">
      <div className="panel-title"><Crown size={19} /><div><span className="eyebrow">Ranking</span><h2>Más vistas</h2></div></div>
      <div className="ranking-list">
        {stories.slice(0, 10).map((story, index) => (
          <Link to={`/historia/${story.id || story.storyId}`} className="ranking-item" key={story.id || story.storyId || index}>
            <strong>{String(index + 1).padStart(2, '0')}</strong>
            <span>{story.title}</span>
            <small><Eye size={13} /> {story.views ?? story.totalViews ?? '—'}</small>
          </Link>
        ))}
      </div>
    </aside>
  );
}

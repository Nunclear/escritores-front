import { useEffect, useState } from 'react';
import { HeartOff } from 'lucide-react';
import { api, pageContent } from '../api/client';
import StoryCard from '../components/StoryCard';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ApiState';

export default function Favorites() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => api.favorites.mine({ page: 0, size: 30 }).then((payload) => setItems(pageContent(payload))).catch(setError).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  async function remove(storyId) { await api.favorites.remove(storyId); setItems((list) => list.filter((item) => String(item.storyId || item.id) !== String(storyId))); }

  return <section className="page compact-page"><div className="section-heading wide compact"><span className="eyebrow">Favoritos</span><h1>Historias guardadas.</h1></div>{loading && <LoadingBlock />}{error && <ErrorBlock error={error} />}{!loading && !items.length && !error && <EmptyBlock title="No tienes favoritos" text="Guarda historias para verlas aquí." />}<div className="cards-grid compact-grid">{items.map((item) => <div className="stack-card" key={item.storyId || item.id}><StoryCard story={{ ...item, id: item.storyId || item.id }} /><button className="btn ghost full" onClick={() => remove(item.storyId || item.id)}><HeartOff size={15} /> Quitar favorito</button></div>)}</div></section>;
}

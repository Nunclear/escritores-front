import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Star, Trash2, UserMinus, Users } from 'lucide-react';
import { api, pageContent } from '../api/client';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ApiState';
import { WriterTabs } from '../components/WriterTabs';

function Panel({ title, eyebrow, icon: Icon, children }) {
  return <section className="page writer-page"><WriterTabs /><div className="section-heading wide"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div>{Icon && <Icon className="page-watermark" />}{children}</section>;
}

export function FavoritesPage() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(null);
  async function load(){setLoading(true);try{setItems(pageContent(await api.favorites.mine({page:0,size:60})))}catch(e){setError(e)}finally{setLoading(false)}}
  useEffect(()=>{load()},[]);
  async function remove(id){await api.favorites.remove(id); await load();}
  return <Panel title="Historias favoritas" eyebrow="Biblioteca personal" icon={Heart}>{loading&&<LoadingBlock/>}{error&&<ErrorBlock error={error}/>} {!loading&&!items.length&&!error&&<EmptyBlock title="Sin favoritos" text="Guarda historias desde sus portadas públicas."/>}<div className="compact-list">{items.map((it)=><div className="compact-row editorial-card" key={it.storyId||it.id}><div><strong>{it.title}</strong><small>Historia #{it.storyId||it.id}</small></div><div className="row-actions"><Link className="mini-btn" to={`/historia/${it.storyId||it.id}`}>Ver</Link><button className="mini-btn danger" onClick={()=>remove(it.storyId||it.id)}><Trash2 size={14}/> Quitar</button></div></div>)}</div></Panel>;
}

export function FollowingPage() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(null);
  async function load(){setLoading(true);try{setItems(pageContent(await api.follows.following({page:0,size:60})))}catch(e){setError(e)}finally{setLoading(false)}}
  useEffect(()=>{load()},[]);
  async function unfollow(id){await api.follows.unfollow(id); await load();}
  return <Panel title="Autores que sigo" eyebrow="Red literaria" icon={Users}>{loading&&<LoadingBlock/>}{error&&<ErrorBlock error={error}/>} {!loading&&!items.length&&!error&&<EmptyBlock title="Aún no sigues autores" text="Sigue autores desde sus perfiles públicos."/>}<div className="compact-list">{items.map((it)=><div className="compact-row editorial-card" key={it.userId||it.id}><div><strong>{it.displayName||it.loginName||`Autor #${it.userId}`}</strong><small>Autor #{it.userId||it.id}</small></div><div className="row-actions"><Link className="mini-btn" to={`/autor/${it.userId||it.id}`}>Perfil</Link><button className="mini-btn danger" onClick={()=>unfollow(it.userId||it.id)}><UserMinus size={14}/> Dejar de seguir</button></div></div>)}</div></Panel>;
}

export function RecentCommentsPage() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(null);
  useEffect(()=>{api.dashboard.recentComments({page:0,size:80}).then(r=>setItems(pageContent(r))).catch(setError).finally(()=>setLoading(false))},[]);
  return <Panel title="Comentarios recientes" eyebrow="Historial de lectura" icon={MessageCircle}>{loading&&<LoadingBlock/>}{error&&<ErrorBlock error={error}/>} {!loading&&!items.length&&!error&&<EmptyBlock title="Sin comentarios" text="Tus opiniones en otras historias aparecerán aquí."/>}<div className="compact-list">{items.map((it)=><div className="compact-row editorial-card" key={it.id}><div><strong>Comentario #{it.id}</strong><small>{it.createdAt || ''}</small><p>{it.content}</p></div>{it.storyId&&<Link className="mini-btn" to={`/historia/${it.storyId}`}>Historia</Link>}</div>)}</div></Panel>;
}

export function MyRatingsPage() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(null);
  useEffect(()=>{api.dashboard.ratings({page:0,size:80}).then(r=>setItems(pageContent(r))).catch(setError).finally(()=>setLoading(false))},[]);
  return <Panel title="Calificaciones emitidas" eyebrow="Reseñas" icon={Star}>{loading&&<LoadingBlock/>}{error&&<ErrorBlock error={error}/>} {!loading&&!items.length&&!error&&<EmptyBlock title="Sin calificaciones" text="Cuando califiques historias aparecerán aquí."/>}<div className="compact-list">{items.map((it)=><div className="compact-row editorial-card" key={it.id}><div><strong>{it.scoreValue} estrellas</strong><small>Historia #{it.storyId}</small>{it.reviewText&&<p>{it.reviewText}</p>}</div><Link className="mini-btn" to={`/historia/${it.storyId}`}>Ver historia</Link></div>)}</div></Panel>;
}

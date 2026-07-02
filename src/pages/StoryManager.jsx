import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Archive, ArrowUpDown, BarChart3, BookOpen, Boxes, Image, Lightbulb, Plus, Save, Trash2, Users, Wand2 } from 'lucide-react';
import { api, pageContent } from '../api/client';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ApiState';
import { storyTabs } from '../components/WriterTabs';

const chapterBlank = { title: '', subtitle: '', content: '', volumeId: '', positionIndex: 1, publicationState: 'draft', publishedOn: '' };
const arcBlank = { title: '', subtitle: '', positionIndex: 1 };
const volumeBlank = { title: '', arcId: '', positionIndex: 1 };
const characterBlank = { name: '', description: '', imageUrl: '', characterRoleName: '', profession: '', ability: '', age: '', isAlive: true };
const skillBlank = { name: '', description: '', categoryName: '', levelValue: 1 };
const itemBlank = { name: '', description: '', quantity: 1, unitName: 'unidad' };
const eventBlank = { title: '', description: '', eventOn: '', importance: 3, eventKind: '', tagsJson: '' };
const ideaBlank = { title: '', content: '' };
const mediaBlank = { originalFilename: '', mediaKind: 'image', description: '', chapterId: '', storagePath: '' };

function Field({ label, children }) { return <label>{label}{children}</label>; }
function MiniList({ items, empty, render }) { return items.length ? <div className="manager-list">{items.map(render)}</div> : <EmptyBlock title={empty} text="Los registros creados desde la API aparecerán aquí." />; }

export default function StoryManager() {
  const { storyId } = useParams();
  const [active, setActive] = useState('capitulos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [arcs, setArcs] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [skills, setSkills] = useState([]);
  const [events, setEvents] = useState([]);
  const [items, setItems] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [media, setMedia] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [authorMetrics, setAuthorMetrics] = useState(null);
  const [chapterForm, setChapterForm] = useState(chapterBlank);
  const [arcForm, setArcForm] = useState(arcBlank);
  const [volumeForm, setVolumeForm] = useState(volumeBlank);
  const [characterForm, setCharacterForm] = useState(characterBlank);
  const [skillForm, setSkillForm] = useState(skillBlank);
  const [itemForm, setItemForm] = useState(itemBlank);
  const [eventForm, setEventForm] = useState(eventBlank);
  const [ideaForm, setIdeaForm] = useState(ideaBlank);
  const [mediaForm, setMediaForm] = useState(mediaBlank);

  async function load() {
    setLoading(true); setError(null);
    try {
      const [storyRes, chapterRes, arcRes, volumeRes, characterRes, skillRes, eventRes, itemRes, ideaRes, metricRes] = await Promise.allSettled([
        api.stories.get(storyId), api.chapters.byStory(storyId, true), api.arcs.byStory(storyId), api.volumes.byStory(storyId), api.characters.byStory(storyId, {}), api.skills.byStory(storyId, {}), api.events.byStory(storyId, {}), api.items.byStory(storyId, {}), api.ideas.byStory(storyId, {}), api.metrics.story(storyId),
      ]);
      if (storyRes.status === 'fulfilled') setStory(storyRes.value); else throw storyRes.reason;
      setChapters(chapterRes.status === 'fulfilled' ? pageContent(chapterRes.value).sort((a,b)=>(a.positionIndex||0)-(b.positionIndex||0)) : []);
      setArcs(arcRes.status === 'fulfilled' ? pageContent(arcRes.value) : []);
      setVolumes(volumeRes.status === 'fulfilled' ? pageContent(volumeRes.value) : []);
      setCharacters(characterRes.status === 'fulfilled' ? pageContent(characterRes.value) : []);
      setSkills(skillRes.status === 'fulfilled' ? pageContent(skillRes.value) : []);
      setEvents(eventRes.status === 'fulfilled' ? pageContent(eventRes.value) : []);
      setItems(itemRes.status === 'fulfilled' ? pageContent(itemRes.value) : []);
      setIdeas(ideaRes.status === 'fulfilled' ? pageContent(ideaRes.value) : []);
      setMetrics(metricRes.status === 'fulfilled' ? metricRes.value : null);
      if (storyRes.status === 'fulfilled' && storyRes.value?.ownerUserId) {
        api.metrics.author(storyRes.value.ownerUserId).then(setAuthorMetrics).catch(() => {});
      }
    } catch (err) { setError(err); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [storyId]);

  const grouped = useMemo(() => chapters.reduce((acc, ch) => { const key = ch.volumeId || 'sin-volumen'; (acc[key] ||= []).push(ch); return acc; }, {}), [chapters]);
  const setForm = (setter) => (e) => setter((prev) => ({ ...prev, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  async function create(factory, payload, reset) { setMessage(''); try { await factory(payload); reset(); setMessage('Registro guardado.'); await load(); } catch (err) { setMessage(err.message); } }
  async function remove(factory, text) { try { await factory(); setMessage(text); await load(); } catch (err) { setMessage(err.message); } }

  if (loading) return <section className="page"><LoadingBlock label="Abriendo editor de historia..." /></section>;
  return <section className="page story-manager writer-page">
    <div className="section-heading wide"><span className="eyebrow">Editor de historia</span><h1>{story?.title || `Historia #${storyId}`}</h1><p>Gestiona capítulos, estructura, biblia creativa, ideas, medios y métricas.</p><Link className="btn soft" to="/mis-historias">Volver a mis historias</Link></div>
    {error && <ErrorBlock error={error} />}{message && <p className="form-message">{message}</p>}
    <nav className="writer-tabs story-tabs">{storyTabs.map(([id,label,Icon]) => <button key={id} className={active===id?'active':''} onClick={() => setActive(id)}><Icon size={15}/>{label}</button>)}</nav>

    {active === 'capitulos' && <div className="manager-grid"><form className="editorial-card writer-form" onSubmit={(e)=>{e.preventDefault(); create(api.chapters.create,{...chapterForm, storyId:Number(storyId), volumeId: chapterForm.volumeId || null, positionIndex:Number(chapterForm.positionIndex)},()=>setChapterForm(chapterBlank));}}><h2><BookOpen/> Editor de capítulos</h2><Field label="Título"><input name="title" value={chapterForm.title} onChange={setForm(setChapterForm)} required /></Field><Field label="Subtítulo"><input name="subtitle" value={chapterForm.subtitle} onChange={setForm(setChapterForm)} /></Field><div className="form-grid three-cols"><Field label="Posición"><input type="number" name="positionIndex" value={chapterForm.positionIndex} onChange={setForm(setChapterForm)} /></Field><Field label="Volumen"><select name="volumeId" value={chapterForm.volumeId} onChange={setForm(setChapterForm)}><option value="">Sin volumen</option>{volumes.map(v=><option key={v.id} value={v.id}>{v.title}</option>)}</select></Field><Field label="Estado"><select name="publicationState" value={chapterForm.publicationState} onChange={setForm(setChapterForm)}><option value="draft">Borrador</option><option value="published">Publicado</option></select></Field></div><Field label="Contenido"><textarea className="chapter-editor" name="content" value={chapterForm.content} onChange={setForm(setChapterForm)} rows="14" required /></Field><button className="btn primary"><Save size={16}/> Guardar capítulo</button></form><div className="editorial-card manager-panel"><h2><ArrowUpDown/> Capítulos</h2><MiniList items={chapters} empty="Sin capítulos" render={(ch)=><div className="manager-item" key={ch.id}><div><strong>{ch.positionIndex}. {ch.title}</strong><small>{ch.subtitle} · {ch.publicationState} · {ch.wordCount || 0} palabras</small></div><div className="row-actions"><button className="mini-btn" onClick={()=>remove(()=>api.chapters.publish(ch.id),'Capítulo publicado.')}>Publicar</button><button className="mini-btn" onClick={()=>remove(()=>api.chapters.unpublish(ch.id),'Capítulo en borrador.')}>Borrador</button><button className="mini-btn" onClick={()=>remove(()=>api.chapters.archive(ch.id),'Capítulo archivado.')}><Archive size={14}/></button><button className="mini-btn danger" onClick={()=>remove(()=>api.chapters.remove(ch.id),'Capítulo eliminado.')}><Trash2 size={14}/></button></div></div>} /></div></div>}

    {active === 'estructura' && <div className="manager-grid"><form className="editorial-card writer-form" onSubmit={(e)=>{e.preventDefault(); create(api.arcs.create,{...arcForm, storyId:Number(storyId), positionIndex:Number(arcForm.positionIndex)},()=>setArcForm(arcBlank));}}><h2>Nuevo arco</h2><Field label="Título"><input name="title" value={arcForm.title} onChange={setForm(setArcForm)} required /></Field><Field label="Subtítulo"><input name="subtitle" value={arcForm.subtitle} onChange={setForm(setArcForm)} /></Field><Field label="Posición"><input type="number" name="positionIndex" value={arcForm.positionIndex} onChange={setForm(setArcForm)} /></Field><button className="btn primary"><Plus size={16}/> Crear arco</button></form><form className="editorial-card writer-form" onSubmit={(e)=>{e.preventDefault(); create(api.volumes.create,{...volumeForm, storyId:Number(storyId), arcId: volumeForm.arcId || null, positionIndex:Number(volumeForm.positionIndex)},()=>setVolumeForm(volumeBlank));}}><h2>Nuevo volumen</h2><Field label="Título"><input name="title" value={volumeForm.title} onChange={setForm(setVolumeForm)} required /></Field><Field label="Arco"><select name="arcId" value={volumeForm.arcId} onChange={setForm(setVolumeForm)}><option value="">Sin arco</option>{arcs.map(a=><option key={a.id} value={a.id}>{a.title}</option>)}</select></Field><Field label="Posición"><input type="number" name="positionIndex" value={volumeForm.positionIndex} onChange={setForm(setVolumeForm)} /></Field><button className="btn primary"><Plus size={16}/> Crear volumen</button></form><div className="editorial-card manager-panel wide-panel"><h2>Vista agrupada</h2>{volumes.map(v=><div className="volume-block" key={v.id}><h3>{v.title}</h3>{(grouped[v.id]||[]).map(ch=><p key={ch.id}>{ch.positionIndex}. {ch.title}</p>)}</div>)}{!volumes.length && <EmptyBlock title="Sin volúmenes" text="Crea volúmenes y arcos para organizar historias largas." />}</div></div>}

    {active === 'mundo' && <div className="manager-grid"><form className="editorial-card writer-form" onSubmit={(e)=>{e.preventDefault(); create(api.characters.create,{...characterForm, storyId:Number(storyId), age: characterForm.age ? Number(characterForm.age): null},()=>setCharacterForm(characterBlank));}}><h2><Users/> Personaje</h2><Field label="Nombre"><input name="name" value={characterForm.name} onChange={setForm(setCharacterForm)} required /></Field><Field label="Imagen URL"><input name="imageUrl" value={characterForm.imageUrl} onChange={setForm(setCharacterForm)} /></Field><Field label="Descripción"><textarea name="description" value={characterForm.description} onChange={setForm(setCharacterForm)} /></Field><div className="form-grid two-cols"><Field label="Rol"><input name="characterRoleName" value={characterForm.characterRoleName} onChange={setForm(setCharacterForm)} /></Field><Field label="Habilidad base"><input name="ability" value={characterForm.ability} onChange={setForm(setCharacterForm)} /></Field></div><button className="btn primary">Crear personaje</button></form><form className="editorial-card writer-form" onSubmit={(e)=>{e.preventDefault(); create(api.skills.create,{...skillForm, storyId:Number(storyId), levelValue:Number(skillForm.levelValue)},()=>setSkillForm(skillBlank));}}><h2><Wand2/> Habilidad</h2><Field label="Nombre"><input name="name" value={skillForm.name} onChange={setForm(setSkillForm)} required /></Field><Field label="Categoría"><input name="categoryName" value={skillForm.categoryName} onChange={setForm(setSkillForm)} /></Field><Field label="Nivel"><input type="number" name="levelValue" value={skillForm.levelValue} onChange={setForm(setSkillForm)} /></Field><Field label="Descripción"><textarea name="description" value={skillForm.description} onChange={setForm(setSkillForm)} /></Field><button className="btn primary">Crear habilidad</button></form><form className="editorial-card writer-form" onSubmit={(e)=>{e.preventDefault(); create(api.items.create,{...itemForm, storyId:Number(storyId), quantity:Number(itemForm.quantity)},()=>setItemForm(itemBlank));}}><h2><Boxes/> Ítem</h2><Field label="Nombre"><input name="name" value={itemForm.name} onChange={setForm(setItemForm)} required /></Field><Field label="Descripción"><textarea name="description" value={itemForm.description} onChange={setForm(setItemForm)} /></Field><div className="form-grid two-cols"><Field label="Cantidad"><input type="number" name="quantity" value={itemForm.quantity} onChange={setForm(setItemForm)} /></Field><Field label="Unidad"><input name="unitName" value={itemForm.unitName} onChange={setForm(setItemForm)} /></Field></div><button className="btn primary">Crear ítem</button></form><form className="editorial-card writer-form" onSubmit={(e)=>{e.preventDefault(); create(api.events.create,{...eventForm, storyId:Number(storyId), importance:Number(eventForm.importance), tagsJson: eventForm.tagsJson ? eventForm.tagsJson.split(',').map(t=>t.trim()) : []},()=>setEventForm(eventBlank));}}><h2>Línea de tiempo</h2><Field label="Título"><input name="title" value={eventForm.title} onChange={setForm(setEventForm)} required /></Field><Field label="Fecha"><input type="date" name="eventOn" value={eventForm.eventOn} onChange={setForm(setEventForm)} /></Field><Field label="Tipo"><input name="eventKind" value={eventForm.eventKind} onChange={setForm(setEventForm)} /></Field><Field label="Descripción"><textarea name="description" value={eventForm.description} onChange={setForm(setEventForm)} /></Field><button className="btn primary">Crear evento</button></form><div className="editorial-card manager-panel wide-panel"><h2>Biblia narrativa</h2><p>{characters.length} personajes · {skills.length} habilidades · {items.length} ítems · {events.length} eventos</p></div></div>}

    {active === 'ideas' && <div className="manager-grid"><form className="editorial-card writer-form" onSubmit={(e)=>{e.preventDefault(); create(api.ideas.create,{...ideaForm, storyId:Number(storyId)},()=>setIdeaForm(ideaBlank));}}><h2><Lightbulb/> Nueva idea</h2><Field label="Título"><input name="title" value={ideaForm.title} onChange={setForm(setIdeaForm)} required /></Field><Field label="Contenido"><textarea name="content" value={ideaForm.content} onChange={setForm(setIdeaForm)} rows="8" /></Field><button className="btn primary">Guardar idea</button></form><div className="editorial-card manager-panel"><h2>Bloc interno</h2><MiniList items={ideas} empty="Sin ideas" render={(idea)=><div className="manager-item" key={idea.id}><div><strong>{idea.title}</strong><small>{idea.content}</small></div><button className="mini-btn danger" onClick={()=>remove(()=>api.ideas.remove(idea.id),'Idea eliminada.')}><Trash2 size={14}/></button></div>} /></div></div>}

    {active === 'medios' && <div className="manager-grid"><form className="editorial-card writer-form" onSubmit={(e)=>{e.preventDefault(); create(api.media.upload,{...mediaForm, chapterId: mediaForm.chapterId || null},()=>setMediaForm(mediaBlank));}}><h2><Image/> Archivo o medio</h2><Field label="Nombre original"><input name="originalFilename" value={mediaForm.originalFilename} onChange={setForm(setMediaForm)} required /></Field><Field label="Ruta/URL de almacenamiento"><input name="storagePath" value={mediaForm.storagePath} onChange={setForm(setMediaForm)} required /></Field><Field label="Tipo"><select name="mediaKind" value={mediaForm.mediaKind} onChange={setForm(setMediaForm)}><option value="image">Imagen</option><option value="document">Documento</option><option value="audio">Audio</option></select></Field><Field label="Capítulo"><select name="chapterId" value={mediaForm.chapterId} onChange={setForm(setMediaForm)}><option value="">Historia general</option>{chapters.map(ch=><option key={ch.id} value={ch.id}>{ch.title}</option>)}</select></Field><Field label="Descripción"><textarea name="description" value={mediaForm.description} onChange={setForm(setMediaForm)} /></Field><button className="btn primary">Registrar medio</button></form><div className="editorial-card manager-panel"><h2>Archivos por capítulo</h2><p>Selecciona un capítulo en el formulario para vincular el recurso visual.</p></div></div>}

    {active === 'metricas' && <div className="stats-grid"><div className="stat-card"><BarChart3/><span>Vistas de historia</span><strong>{metrics?.views ?? '—'}</strong></div><div className="stat-card"><BookOpen/><span>Favoritos</span><strong>{metrics?.favorites ?? '—'}</strong></div><div className="stat-card"><Wand2/><span>Calificaciones</span><strong>{metrics?.ratingsCount ?? '—'}</strong></div><div className="stat-card"><BarChart3/><span>Promedio</span><strong>{metrics?.averageScore ?? '—'}</strong></div><div className="stat-card"><BarChart3/><span>Total autor</span><strong>{authorMetrics?.totalViews ?? '—'}</strong></div></div>}
  </section>;
}

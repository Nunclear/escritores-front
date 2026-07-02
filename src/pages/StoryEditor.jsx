import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Archive, BarChart3, BookOpenCheck, Boxes, CalendarDays, FileImage, GitBranch, Image, Lightbulb, Plus, Save, UserRound } from 'lucide-react';
import { api, pageContent } from '../api/client';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ApiState';

const editorTabs = [
  { key: 'capitulos', label: 'Capítulos', icon: BookOpenCheck },
  { key: 'estructura', label: 'Volúmenes y arcos', icon: GitBranch },
  { key: 'mundo', label: 'Mundo narrativo', icon: UserRound },
  { key: 'ideas', label: 'Ideas', icon: Lightbulb },
  { key: 'medios', label: 'Archivos y medios', icon: Image },
  { key: 'metricas', label: 'Métricas', icon: BarChart3 },
];

function normalizeId(item, key) {
  return Number(item?.id ?? item?.[key] ?? 0);
}

function InlineForm({ title, children, onSubmit, message }) {
  return <form className="editorial-card settings-form compact-form" onSubmit={onSubmit}><h2><Plus size={17} /> {title}</h2>{children}{message && <p className="form-message">{message}</p>}</form>;
}

function RichChapterEditor({ storyId, chapters, setChapters, volumes, arcs }) {
  const [form, setForm] = useState({ title: '', subtitle: '', positionIndex: chapters.length + 1, volumeId: '', arcId: '', content: '', publicationState: 'draft' });
  const [editingId, setEditingId] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => setForm((current) => editingId ? current : { ...current, positionIndex: chapters.length + 1 }), [chapters.length, editingId]);
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  function edit(chapter) {
    setEditingId(chapter.id);
    setForm({ title: chapter.title || '', subtitle: chapter.subtitle || '', positionIndex: chapter.positionIndex || 1, volumeId: chapter.volumeId || '', arcId: chapter.arcId || '', content: chapter.content || '', publicationState: chapter.publicationState || 'draft' });
  }

  async function submit(event) {
    event.preventDefault();
    setMessage('');
    const payload = { ...form, storyId: Number(storyId), positionIndex: Number(form.positionIndex || 1), volumeId: form.volumeId ? Number(form.volumeId) : null, arcId: form.arcId ? Number(form.arcId) : null };
    try {
      const saved = editingId ? await api.chapters.update(editingId, payload) : await api.chapters.create(payload);
      if (payload.publicationState === 'published') await api.chapters.publish(saved.id || editingId);
      const response = await api.chapters.byStory(storyId, true);
      setChapters(pageContent(response).sort((a, b) => (a.positionIndex || 0) - (b.positionIndex || 0)));
      setEditingId(null);
      setForm({ title: '', subtitle: '', positionIndex: chapters.length + 1, volumeId: '', arcId: '', content: '', publicationState: 'draft' });
      setMessage('Capítulo guardado.');
    } catch (error) { setMessage(error.message || 'No se pudo guardar el capítulo.'); }
  }

  async function archiveChapter(chapter) {
    try { await api.chapters.archive(chapter.id); setChapters((items) => items.filter((item) => item.id !== chapter.id)); setMessage('Capítulo archivado.'); } catch (error) { setMessage(error.message); }
  }

  async function moveChapter(chapter, volumeId) {
    try { await api.chapters.move(chapter.id, { targetVolumeId: volumeId ? Number(volumeId) : null, newPositionIndex: chapter.positionIndex || 1 }); setMessage('Capítulo movido.'); } catch (error) { setMessage(error.message); }
  }

  async function reorder(targetId) {
    if (!dragId || dragId === targetId) return;
    const ordered = [...chapters];
    const from = ordered.findIndex((item) => item.id === dragId);
    const to = ordered.findIndex((item) => item.id === targetId);
    const [moved] = ordered.splice(from, 1);
    ordered.splice(to, 0, moved);
    const normalized = ordered.map((chapter, index) => ({ ...chapter, positionIndex: index + 1 }));
    setChapters(normalized);
    setDragId(null);
    try { await api.chapters.reorder(Number(storyId), normalized.map((chapter) => ({ chapterId: chapter.id, positionIndex: chapter.positionIndex }))); } catch (error) { setMessage(error.message); }
  }

  return (
    <div className="writer-split editor-split">
      <div className="chapter-editor-list">
        {chapters.length ? chapters.map((chapter) => <article className="editorial-card chapter-manage-row" draggable onDragStart={() => setDragId(chapter.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => reorder(chapter.id)} key={chapter.id}>
          <strong>{chapter.positionIndex}. {chapter.title}</strong><small>{chapter.subtitle || 'Sin subtítulo'} · {chapter.publicationState}</small>
          <div className="story-actions"><button className="btn soft" onClick={() => edit(chapter)}>Editar</button><select value={chapter.volumeId || ''} onChange={(event) => moveChapter(chapter, event.target.value)}><option value="">Sin volumen</option>{volumes.map((volume) => <option value={volume.id} key={volume.id}>{volume.title}</option>)}</select><button className="btn ghost" onClick={() => archiveChapter(chapter)}><Archive size={14} /> Archivar</button></div>
        </article>) : <EmptyBlock title="Sin capítulos" text="Crea el primer capítulo de esta historia." />}
      </div>
      <InlineForm title={editingId ? 'Editar capítulo' : 'Nuevo capítulo'} onSubmit={submit} message={message}>
        <label>Título<input name="title" value={form.title} onChange={update} required /></label>
        <label>Subtítulo<input name="subtitle" value={form.subtitle} onChange={update} /></label>
        <div className="two-cols compact-two"><label>Posición<input name="positionIndex" type="number" min="1" value={form.positionIndex} onChange={update} /></label><label>Estado<select name="publicationState" value={form.publicationState} onChange={update}><option value="draft">Borrador</option><option value="published">Publicado</option></select></label></div>
        <div className="two-cols compact-two"><label>Volumen<select name="volumeId" value={form.volumeId} onChange={update}><option value="">Sin volumen</option>{volumes.map((volume) => <option value={volume.id} key={volume.id}>{volume.title}</option>)}</select></label><label>Arco<select name="arcId" value={form.arcId} onChange={update}><option value="">Sin arco</option>{arcs.map((arc) => <option value={arc.id} key={arc.id}>{arc.title}</option>)}</select></label></div>
        <div className="rich-toolbar"><button type="button" onClick={() => setForm({ ...form, content: `${form.content}<strong></strong>` })}>Negrita</button><button type="button" onClick={() => setForm({ ...form, content: `${form.content}<em></em>` })}>Cursiva</button><button type="button" onClick={() => setForm({ ...form, content: `${form.content}\n\n` })}>Párrafo</button></div>
        <label>Contenido<textarea rows="10" name="content" value={form.content} onChange={update} placeholder="Escribe el cuerpo del capítulo. Puedes usar HTML simple para formato enriquecido." /></label>
        <button className="btn primary"><Save size={15} /> Guardar capítulo</button>
      </InlineForm>
    </div>
  );
}

function StructureManager({ storyId, volumes, setVolumes, arcs, setArcs }) {
  const [volume, setVolume] = useState({ title: '', arcId: '', positionIndex: volumes.length + 1 });
  const [arc, setArc] = useState({ title: '', subtitle: '', positionIndex: arcs.length + 1 });
  const [message, setMessage] = useState('');
  async function createVolume(event) { event.preventDefault(); try { await api.volumes.create({ ...volume, storyId: Number(storyId), arcId: volume.arcId ? Number(volume.arcId) : null, positionIndex: Number(volume.positionIndex || 1) }); setVolumes(pageContent(await api.volumes.byStory(storyId))); setVolume({ title: '', arcId: '', positionIndex: volumes.length + 2 }); setMessage('Volumen creado.'); } catch (error) { setMessage(error.message); } }
  async function createArc(event) { event.preventDefault(); try { await api.arcs.create({ ...arc, storyId: Number(storyId), positionIndex: Number(arc.positionIndex || 1) }); setArcs(pageContent(await api.arcs.byStory(storyId))); setArc({ title: '', subtitle: '', positionIndex: arcs.length + 2 }); setMessage('Arco creado.'); } catch (error) { setMessage(error.message); } }
  return <div className="writer-split"><div className="editorial-card compact-panel"><h2>Volúmenes y arcos</h2><div className="structure-columns"><div><h3>Volúmenes</h3>{volumes.length ? volumes.map((item) => <p key={item.id}><strong>{item.positionIndex}.</strong> {item.title}</p>) : <EmptyBlock title="Sin volúmenes" />}</div><div><h3>Arcos</h3>{arcs.length ? arcs.map((item) => <p key={item.id}><strong>{item.positionIndex}.</strong> {item.title}<br/><small>{item.subtitle}</small></p>) : <EmptyBlock title="Sin arcos" />}</div></div>{message && <p className="form-message">{message}</p>}</div><div className="stack-card"><InlineForm title="Crear volumen" onSubmit={createVolume}><label>Título<input value={volume.title} onChange={(e) => setVolume({ ...volume, title: e.target.value })} required /></label><label>Arco<select value={volume.arcId} onChange={(e) => setVolume({ ...volume, arcId: e.target.value })}><option value="">Sin arco</option>{arcs.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select></label><label>Posición<input type="number" min="1" value={volume.positionIndex} onChange={(e) => setVolume({ ...volume, positionIndex: e.target.value })} /></label><button className="btn primary">Crear volumen</button></InlineForm><InlineForm title="Crear arco" onSubmit={createArc}><label>Título<input value={arc.title} onChange={(e) => setArc({ ...arc, title: e.target.value })} required /></label><label>Subtítulo<input value={arc.subtitle} onChange={(e) => setArc({ ...arc, subtitle: e.target.value })} /></label><label>Posición<input type="number" min="1" value={arc.positionIndex} onChange={(e) => setArc({ ...arc, positionIndex: e.target.value })} /></label><button className="btn primary">Crear arco</button></InlineForm></div></div>;
}

function WorldManager({ storyId, characters, setCharacters, items, setItems, events, setEvents }) {
  const [character, setCharacter] = useState({ name: '', description: '', imageUrl: '', characterRoleName: '', profession: '', ability: '', rolesJson: '' });
  const [item, setItem] = useState({ name: '', description: '', quantity: 1, unitName: 'unidad' });
  const [eventForm, setEventForm] = useState({ title: '', description: '', eventOn: '', importance: 3, eventKind: '', tagsJson: '' });
  const [message, setMessage] = useState('');
  async function addCharacter(event) { event.preventDefault(); try { await api.characters.create({ ...character, storyId: Number(storyId), rolesJson: character.rolesJson ? character.rolesJson.split(',').map((x) => x.trim()) : [] }); setCharacters(pageContent(await api.characters.byStory(storyId, {}))); setCharacter({ name: '', description: '', imageUrl: '', characterRoleName: '', profession: '', ability: '', rolesJson: '' }); setMessage('Personaje creado.'); } catch (error) { setMessage(error.message); } }
  async function addItem(event) { event.preventDefault(); try { await api.items.create({ ...item, storyId: Number(storyId), quantity: Number(item.quantity || 1) }); setItems(pageContent(await api.items.byStory(storyId, {}))); setItem({ name: '', description: '', quantity: 1, unitName: 'unidad' }); setMessage('Ítem creado.'); } catch (error) { setMessage(error.message); } }
  async function addEvent(event) { event.preventDefault(); try { await api.events.create({ ...eventForm, storyId: Number(storyId), importance: Number(eventForm.importance || 3), tagsJson: eventForm.tagsJson ? eventForm.tagsJson.split(',').map((x) => x.trim()) : [] }); setEvents(pageContent(await api.events.byStory(storyId, {}))); setEventForm({ title: '', description: '', eventOn: '', importance: 3, eventKind: '', tagsJson: '' }); setMessage('Evento creado.'); } catch (error) { setMessage(error.message); } }
  return <div className="world-grid"><section className="editorial-card compact-panel"><h2>Biblia de la historia</h2>{message && <p className="form-message">{message}</p>}<h3>Personajes</h3>{characters.length ? characters.map((x) => <p key={x.id}><strong>{x.name}</strong> · {x.characterRoleName || 'Sin rol'}<br/><small>{x.description}</small></p>) : <EmptyBlock title="Sin personajes" />}<h3>Ítems</h3>{items.length ? items.map((x) => <p key={x.id}><strong>{x.name}</strong><br/><small>{x.description}</small></p>) : <EmptyBlock title="Sin ítems" />}<h3>Línea de tiempo</h3>{events.length ? events.sort((a,b)=>String(a.eventOn||'').localeCompare(String(b.eventOn||''))).map((x) => <p key={x.id}><strong>{x.eventOn || 'Sin fecha'}</strong> · {x.title}<br/><small>{x.description}</small></p>) : <EmptyBlock title="Sin eventos" />}</section><div className="stack-card"><InlineForm title="Personaje" onSubmit={addCharacter}><label>Nombre<input value={character.name} onChange={(e) => setCharacter({ ...character, name: e.target.value })} required /></label><label>Descripción<textarea rows="3" value={character.description} onChange={(e) => setCharacter({ ...character, description: e.target.value })} /></label><label>Imagen URL<input value={character.imageUrl} onChange={(e) => setCharacter({ ...character, imageUrl: e.target.value })} /></label><div className="two-cols compact-two"><label>Rol<input value={character.characterRoleName} onChange={(e) => setCharacter({ ...character, characterRoleName: e.target.value })} /></label><label>Habilidad<input value={character.ability} onChange={(e) => setCharacter({ ...character, ability: e.target.value })} /></label></div><label>Atributos personalizados<input value={character.rolesJson} onChange={(e) => setCharacter({ ...character, rolesJson: e.target.value })} placeholder="mago, mentor, antagonista" /></label><button className="btn primary">Guardar personaje</button></InlineForm><InlineForm title="Ítem" onSubmit={addItem}><label>Nombre<input value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} required /></label><label>Descripción<textarea rows="2" value={item.description} onChange={(e) => setItem({ ...item, description: e.target.value })} /></label><button className="btn primary">Guardar ítem</button></InlineForm><InlineForm title="Evento" onSubmit={addEvent}><label>Título<input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required /></label><label>Descripción<textarea rows="2" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} /></label><div className="two-cols compact-two"><label>Fecha<input type="date" value={eventForm.eventOn} onChange={(e) => setEventForm({ ...eventForm, eventOn: e.target.value })} /></label><label>Importancia<input type="number" min="1" max="5" value={eventForm.importance} onChange={(e) => setEventForm({ ...eventForm, importance: e.target.value })} /></label></div><button className="btn primary">Guardar evento</button></InlineForm></div></div>;
}

function IdeasManager({ storyId, ideas, setIdeas }) {
  const [form, setForm] = useState({ title: '', content: '' });
  const [message, setMessage] = useState('');
  async function submit(event) { event.preventDefault(); try { await api.ideas.create({ ...form, storyId: Number(storyId) }); setIdeas(pageContent(await api.ideas.byStory(storyId, { page: 0, size: 50 }))); setForm({ title: '', content: '' }); setMessage('Idea guardada.'); } catch (error) { setMessage(error.message); } }
  async function remove(id) { try { await api.ideas.remove(id); setIdeas((items) => items.filter((item) => item.id !== id)); } catch (error) { setMessage(error.message); } }
  return <div className="writer-split"><section className="ideas-board">{ideas.length ? ideas.map((idea) => <article className="editorial-card idea-note" key={idea.id}><strong>{idea.title}</strong><p>{idea.content}</p><button className="text-link naked" onClick={() => remove(idea.id)}>Eliminar</button></article>) : <EmptyBlock title="Sin ideas guardadas" text="Usa este bloc interno para capturar semillas narrativas." />}</section><InlineForm title="Nueva idea" onSubmit={submit} message={message}><label>Título<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label><label>Contenido<textarea rows="7" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></label><button className="btn primary">Guardar idea</button></InlineForm></div>;
}

function MediaManager({ chapters }) {
  const [chapterId, setChapterId] = useState('');
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({ originalFilename: '', mediaKind: 'image', description: '', storagePath: '' });
  const [message, setMessage] = useState('');
  useEffect(() => { if (!chapterId) { setFiles([]); return; } api.media.byChapter(chapterId).then((data) => setFiles(pageContent(data))).catch((error) => setMessage(error.message)); }, [chapterId]);
  async function submit(event) { event.preventDefault(); if (!chapterId) return setMessage('Selecciona un capítulo.'); try { await api.media.upload({ ...form, chapterId: Number(chapterId) }); setFiles(pageContent(await api.media.byChapter(chapterId))); setForm({ originalFilename: '', mediaKind: 'image', description: '', storagePath: '' }); setMessage('Archivo registrado.'); } catch (error) { setMessage(error.message); } }
  return <div className="writer-split"><section className="editorial-card compact-panel"><h2>Archivos por historia</h2><label>Capítulo<select value={chapterId} onChange={(e) => setChapterId(e.target.value)}><option value="">Selecciona capítulo</option>{chapters.map((chapter) => <option value={chapter.id} key={chapter.id}>{chapter.title}</option>)}</select></label>{files.length ? files.map((file) => <p key={file.id}><FileImage size={14} /> <strong>{file.originalFilename || file.filename}</strong><br/><small>{file.description}</small></p>) : <EmptyBlock title="Sin archivos" text="Los medios se organizan por capítulo dentro de esta historia." />}</section><InlineForm title="Registrar archivo" onSubmit={submit} message={message}><label>Nombre original<input value={form.originalFilename} onChange={(e) => setForm({ ...form, originalFilename: e.target.value })} required /></label><label>Tipo<select value={form.mediaKind} onChange={(e) => setForm({ ...form, mediaKind: e.target.value })}><option value="image">Imagen</option><option value="document">Documento</option><option value="audio">Audio</option><option value="other">Otro</option></select></label><label>Ruta/URL storage<input value={form.storagePath} onChange={(e) => setForm({ ...form, storagePath: e.target.value })} required /></label><label>Descripción<textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><button className="btn primary">Guardar archivo</button></InlineForm></div>;
}

function MetricsManager({ storyId, chapters }) {
  const [storyMetrics, setStoryMetrics] = useState(null);
  const [authorMetrics, setAuthorMetrics] = useState(null);
  const [chapterMetrics, setChapterMetrics] = useState([]);
  const [message, setMessage] = useState('');
  useEffect(() => {
    let mounted = true;
    Promise.allSettled([api.metrics.story(storyId), api.stories.get(storyId)])
      .then(async ([storyRes, storyData]) => {
        if (!mounted) return;
        if (storyRes.status === 'fulfilled') setStoryMetrics(storyRes.value); else setMessage(storyRes.reason.message);
        if (storyData.status === 'fulfilled' && storyData.value?.ownerUserId) api.metrics.author(storyData.value.ownerUserId).then(setAuthorMetrics).catch(() => {});
        const metrics = await Promise.allSettled(chapters.slice(0, 20).map((chapter) => api.metrics.chapter(chapter.id)));
        setChapterMetrics(metrics.filter((x) => x.status === 'fulfilled').map((x) => x.value));
      });
    return () => { mounted = false; };
  }, [storyId, chapters]);
  return <div className="metrics-grid"><article className="stat-card"><span>Vistas historia</span><strong>{storyMetrics?.views ?? '—'}</strong></article><article className="stat-card"><span>Favoritos</span><strong>{storyMetrics?.favorites ?? '—'}</strong></article><article className="stat-card"><span>Calificaciones</span><strong>{storyMetrics?.ratingsCount ?? '—'}</strong></article><article className="stat-card"><span>Promedio</span><strong>{storyMetrics?.averageScore ?? '—'}</strong></article><article className="stat-card"><span>Total autor</span><strong>{authorMetrics?.totalViews ?? '—'}</strong></article><section className="editorial-card compact-panel full-span"><h2>Vistas por capítulo</h2>{chapterMetrics.length ? chapterMetrics.map((item) => <p key={item.chapterId}>Capítulo #{item.chapterId}: {item.views ?? '—'} vistas · {item.commentsCount ?? '—'} comentarios</p>) : <EmptyBlock title="Sin métricas de capítulos" />}{message && <p className="form-message">{message}</p>}</section></div>;
}

export default function StoryEditor() {
  const { storyId } = useParams();
  const [active, setActive] = useState('capitulos');
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [arcs, setArcs] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [items, setItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.allSettled([
      api.stories.get(storyId), api.chapters.byStory(storyId, true), api.volumes.byStory(storyId), api.arcs.byStory(storyId),
      api.characters.byStory(storyId, {}), api.items.byStory(storyId, {}), api.events.byStory(storyId, {}), api.ideas.byStory(storyId, { page: 0, size: 50 }),
    ]).then(([storyRes, chaptersRes, volumesRes, arcsRes, charactersRes, itemsRes, eventsRes, ideasRes]) => {
      if (!mounted) return;
      if (storyRes.status === 'fulfilled') setStory(storyRes.value); else setError(storyRes.reason);
      setChapters(chaptersRes.status === 'fulfilled' ? pageContent(chaptersRes.value).sort((a, b) => (a.positionIndex || 0) - (b.positionIndex || 0)) : []);
      setVolumes(volumesRes.status === 'fulfilled' ? pageContent(volumesRes.value).sort((a, b) => (a.positionIndex || 0) - (b.positionIndex || 0)) : []);
      setArcs(arcsRes.status === 'fulfilled' ? pageContent(arcsRes.value).sort((a, b) => (a.positionIndex || 0) - (b.positionIndex || 0)) : []);
      setCharacters(charactersRes.status === 'fulfilled' ? pageContent(charactersRes.value) : []);
      setItems(itemsRes.status === 'fulfilled' ? pageContent(itemsRes.value) : []);
      setEvents(eventsRes.status === 'fulfilled' ? pageContent(eventsRes.value) : []);
      setIdeas(ideasRes.status === 'fulfilled' ? pageContent(ideasRes.value) : []);
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [storyId]);

  if (loading) return <section className="page compact-page"><LoadingBlock label="Abriendo editor de historia..." /></section>;

  return (
    <section className="page compact-page story-editor-page">
      <div className="section-heading wide compact"><span className="eyebrow">Editor completo</span><h1>{story?.title || 'Historia'}</h1><p>Gestiona capítulos, estructura, biblia narrativa, ideas, medios y métricas. <Link className="text-link" to={`/historia/${storyId}`}>Ver portada pública</Link></p></div>
      {error && <ErrorBlock error={error} />}
      <div className="editor-summary editorial-card"><Archive /><div><strong>{chapters.length}</strong><span>capítulos</span></div><div><strong>{volumes.length}</strong><span>volúmenes</span></div><div><strong>{arcs.length}</strong><span>arcos</span></div><div><strong>{story?.publicationState || '—'}</strong><span>estado</span></div></div>
      <div className="tabs-row editor-tabs">{editorTabs.map(({ key, label, icon: Icon }) => <button className={`tab-btn ${active === key ? 'active' : ''}`} onClick={() => setActive(key)} key={key}><Icon size={15} /> {label}</button>)}</div>
      {active === 'capitulos' && <RichChapterEditor storyId={storyId} chapters={chapters} setChapters={setChapters} volumes={volumes} arcs={arcs} />}
      {active === 'estructura' && <StructureManager storyId={storyId} volumes={volumes} setVolumes={setVolumes} arcs={arcs} setArcs={setArcs} />}
      {active === 'mundo' && <WorldManager storyId={storyId} characters={characters} setCharacters={setCharacters} items={items} setItems={setItems} events={events} setEvents={setEvents} />}
      {active === 'ideas' && <IdeasManager storyId={storyId} ideas={ideas} setIdeas={setIdeas} />}
      {active === 'medios' && <MediaManager chapters={chapters} />}
      {active === 'metricas' && <MetricsManager storyId={storyId} chapters={chapters} />}
    </section>
  );
}

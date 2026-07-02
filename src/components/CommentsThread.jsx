import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Reply, Send } from 'lucide-react';
import { api, pageContent } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { EmptyBlock } from './ApiState';
import ReportButton from './ReportButton';

function authorId(comment) {
  return comment.authorUserId || comment.userId || comment.author?.id || comment.user?.id;
}

function authorLabel(comment) {
  return comment.authorName || comment.authorDisplayName || comment.displayName || comment.author?.displayName || comment.user?.displayName || `Lector #${authorId(comment) || '—'}`;
}

async function enrichCommentAuthors(items) {
  const flat = [];
  const collect = (comment) => {
    flat.push(comment);
    (comment.replies || []).forEach(collect);
  };
  items.forEach(collect);
  const ids = [...new Set(flat.map(authorId).filter(Boolean).map(String))];
  if (!ids.length) return items;
  const entries = await Promise.allSettled(ids.map((id) => api.users.get(id)));
  const byId = new Map();
  entries.forEach((entry, index) => {
    if (entry.status === 'fulfilled' && entry.value) byId.set(ids[index], entry.value);
  });
  const mapComment = (comment) => {
    const id = authorId(comment);
    const profile = id ? byId.get(String(id)) : null;
    return {
      ...comment,
      authorDisplayName: comment.authorDisplayName || profile?.displayName || profile?.loginName,
      authorAvatarUrl: comment.authorAvatarUrl || profile?.avatarUrl,
      replies: (comment.replies || []).map(mapComment),
    };
  };
  return items.map(mapComment);
}

function CommentItem({ comment, onReply, activeReplyId, replyText, setReplyText, busy, canReply, level = 0 }) {
  const name = authorLabel(comment);
  return (
    <div className={`comment-item ${level ? 'reply' : ''}`}>
      <div className="comment-avatar">{comment.authorAvatarUrl ? <img src={comment.authorAvatarUrl} alt="" /> : name.slice(0, 1).toUpperCase()}</div>
      <div className="comment-content">
        <div className="comment-head">
          <strong>{name}</strong>
          <span>{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('es-PE') : 'Ahora'}</span>
        </div>
        <p>{comment.content}</p>
        <div className="comment-actions">
          {canReply && <button className="text-link naked" onClick={() => onReply(comment.id)}><Reply size={15} /> Responder</button>}
          <ReportButton type="comment" targetId={comment.id} compact />
        </div>
        {activeReplyId === comment.id && (
          <form className="reply-form" onSubmit={(event) => onReply(comment.id, event)}>
            <input value={replyText} onChange={(event) => setReplyText(event.target.value)} placeholder="Escribe una respuesta al hilo..." required />
            <button className="btn soft" disabled={busy}><Send size={15} /> Enviar</button>
          </form>
        )}
        {(comment.replies || []).length > 0 && (
          <div className="reply-list">
            {(comment.replies || []).map((reply) => <CommentItem key={reply.id} comment={reply} level={level + 1} canReply={false} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommentsThread({ storyId, chapterId }) {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [replyText, setReplyText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setError('');
    api.engagement.commentsByChapter(chapterId, { page: 0, size: 30 })
      .then(async (payload) => {
        const base = pageContent(payload);
        const enriched = await enrichCommentAuthors(base);
        if (mounted) setComments(enriched);
      })
      .catch((err) => mounted && setError(err.message || 'No se pudieron cargar los comentarios.'));
    return () => { mounted = false; };
  }, [chapterId]);

  const threaded = useMemo(() => {
    const all = comments.map((item) => ({ ...item, replies: [...(item.replies || [])] }));
    const byId = new Map(all.map((item) => [String(item.id), item]));
    const roots = [];
    all.forEach((item) => {
      const parentId = item.parentCommentId ?? item.parentId;
      if (parentId && byId.has(String(parentId))) byId.get(String(parentId)).replies.push(item);
      else roots.push(item);
    });
    return roots;
  }, [comments]);

  function withCurrentUser(comment) {
    return {
      ...comment,
      authorDisplayName: comment.authorDisplayName || user?.displayName || user?.loginName,
      authorAvatarUrl: comment.authorAvatarUrl || user?.avatarUrl,
      authorUserId: comment.authorUserId || user?.id,
    };
  }

  async function submitComment(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const created = await api.engagement.createComment({ storyId: Number(storyId), chapterId: Number(chapterId), parentCommentId: null, content });
      setComments((items) => [withCurrentUser(created), ...items]);
      setContent('');
    } catch (err) {
      setError(err.message || 'No se pudo publicar el comentario.');
    } finally {
      setBusy(false);
    }
  }

  async function handleReply(commentId, event) {
    if (!event) return setActiveReplyId(activeReplyId === commentId ? null : commentId);
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const created = await api.engagement.createComment({ storyId: Number(storyId), chapterId: Number(chapterId), parentCommentId: commentId, content: replyText });
      setComments((items) => [...items, withCurrentUser(created)]);
      setReplyText('');
      setActiveReplyId(null);
    } catch (err) {
      setError(err.message || 'No se pudo publicar la respuesta.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="comments-section editorial-card">
      <div className="comments-title"><MessageCircle /><div><span className="eyebrow">Conversación del capítulo</span><h2>Comentarios e hilos</h2></div></div>
      {isAuthenticated ? (
        <form className="comment-form" onSubmit={submitComment}>
          <textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Comparte una lectura, una emoción o una pregunta para el autor..." rows="4" required />
          <button className="btn primary" disabled={busy}><Send size={16} /> Publicar comentario</button>
        </form>
      ) : (
        <div className="login-note">Inicia sesión para comentar, responder hilos y conversar con el autor. La lectura pública sigue disponible sin registro.</div>
      )}
      {error && <p className="form-message">{error}</p>}
      <div className="comments-list">
        {threaded.length ? threaded.map((comment) => (
          <CommentItem key={comment.id} comment={comment} onReply={handleReply} activeReplyId={activeReplyId} replyText={replyText} setReplyText={setReplyText} busy={busy} canReply={isAuthenticated} />
        )) : <EmptyBlock title="Aún no hay comentarios" text="Sé el primero en iniciar una conversación cuando hayas iniciado sesión." />}
      </div>
    </section>
  );
}

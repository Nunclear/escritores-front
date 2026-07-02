import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function RatingBox({ storyId }) {
  const { isAuthenticated } = useAuth();
  const [score, setScore] = useState(0);
  const [hoverScore, setHoverScore] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!isAuthenticated || !storyId) return;
    api.ratings.mineForStory(storyId)
      .then((rating) => {
        if (!mounted || !rating) return;
        setScore(Number(rating.scoreValue || 0));
        setReviewText(rating.reviewText || '');
      })
      .catch(() => null);
    return () => { mounted = false; };
  }, [storyId, isAuthenticated]);

  async function submitRating(event) {
    event.preventDefault();
    if (!score) return setMessage('Selecciona una cantidad de estrellas.');
    setBusy(true);
    setMessage('');
    try {
      await api.engagement.rate({ storyId: Number(storyId), scoreValue: Number(score), reviewText });
      setMessage('Calificación enviada. Gracias por apoyar esta historia.');
    } catch (error) {
      setMessage(error.message || 'No se pudo enviar la calificación.');
    } finally {
      setBusy(false);
    }
  }

  const visualScore = hoverScore || score;

  return (
    <section className="rating-box editorial-card">
      <div className="comments-title"><Star /><div><span className="eyebrow">Califica la historia</span><h2>Tu lectura también cuenta</h2></div></div>
      {isAuthenticated ? (
        <form className="rating-form star-rating-form" onSubmit={submitRating}>
          <div className="star-picker" role="radiogroup" aria-label="Calificación con estrellas" onMouseLeave={() => setHoverScore(0)}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`star-button ${visualScore >= value ? 'active' : ''}`}
                onClick={() => setScore(value)}
                onMouseEnter={() => setHoverScore(value)}
                aria-label={`${value} estrella${value > 1 ? 's' : ''}`}
                aria-pressed={score === value}
              >
                <Star size={24} fill="currentColor" />
              </button>
            ))}
            <strong>{score ? `${score}/5` : 'Sin calificar'}</strong>
          </div>
          <label>Reseña breve
            <textarea rows="3" value={reviewText} onChange={(event) => setReviewText(event.target.value)} placeholder="Opcional: deja una impresión breve para otros lectores..." />
          </label>
          <button className="btn primary" disabled={busy}><Star size={16} /> {busy ? 'Enviando...' : 'Calificar'}</button>
        </form>
      ) : <div className="login-note">Inicia sesión para calificar esta historia con estrellas.</div>}
      {message && <p className="form-message">{message}</p>}
    </section>
  );
}

import { MessageCircle, Star, Users } from 'lucide-react';

export default function CommunityPage() {
  return (
    <section className="page community-page">
      <div className="section-heading wide">
        <span className="eyebrow">Comunidad</span>
        <h1>Lectores, autores y conversaciones alrededor de las historias.</h1>
        <p>Esta sección reúne las acciones sociales de la plataforma: comentarios, calificaciones, seguidores y favoritos.</p>
      </div>
      <div className="feature-strip">
        <div><MessageCircle /><h3>Conversaciones</h3><p>Los comentarios y respuestas viven en cada capítulo para formar hilos de lectura.</p></div>
        <div><Star /><h3>Calificaciones</h3><p>Las reseñas ayudan a destacar obras cuidadas y orientar a nuevos lectores.</p></div>
        <div><Users /><h3>Seguimiento</h3><p>Los lectores pueden seguir autores y volver a sus catálogos públicos.</p></div>
      </div>
    </section>
  );
}

import { NavLink } from 'react-router-dom';
import { BarChart3, BookOpen, Heart, PenLine, Settings, Sparkles } from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Resumen', icon: BarChart3 },
  { to: '/mis-historias', label: 'Mis historias', icon: BookOpen },
  { to: '/escribir', label: 'Nueva historia', icon: PenLine },
  { to: '/actividad', label: 'Actividad lectora', icon: Heart },
  { to: '/configuracion', label: 'Configuración', icon: Settings },
];

export default function WriterNav({ storyId }) {
  return (
    <nav className="writer-nav editorial-card" aria-label="Panel del escritor">
      <div className="writer-nav-title"><Sparkles size={15} /><span>Panel del escritor</span></div>
      {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to}><Icon size={15} /> {label}</NavLink>)}
      {storyId && <NavLink to={`/editor/${storyId}`}><PenLine size={15} /> Editor actual</NavLink>}
    </nav>
  );
}

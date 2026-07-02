import { NavLink } from 'react-router-dom';
import { Archive, BarChart3, BookOpen, Heart, Lightbulb, MessageCircle, PenLine, Settings, Star, Users, Wand2 } from 'lucide-react';

const tabs = [
  ['/dashboard', 'Resumen', BarChart3],
  ['/mis-historias', 'Mis historias', BookOpen],
  ['/favoritos', 'Favoritos', Heart],
  ['/siguiendo', 'Siguiendo', Users],
  ['/comentarios-recientes', 'Comentarios', MessageCircle],
  ['/calificaciones-emitidas', 'Calificaciones', Star],
  ['/cuenta', 'Cuenta', Settings],
];

export function WriterTabs() {
  return <nav className="writer-tabs">{tabs.map(([to, label, Icon]) => <NavLink key={to} to={to}><Icon size={15} /> {label}</NavLink>)}</nav>;
}

export const storyTabs = [
  ['capitulos', 'Capítulos', PenLine],
  ['estructura', 'Volúmenes y arcos', Archive],
  ['mundo', 'Mundo narrativo', Wand2],
  ['ideas', 'Ideas', Lightbulb],
  ['medios', 'Medios', BookOpen],
  ['metricas', 'Métricas', BarChart3],
];

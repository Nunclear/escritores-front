import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const THEME_KEY = 'rdp_theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light');
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem(THEME_KEY, theme); }, [theme]);
  return <button className="icon-pill" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Cambiar modo claro u oscuro">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}<span>{theme === 'dark' ? 'Claro' : 'Oscuro'}</span></button>;
}

import Header from './Header';
export default function Shell({ children }) { return <div className="app-shell"><div className="ambient one" /><div className="ambient two" /><Header /><main>{children}</main><footer className="footer"><strong>Raíz de Palabras</strong><span>Biblioteca pública, sala de lectura y estudio narrativo conectados a tu API.</span></footer></div>; }

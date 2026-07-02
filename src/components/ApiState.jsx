export function LoadingBlock({ label = 'Cargando contenido...' }) {
  return <div className="state-block"><span className="spinner" /> {label}</div>;
}

export function EmptyBlock({ title = 'No hay contenido disponible', text = 'Cuando la API devuelva resultados, aparecerán aquí.' }) {
  return <div className="state-block empty"><h3>{title}</h3><p>{text}</p></div>;
}

export function ErrorBlock({ error }) {
  return <div className="state-block error"><h3>No se pudo cargar la información</h3><p>{error?.message || 'Verifica la conexión con la API y la variable VITE_API_URL.'}</p></div>;
}

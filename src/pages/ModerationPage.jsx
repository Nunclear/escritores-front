import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { api, pageContent } from '../api/client';
import { ErrorBlock, LoadingBlock, EmptyBlock } from '../components/ApiState';

export default function ModerationPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    api.reports.pending({ page: 0, size: 20 })
      .then((payload) => mounted && setReports(pageContent(payload)))
      .catch((err) => { if (mounted) { setError(err); setReports([]); } })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <section className="page moderation-page">
      <div className="section-heading wide"><span className="eyebrow">Moderación</span><h1>Panel discreto para revisar reportes.</h1></div>
      {error && <ErrorBlock error={error} />}
      {loading ? <LoadingBlock label="Cargando reportes..." /> : reports.length ? (
        <div className="activity-panel editorial-card">
          <h2><ShieldCheck size={20} /> Reportes pendientes</h2>
          {reports.map((report) => <p key={report.id}>Reporte #{report.id} · {report.statusName || 'pending'} · {report.reasonText || 'Sin motivo visible'}</p>)}
        </div>
      ) : <EmptyBlock title="No hay reportes pendientes" text="La cola de moderación está vacía." />}
    </section>
  );
}

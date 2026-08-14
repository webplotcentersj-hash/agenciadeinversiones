'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import BrandLockup from '@/components/BrandLockup';
import { getSupabase, type RsvpRow } from '@/lib/supabase';
import './panel.css';

type Filtro = 'todos' | 'abiertos' | 'confirmados';
type TipoFiltro = 'todos' | 'GENERAL' | 'DISENO';

function formatWhen(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function waLink(raw: string) {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length === 10) digits = `54${digits}`;
  if (digits.length === 11 && digits.startsWith('9')) digits = `54${digits}`;
  return `https://wa.me/${digits}`;
}

export default function PanelPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState<RsvpRow[]>([]);
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [tipo, setTipo] = useState<TipoFiltro>('todos');

  useEffect(() => {
    document.body.classList.remove(
      'is-gate',
      'no-scroll',
      'is-intro',
      'intro-revealed',
      'is-cut',
      'is-revealed'
    );
    document.body.classList.add('is-panel');
    return () => document.body.classList.remove('is-panel');
  }, []);

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setRows([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error: queryError } = await getSupabase()
        .from('rsvp')
        .select('id, nombre, tipo, whatsapp, estado, asistencia, opened_at, confirmed_at, created_at')
        .order('opened_at', { ascending: false });
      if (cancelled) return;
      if (queryError) {
        setError(queryError.message);
        return;
      }
      setRows((data ?? []) as RsvpRow[]);
    })();
    return () => {
      cancelled = true;
    };
  }, [session]);

  const stats = useMemo(() => {
    return {
      total: rows.length,
      abiertos: rows.filter((r) => r.estado === 'abierto').length,
      confirmados: rows.filter((r) => r.estado === 'confirmado').length,
      general: rows.filter((r) => r.tipo === 'GENERAL').length,
      diseno: rows.filter((r) => r.tipo === 'DISENO').length,
    };
  }, [rows]);

  const visible = rows.filter((r) => {
    if (filtro === 'abiertos' && r.estado !== 'abierto') return false;
    if (filtro === 'confirmados' && r.estado !== 'confirmado') return false;
    if (tipo !== 'todos' && r.tipo !== tipo) return false;
    return true;
  });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const { error: authError } = await getSupabase().auth.signInWithPassword({ email, password });
    setBusy(false);
    if (authError) setError(authError.message);
  }

  async function handleSignup() {
    setError('');
    setBusy(true);
    const { data, error: authError } = await getSupabase().auth.signUp({ email, password });
    setBusy(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    if (!data.session) {
      setError('Cuenta creada. Si pide confirmar el mail, activá el usuario en Authentication de AGDI y volvé a entrar.');
    }
  }

  async function handleLogout() {
    await getSupabase().auth.signOut();
  }

  if (!ready) {
    return <div className="panel-shell">Cargando…</div>;
  }

  if (!session) {
    return (
      <div className="panel-shell">
        <form className="panel-login" onSubmit={handleLogin}>
          <BrandLockup className="panel-login__logo" />
          <h1>Panel de invitados</h1>
          <input
            type="email"
            required
            autoComplete="username"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-glass rounded-xl px-4 py-3"
          />
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-glass rounded-xl px-4 py-3"
          />
          {error ? <p className="panel-error">{error}</p> : null}
          <button type="submit" disabled={busy} className="btn-interactive rounded-xl py-3 font-bold uppercase tracking-[0.14em] text-sm">
            {busy ? 'Entrando…' : 'Entrar'}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleSignup}
            className="panel-logout"
          >
            Crear cuenta
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="panel-shell">
      <header className="panel-head">
        <BrandLockup className="panel-head__logo" />
        <div>
          <h1>Panel de invitados</h1>
          <p>{session.user.email}</p>
        </div>
        <button type="button" className="panel-logout" onClick={handleLogout}>
          Salir
        </button>
      </header>

      <ul className="panel-stats">
        <li><strong>{stats.total}</strong> abrieron</li>
        <li><strong>{stats.abiertos}</strong> sin confirmar</li>
        <li><strong>{stats.confirmados}</strong> confirman</li>
      </ul>

      <div className="panel-filters">
        {(['todos', 'abiertos', 'confirmados'] as const).map((f) => (
          <button key={f} type="button" className={filtro === f ? 'is-on' : ''} onClick={() => setFiltro(f)}>
            {f}
          </button>
        ))}
        <span className="panel-filters__sep" />
        {(['todos', 'GENERAL', 'DISENO'] as const).map((t) => (
          <button key={t} type="button" className={tipo === t ? 'is-on' : ''} onClick={() => setTipo(t)}>
            {t === 'todos' ? 'todos los tipos' : t === 'DISENO' ? 'diseño' : 'general'}
          </button>
        ))}
      </div>

      {error ? <p className="panel-error">{error}</p> : null}

      <div className="panel-table-wrap">
        <table className="panel-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>WhatsApp</th>
              <th>Estado</th>
              <th>Tipo</th>
              <th>Abrió</th>
              <th>Confirmó</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="panel-empty">Todavía no hay invitados en este filtro.</td>
              </tr>
            ) : (
              visible.map((row) => (
                <tr key={row.id}>
                  <td>{row.nombre}</td>
                  <td>
                    {row.whatsapp ? (
                      <a href={waLink(row.whatsapp)} target="_blank" rel="noopener noreferrer">
                        {row.whatsapp}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <span className={`panel-pill panel-pill--${row.estado}`}>
                      {row.estado}
                    </span>
                  </td>
                  <td>{row.tipo === 'DISENO' ? 'Diseño' : 'General'}</td>
                  <td>{formatWhen(row.opened_at)}</td>
                  <td>{formatWhen(row.confirmed_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

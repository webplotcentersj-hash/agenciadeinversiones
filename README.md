# Invitación — Grupo Agencias

Invitación digital para la inauguración de Grupo Agencias.

```bash
npm install
npm run dev
```

Invitación: http://localhost:3000  
Panel: http://localhost:3000/panel

## Vercel

El repo ya está listo para importar en [Vercel](https://vercel.com/new):

1. Importá `webplotcentersj-hash/agenciadeinversiones`.
2. Framework: Next.js. Root: `.` (el `package.json` está en la raíz).
3. Cargá estas variables de entorno:

| Nombre | Valor |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://syfahjzecsslypvvsvpk.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | la anon key de AGDI |
| `NEXT_PUBLIC_SITE_URL` | la URL final de Vercel, ej. `https://agenciadeinversiones.vercel.app` |

4. En AGDI → Authentication → URL configuration, agregá esa misma URL en **Site URL** y en **Redirect URLs** (`https://tu-dominio.vercel.app/**`).
5. Creá el usuario del panel en Authentication → Users.

## Contenido

Todo el copy vive en [`lib/event.ts`](lib/event.ts).

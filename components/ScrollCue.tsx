'use client';

import { useEffect, useState } from 'react';

/**
 * Flecha discreta que indica que hay más abajo.
 * Se mantiene mientras quede contenido por ver y se apaga al llegar al final
 * (antes se iba con el primer scroll y no volvía nunca, así que en el tramo
 * largo de las agencias no había ninguna señal).
 */
export default function ScrollCue({ active }: { active: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!active) {
      setShow(false);
      return;
    }

    const evaluate = () => {
      const doc = document.documentElement;
      const restante = doc.scrollHeight - window.scrollY - window.innerHeight;
      setShow(restante > 90);
    };

    // El contenido entra escalonado: se re-evalúa cuando terminó de acomodarse.
    const settle = setTimeout(evaluate, 900);
    window.addEventListener('scroll', evaluate, { passive: true });
    window.addEventListener('resize', evaluate);

    // Cada tarjeta que aparece cambia el alto de la página.
    const ro = new ResizeObserver(evaluate);
    ro.observe(document.body);

    return () => {
      clearTimeout(settle);
      window.removeEventListener('scroll', evaluate);
      window.removeEventListener('resize', evaluate);
      ro.disconnect();
    };
  }, [active]);

  return (
    <div className={`scroll-cue${show ? ' is-visible' : ''}`} aria-hidden="true">
      <i className="fa-solid fa-chevron-down scroll-cue__arrow" />
    </div>
  );
}

import { BRAND } from '@/lib/event';

type Props = {
  className?: string;
  /** Prioriza la carga: sólo para el logo que se ve apenas abre la invitación. */
  priority?: boolean;
  /**
   * 'blanco' usa el PNG tal cual (va sobre el fondo rojo).
   * 'solido' lo pinta con currentColor usando el alfa del PNG como máscara:
   * es la única forma de que el logo blanco se vea sobre el papel claro.
   */
  variant?: 'blanco' | 'solido';
};

/** Logo de Grupo Agencias. */
export default function BrandLockup({ className = '', priority = false, variant = 'blanco' }: Props) {
  if (variant === 'solido') {
    return (
      <span role="img" aria-label={BRAND.group} className={`brand-lockup--solido ${className}`.trim()} />
    );
  }

  return (
    <img
      src={BRAND.logo.src}
      width={BRAND.logo.width}
      height={BRAND.logo.height}
      alt={BRAND.group}
      className={`brand-lockup ${className}`.trim()}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  );
}

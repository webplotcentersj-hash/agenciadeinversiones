import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BRAND, EVENT } from '@/lib/event';
import type { RsvpRow } from '@/lib/supabase';

function formatWhen(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** PDF con todos los invitados confirmados. */
export function downloadConfirmedPdf(rows: RsvpRow[]) {
  const confirmed = rows
    .filter((r) => r.estado === 'confirmado')
    .slice()
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();

  doc.setFillColor(124, 16, 17);
  doc.rect(0, 0, pageW, 32, 'F');

  doc.setTextColor(255, 246, 243);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(`${BRAND.group} — Confirmados`, 14, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(
    `${EVENT.weekday} ${EVENT.day} de ${EVENT.monthLong} ${EVENT.year} · ${EVENT.time} · ${EVENT.address} ${EVENT.addressNumber}`,
    14,
    23
  );

  doc.setTextColor(49, 20, 19);
  doc.setFontSize(11);
  doc.text(
    confirmed.length === 1 ? '1 invitado confirma' : `${confirmed.length} invitados confirman`,
    14,
    42
  );

  autoTable(doc, {
    startY: 48,
    head: [['#', 'Nombre', 'WhatsApp', 'Confirmó']],
    body: confirmed.map((row, i) => [
      String(i + 1),
      row.nombre,
      row.whatsapp || '—',
      formatWhen(row.confirmed_at),
    ]),
    styles: {
      font: 'helvetica',
      fontSize: 10,
      textColor: [49, 20, 19],
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [198, 16, 20],
      textColor: [255, 246, 243],
      fontStyle: 'bold',
      fontSize: 9,
    },
    alternateRowStyles: { fillColor: [255, 246, 243] },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 70 },
      2: { cellWidth: 48 },
    },
    margin: { left: 14, right: 14 },
  });

  const stamp = new Date().toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const y = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 48;
  doc.setFontSize(8);
  doc.setTextColor(140, 90, 88);
  doc.text(`Generado ${stamp}`, 14, Math.min(y + 10, 285));

  const file = `confirmados-grupo-agencias-${EVENT.day}${EVENT.monthNum}.pdf`;
  doc.save(file);
}

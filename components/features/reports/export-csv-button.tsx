'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CategoryBreakdown, RevenuePoint } from '@/lib/api/types';

interface Props {
  revenue: RevenuePoint[];
  categories: CategoryBreakdown[];
}

function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[",\n\r;]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function buildCsv(revenue: RevenuePoint[], categories: CategoryBreakdown[]): string {
  const lines: string[] = [];

  lines.push('Ingresos por día');
  lines.push(['Fecha', 'Ingresos', 'Unidades vendidas'].join(','));
  for (const r of revenue) {
    lines.push([escapeCsv(r.date), escapeCsv(r.revenue), escapeCsv(r.unitsOut)].join(','));
  }

  lines.push('');
  lines.push('Stock por categoría');
  lines.push(['Categoría', 'SKUs', 'Unidades', 'Valor inventario'].join(','));
  for (const c of categories) {
    lines.push(
      [escapeCsv(c.category), escapeCsv(c.skuCount), escapeCsv(c.stockUnits), escapeCsv(c.inventoryValue)].join(','),
    );
  }

  return lines.join('\n');
}

function downloadCsv(filename: string, csv: string) {
  const bom = '﻿';
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ExportCsvButton({ revenue, categories }: Props) {
  const handleClick = () => {
    const csv = buildCsv(revenue, categories);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`gstock-reporte-${stamp}.csv`, csv);
  };

  const disabled = revenue.length === 0 && categories.length === 0;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={disabled}
      className="h-8 text-xs border-primary/20 bg-card/50 hover:bg-card shadow-sm transition-all text-foreground gap-1.5"
    >
      <Download size={14} />
      Exportar CSV
    </Button>
  );
}

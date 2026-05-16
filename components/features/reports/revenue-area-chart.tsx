'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function RevenueAreaChart({ data }: { data: { name: string; ingresos: number; egresos: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#e74c3c" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
        <Tooltip
          contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
          itemStyle={{ color: '#fff', fontSize: '12px' }}
          labelStyle={{ color: '#94a3b8', fontSize: '11px', marginBottom: '4px' }}
        />
        <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
        <Area type="monotone" dataKey="egresos"  name="Egresos"  stroke="#e74c3c" strokeWidth={3} fillOpacity={1} fill="url(#colorEgresos)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

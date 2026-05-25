'use client';

import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

type SparklineProps = {
  data: number[];
  color?: string;
  gradientId: string;
  height?: number;
};

export function Sparkline({ data, color = '#4F46E5', gradientId, height = 28 }: SparklineProps) {
  const chartData = data.map((value, i) => ({ i, value }));
  return (
    <div className="w-full" style={{ height }} aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

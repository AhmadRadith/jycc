import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type ChartDatum = {
  week: string;
  diproses: number;
  selesai: number;
  menunggu: number;
};

const CHART_DATA: ChartDatum[] = [
  { week: 'M-12', diproses: 11.2, selesai: 8.4, menunggu: 4.2 },
  { week: 'M-11', diproses: 11.6, selesai: 8.7, menunggu: 4.1 },
  { week: 'M-10', diproses: 11.9, selesai: 8.9, menunggu: 4.0 },
  { week: 'M-9', diproses: 12.5, selesai: 9.1, menunggu: 3.8 },
  { week: 'M-8', diproses: 12.8, selesai: 9.4, menunggu: 3.6 },
  { week: 'M-7', diproses: 12.1, selesai: 9.2, menunggu: 3.5 },
  { week: 'M-6', diproses: 12.4, selesai: 9.5, menunggu: 3.4 },
  { week: 'M-5', diproses: 12.9, selesai: 9.7, menunggu: 3.2 },
  { week: 'M-4', diproses: 13.1, selesai: 9.9, menunggu: 3.3 },
  { week: 'M-3', diproses: 12.7, selesai: 9.6, menunggu: 3.6 },
  { week: 'M-2', diproses: 12.5, selesai: 9.4, menunggu: 3.9 },
  { week: 'M-1', diproses: 12.4, selesai: 9.8, menunggu: 4.7 },
];

const DashboardChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={CHART_DATA} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
        <CartesianGrid stroke="rgba(148,163,184,0.35)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="week"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fill: '#94a3b8', fontSize: 11 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[6, 14]}
          tickFormatter={(value) => `${value.toFixed(1)}k`}
          tick={{ fill: '#94a3b8', fontSize: 11 }}
        />
        <Tooltip
          cursor={{ stroke: 'rgba(99,102,241,0.25)', strokeWidth: 2 }}
          contentStyle={{
            borderRadius: 12,
            borderColor: 'rgba(15,23,42,0.08)',
            boxShadow: '0 10px 40px rgba(15,23,42,0.12)',
          }}
          labelStyle={{ fontWeight: 600, color: '#312e81' }}
          formatter={(rawValue: number | string, name) => {
            const value = typeof rawValue === 'number' ? rawValue : Number(rawValue);
            return [`${value.toFixed(1)}k`, name as string];
          }}
        />
        <Line type="monotone" dataKey="diproses" stroke="#6366f1" strokeWidth={3} dot={false} name="Diproses" />
        <Line type="monotone" dataKey="selesai" stroke="#22c55e" strokeWidth={3} dot={false} name="Selesai" />
        <Line
          type="monotone"
          dataKey="menunggu"
          stroke="#f97316"
          strokeWidth={3}
          strokeDasharray="6 4"
          dot={false}
          name="Menunggu"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DashboardChart;

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface FileDataItem {
    id: string; 
    type: string; 
  }
  
  interface ChartDataItem {
    name: string;
    value: number;
    color: string;
  }
  
  interface CustomizedLabelProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
    name?: string; 
    value?: number;
  }

  interface CustomLegendPayload {
    value: string | number; 
    id?: string; 
    type?: 'square' | 'line' | 'circle' | 'rect' | 'diamond' | 'triangle' | 'none'; 
    color?: string; 
    payload?: any; 
  }
const FILE_TYPE_COLORS : { [key: string]: string } = {
  'exam': '#ef4444', // Red
  'summary': '#3b82f6', // Blue
  'presentation': '#f59e0b', // Amber
  'lesson_plan': '#10b981', // Green
  'quiz': '#8b5cf6', // Purple
  'other': '#6b7280' // Gray
};

const FILE_TYPE_NAMES = {
  'exam': 'מבחנים',
  'summary': 'סיכומים',
  'presentation': 'מצגות',
  'lesson_plan': 'מערכי שיעור',
  'quiz': 'בחנים',
  'other': 'אחר'
};

const FileTypeDistributionChart = ({ data }: { data: FileDataItem[] })=> {

    const typeCounts: { [key: string]: number } = {};
    data.forEach(item => { 
      if (!typeCounts[item.type]) {
        typeCounts[item.type] = 0;
      }
      typeCounts[item.type] += 1;
    });

  const chartData: ChartDataItem[] = Object.keys(typeCounts).map(type => ({
    name: FILE_TYPE_NAMES[type as keyof typeof FILE_TYPE_NAMES] || type,
    value: typeCounts[type],
    color: FILE_TYPE_COLORS[type] || '#6b7280'
  }));

  // Custom render for the pie chart labels to prevent overlap
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: CustomizedLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5; // Label inside segment
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only render label if segment is large enough
    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
const legendPayload: CustomLegendPayload[] = chartData.map(entry => ({
  value: entry.name,
  type: 'square',
  color: entry.color,
}));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="40%" 
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={120} 
          innerRadius={60} 
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          paddingAngle={2}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value} קבצים`, name]}
          contentStyle={{
            direction: 'rtl',
            textAlign: 'right',
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '0.375rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        />
        <Legend 
          payload={legendPayload}
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          wrapperStyle={{ paddingTop: '20px' }} // Add padding to avoid overlap
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default FileTypeDistributionChart;
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

type DataItem = {
    date: string | Date; 
  };
  
type TimeRange = 'week' | 'month' | 'quarter' | 'year';
  
interface FileUploadActivityChartProps {
  data: DataItem[]; 
  timeRange: TimeRange;
}

  const aggregateDataByTime = (data: DataItem[], timeRange: TimeRange) => {
    const now = new Date();
    const filtered = data.filter(item => {
      const itemDate = new Date(item.date);
      if (timeRange === 'week') {
        return now.getTime() - itemDate.getTime() < 7 * 24 * 60 * 60 * 1000;
      } else if (timeRange === 'month') {
        return now.getTime() - itemDate.getTime() < 30 * 24 * 60 * 60 * 1000;
      } else if (timeRange === 'quarter') {
        return now.getTime() - itemDate.getTime() < 90 * 24 * 60 * 60 * 1000;
      } else {
        return now.getTime() - itemDate.getTime() < 365 * 24 * 60 * 60 * 1000;
      }
    });

  // Group by date
  const grouped = {};
  filtered.forEach(item => {
    const date = new Date(item.date);
    let key;
    
    if (timeRange === 'week') {
      // Format: "יום א'"
      const days = ['יום א\'', 'יום ב\'', 'יום ג\'', 'יום ד\'', 'יום ה\'', 'יום ו\'', 'שבת'];
      key = days[date.getDay()];
    } else if (timeRange === 'month') {
      // Format: "01/05"
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      key = `${day}/${month}`;
    } else {
      const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
      key = months[date.getMonth()];
    }

  });

  // Convert to array and sort
  let result = Object.values(grouped);
  
  // For week, maintain day order
  if (timeRange === 'week') {
    const dayOrder = ['יום א\'', 'יום ב\'', 'יום ג\'', 'יום ד\'', 'יום ה\'', 'יום ו\'', 'שבת'];
    result.sort((a : any, b : any) => dayOrder.indexOf(a.name) - dayOrder.indexOf(b.name));
  }

  return result;
};

const FileUploadActivityChart: React.FC<FileUploadActivityChartProps> = ({ data, timeRange }) => {

  const chartData = aggregateDataByTime(data, timeRange); 

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
      //data={chartData} 
        margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip 
          formatter={(value) => [`${value} קבצים`]}
          contentStyle={{
            direction: 'rtl',
            textAlign: 'right',
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '0.375rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        />
        <Bar dataKey="count" name="כמות קבצים" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FileUploadActivityChart;
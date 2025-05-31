import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FileData {
    date: string | Date; 
    size: number;
  }
  
  interface AggregatedDataItem {
    name: string;
    size: number; 
  }
  
  interface FileSizeOverTimeChartProps {
    data: FileData[];
    timeRange: 'week' | 'month' | 'quarter' | 'year'; 
  }

  type CustomTooltipFormatter = (
    value: number | string,
    name: string,
    props?: any, 
    index?: number, 
    data?: any 
  ) => [string | number, string | number]; 
  const aggregateDataByTime = (data: FileData[], timeRange: FileSizeOverTimeChartProps['timeRange']): AggregatedDataItem[] => {
    const now = new Date();

    const filtered = data.filter(item => { 
      const itemDate = new Date(item.date); 
      const timeDiff = now.getTime() - itemDate.getTime(); 
  
      if (timeRange === 'week') {
        return timeDiff < 7 * 24 * 60 * 60 * 1000;
      } else if (timeRange === 'month') {
        return timeDiff < 30 * 24 * 60 * 60 * 1000;
      } else if (timeRange === 'quarter') {
        return timeDiff < 90 * 24 * 60 * 60 * 1000;
      } else {
        return timeDiff < 365 * 24 * 60 * 60 * 1000;
      }
    });

  const grouped: { [key: string]: AggregatedDataItem } = {};
  filtered.forEach(item => { 
    const date = new Date(item.date);
    let key: string; 

    if (timeRange === 'week') {
      const days = ['יום א\'', 'יום ב\'', 'יום ג\'', 'יום ד\'', 'יום ה\'', 'יום ו\'', 'שבת'];
      key = days[date.getDay()];
    } else if (timeRange === 'month') {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      key = `${day}/${month}`;
    } else { 
      const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
      key = months[date.getMonth()];
    }

    if (!grouped[key]) {
      grouped[key] = { name: key, size: 0 };
    }
    grouped[key].size += item.size; 
  });


  let result: AggregatedDataItem[] = Object.values(grouped); // 'result' הוא מערך של AggregatedDataItem
  if (timeRange === 'week') {
    const dayOrder = ['יום א\'', 'יום ב\'', 'יום ג\'', 'יום ד\'', 'יום ה\'', 'יום ו\'', 'שבת'];
    result.sort((a, b) => dayOrder.indexOf(a.name) - dayOrder.indexOf(b.name));
  }

  return result;
};

const FileSizeOverTimeChart = ({ data, timeRange }: FileSizeOverTimeChartProps) => {
    const chartData = aggregateDataByTime(data, timeRange);
      const tooltipFormatter: CustomTooltipFormatter = (value) => [`${(value as number).toFixed(2)} MB`, 'נפח קבצים'];
  

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
        <defs>
          <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis 
          tickFormatter={(value) => `${value.toFixed(1)} MB`}
        />
        <Tooltip 
          formatter={tooltipFormatter} 
          contentStyle={{
            direction: 'rtl',
            textAlign: 'right',
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '0.375rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
        />
        <Area 
          type="monotone" 
          dataKey="size" 
          stroke="#3b82f6" 
          fillOpacity={1} 
          fill="url(#colorSize)" 
          name="נפח קבצים" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default FileSizeOverTimeChart;
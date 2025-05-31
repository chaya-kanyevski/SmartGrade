import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {  FileText,  Download,  Calendar, BarChart2, PieChart as PieChartIcon, Tag, Table as TableIcon} from 'lucide-react';
import FileUploadActivityChart from '../components/reports/FileUploadActivityChart';
import FileTypeDistributionChart from '../components/reports/FileTypeDistributionChart';
import FileSizeOverTimeChart from '../components/reports/FileSizeOverTimeChart';
// import PopularTagsChart from '../components/reports/PopularTagsChart';
import FilesPerCategoryTable from '../components/reports/FilesPerCategoryTable';
// הגדרת ממשקים לנתונים
interface FileDataItem {
    id: string;
    title: string;
    type: 'exam' | 'summary' | 'presentation' | 'lesson_plan' | 'quiz' | 'other';
    date: Date;
    size: number;
    tags: string[];
}

interface ActivityDataItem {
    id: string;
    date: Date;
    size: number;
}
type DataItem = {
    date: string | Date; 
  };
  
type TimeRange = 'week' | 'month' | 'quarter' | 'year';
// Updated Sample data with recent dates
const today = new Date();
const daysAgo = (days : number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - days);

const SAMPLE_FILES_DATA: FileDataItem[] = [
  { id: '1', title: 'מבחן חשבון כיתה ט', type: 'exam', date: daysAgo(5), size: 2.4, tags: ['מתמטיקה', 'כיתה ט', 'מבחן'] },
  { id: '2', title: 'סיכום תקופה מודרנית', type: 'summary', date: daysAgo(10), size: 1.7, tags: ['היסטוריה', 'כיתה יא'] },
  { id: '3', title: 'מצגת מערכת העיכול', type: 'presentation', date: daysAgo(15), size: 4.2, tags: ['ביולוגיה', 'כיתה ח', 'מערכות'] },
  { id: '4', title: 'מערך שיעור - שברים', type: 'lesson_plan', date: daysAgo(2), size: 0.8, tags: ['מתמטיקה', 'כיתה ז', 'שברים'] },
  { id: '5', title: 'בוחן בגרמנית', type: 'quiz', date: daysAgo(20), size: 0.5, tags: ['שפות', 'כיתה י', 'גרמנית'] },
  { id: '6', title: 'תרגילים באנגלית', type: 'other', date: daysAgo(8), size: 1.2, tags: ['אנגלית', 'כיתה ח', 'תרגול'] },
  { id: '7', title: 'מבחן מסכם - כימיה', type: 'exam', date: daysAgo(12), size: 2.1, tags: ['כימיה', 'כיתה יב', 'סוף שנה'] },
  { id: '8', title: 'מערך שיעור - אנרגיה', type: 'lesson_plan', date: daysAgo(18), size: 0.9, tags: ['פיזיקה', 'כיתה ט', 'אנרגיה'] }
];

const SAMPLE_ACTIVITY_DATA: ActivityDataItem[] = SAMPLE_FILES_DATA.map(file => ({
    id: file.id,
    date: file.date,
    size: file.size
}));


export default function Reports() {
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activity');
  const [reportType, setReportType] = useState('activity');

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleExportReport = () => {
    console.log(`Exporting ${reportType} report for ${timeRange} timeframe`);
    // In a real app, this would trigger a report download
  };

  return (
    <div className="fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">דוחות</h1>
        <Button variant="outline" onClick={handleExportReport}>
          <Download className="ml-2 h-5 w-5" />
          ייצוא דוח
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 mb-2">
        <div className="space-y-1">
          <label className="text-sm font-medium">טווח זמן</label>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="טווח זמן" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">שבוע אחרון</SelectItem>
              <SelectItem value="month">חודש אחרון</SelectItem>
              <SelectItem value="quarter">רבעון אחרון</SelectItem>
              <SelectItem value="year">שנה אחרונה</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">סוג דוח</label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="סוג דוח" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activity">פעילות</SelectItem>
              <SelectItem value="files">קבצים</SelectItem>
              <SelectItem value="users">משתמשים</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            פעילות
          </TabsTrigger>
          <TabsTrigger value="fileTypes" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            סוגי קבצים
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            תגיות
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <TableIcon className="h-4 w-4" />
            פרטים
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="activity">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>פעילות העלאת קבצים</CardTitle>
                  <CardDescription>מספר הקבצים שהועלו לאורך זמן</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div>blabla</div>
                   // <FileUploadActivityChart data={SAMPLE_ACTIVITY_DATA} timeRange={timeRange} />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>נפח קבצים לאורך זמן</CardTitle>
                  <CardDescription>סך כל נפח הקבצים שהועלו (במגהבייטים)</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div>blabla</div>
                    //<FileSizeOverTimeChart data={SAMPLE_ACTIVITY_DATA} timeRange={timeRange} />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="fileTypes">
            <Card>
              <CardHeader>
                <CardTitle>התפלגות סוגי קבצים</CardTitle>
                <CardDescription>התפלגות הקבצים לפי סוגים</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <FileTypeDistributionChart data={SAMPLE_FILES_DATA} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tags">
            <Card>
              <CardHeader>
                <CardTitle>תגיות פופולריות</CardTitle>
                <CardDescription>התגיות הנפוצות ביותר בקבצים</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) 
                : 
                (
                //   <PopularTagsChart data={SAMPLE_FILES_DATA} />
                <div>כאן יופיעו תגיות פופולריות</div>
                )
                }
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>פרטי קבצים</CardTitle>
                <CardDescription>מספר הקבצים מכל סוג ואחוזים</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <FilesPerCategoryTable data={SAMPLE_FILES_DATA} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
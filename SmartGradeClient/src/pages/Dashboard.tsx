import { useContext, useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { UserContext } from "../context/UserReducer";
import { Upload, FileText, Share2, Download, Clock, BarChart2, PenTool, Badge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RecentFiles from "@/components/dashboard/RecentFiles";
import TeachingTips from "@/components/dashboard/TeachingTips";
import KPICard from '../components/dashboard/KPICard';
import { fetchFilesByUser } from "@/services/fileService";
import { File, FileType } from "@/models/File";
import AddFile from "@/components/files/addFile";
import QuickLinks from "@/components/dashboard/QuickLinks";

function Dashboard() {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("activity");
  const [recentFiles, setRecentFiles] = useState<File[]>([]);
  const [isAddFileDialogOpen, setIsAddFileDialogOpen] = useState(false);
  const [filesThisMonth, setFilesThisMonth] = useState(0);
  const [growthPercent, setGrowthPercent] = useState(0);


  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        if (user?.id) {
          const files = await fetchFilesByUser(user.id);
          const sorted = [...files].sort(
            (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()
          );
          setRecentFiles(sorted.slice(0, 5)); 
        // חישוב הקבצים בחודש הנוכחי ובחודש הקודם
        const now = new Date();
        const currentMonthCount = countFilesInMonth(files, now.getFullYear(), now.getMonth());
        const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        const prevMonthCount = countFilesInMonth(files, prevYear, prevMonth);

        // חישוב אחוז הגידול
        let growthPercent = 0;
        if (prevMonthCount > 0) {
          growthPercent = ((currentMonthCount - prevMonthCount) / prevMonthCount) * 100;
        } else if (currentMonthCount > 0) {
          growthPercent = 100; // אם לא היו קבצים בחודש הקודם ויש בחודש הנוכחי
        }

        setFilesThisMonth(currentMonthCount);
        setGrowthPercent(growthPercent);
      }

      } catch (error) {
        console.error("שגיאה בטעינת הדשבורד:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  function countFilesInMonth(files: File[], year: number, month: number) {
    return files.filter(file => {
      const date = new Date(file.date!);
      return date.getFullYear() === year && date.getMonth() === month;
    }).length;
  }

  function formatPercent(value: number) {
    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
  }
  
  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            שלום, {user?.name || "משתמש יקר"}!
          </h1>
          <p className="text-gray-500 mt-1">הנה סיכום הפעילות שלך</p>
        </div>
        <Dialog open={isAddFileDialogOpen} onOpenChange={setIsAddFileDialogOpen}>
  <DialogTrigger asChild>
    <Button
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 shadow-md"
    >
      <Upload className="ml-2 h-4 w-4" />
      העלאת קובץ חדש
    </Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>העלאת קובץ חדש</DialogTitle>
      <DialogDescription>
        מלא את הפרטים והעלה את הקובץ שלך.
      </DialogDescription>
    </DialogHeader>
    <AddFile
onFileAdded={(fileDto: { 
  id: number; 
  title: string; 
  filePath?: string; 
  tags?: string[] | string | null; 
  description?: string; 
  type?: FileType; 
  size?: number; 
  date?: Date | string; 
}) => {
  const fileForDashboard: File = {
    id: fileDto.id,
    title: fileDto.title,
    filePath: fileDto.filePath || "",
    tags: Array.isArray(fileDto.tags)
      ? fileDto.tags as string[]
      : typeof fileDto.tags === "string"
      ? fileDto.tags.split(",").map(t => t.trim()).filter(Boolean)
      : [],
    description: fileDto.description,
    type: fileDto.type,
    size: fileDto.size,
    date: fileDto.date ? new Date(fileDto.date) : new Date(),
  };
  setRecentFiles((prev) => [fileForDashboard, ...prev]);
  setIsAddFileDialogOpen(false);
}}

  onClose={() => setIsAddFileDialogOpen(false)}
/>

  </DialogContent>
</Dialog>

      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
       <KPICard
          title="קבצים שהועלו"
          value={filesThisMonth}
          icon={Upload}
          description={`גידול של ${formatPercent(growthPercent)}% מהחודש שעבר`}
          isLoading={isLoading}
          iconColor="text-blue-600 bg-blue-100"
        />

        <KPICard
          title="קבצים שעודכנו לאחרונה"
          value="156"
          icon={PenTool}
          description="עדכון במהלך השבוע האחרון"
          isLoading={isLoading}
          iconBg="bg-green-100"
          iconColor="text-green-600 bg-green-100"
        />
        <KPICard
          title='סה"כ נפח (MB)'
          value={(
            recentFiles.reduce((acc, file) => acc + (file.size || 0), 0) / (1024 * 1024)
          ).toFixed(2)}
          icon={BarChart2}
          description="נפח כולל של כל הקבצים"
          isLoading={isLoading}
          iconBg="bg-purple-100"
          iconColor="text-purple-600 bg-purple-100"
        />
        <KPICard
          title="כמות תיוגים שונים"
          value={new Set(
            recentFiles.flatMap(file => 
              Array.isArray(file.tags) 
                ? file.tags.map(tag => tag.trim()) 
                : []
            )
            
          ).size}
          icon={Badge}
          description="תיוגים ייחודיים מכל הקבצים"
          isLoading={isLoading}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600 bg-yellow-100"
        />
      </div>

      {/* Tabs + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
  <div className="flex items-center justify-end gap-2 mb-4 w-full">
    <FileText className="h-5 w-5 text-blue-600" />
    <h2 className="text-xl font-bold text-gray-800 text-right flex-1">
      קבצים אחרונים
    </h2>
  </div>
  <RecentFiles files={recentFiles}/>
</div>


        {/* Sidebar */}
        <div className="space-y-6">
          <TeachingTips/>
          <QuickLinks />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;













//============================================================================

// import React, { useContext, useEffect, useState } from 'react';
// import { User } from '@/models/User';
// import { UserContext } from "../context/UserReducer";
// //import { InvokeLLM } from '@/integrations/Core';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import KPICard from '../components/reports/KPICard';
// //import { createPageUrl } from '@/utils';
// import { FileText, Upload,  Share2,  Download, Users, Clock, BookOpen, PenTool, Calendar, BarChart2, ChevronRight, Lightbulb} from 'lucide-react';

// function Dashboard() {
//   const { user } = useContext(UserContext);
//   const [isLoading, setIsLoading] = useState(true);
//   const [todayTips, setTodayTips] = useState<string[]>([]);
//   const [activeTab, setActiveTab] = useState('activity');

//   useEffect(() => {
//     const loadUserAndData = async () => {
//       try {
//         // const userData = await User.me();
//         // setUser(userData);
        
//         // Get AI teaching tips for today
//         generateTeachingTips();
        
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error loading user:", error);
//         setIsLoading(false);
//       }
//     };

//     loadUserAndData();
//   }, []);

//   const generateTeachingTips = async () => {
//     // try {
//     //   const response = await InvokeLLM({
//     //     prompt: "תן לי 3 טיפים קצרים וברורים בנושא הוראה, כל אחד בן שורה אחת.",
//     //     add_context_from_internet: false,
//     //     response_json_schema: {
//     //       type: "object",
//     //       properties: {
//     //         tips: {
//     //           type: "array",
//     //           items: { type: "string" }
//     //         }
//     //       }
//     //     }
//     //   });
//     //   // Assuming the response is now an object with a 'tips' array
//     //   setTodayTips(response.tips || []); 
//     // } catch (error) {
//     //  console.error("Error generating teaching tips:", error);
//       setTodayTips([
//         "שלב אלמנטים חזותיים בהוראה להגברת ההבנה והזיכרון.",
//         "הקדש זמן לרפלקציה בסוף כל שיעור.",
//         "התאם את ההוראה לסגנונות למידה שונים."
//        ]);
//     //}
//   };

//   // Sample upcoming events data
//   const upcomingEvents = [
//     { id: 1, title: "מבחן מתמטיקה כיתה ט'", date: "21.12.2023", time: "09:00", type: "exam" },
//     { id: 2, title: "ישיבת צוות מורים", date: "22.12.2023", time: "14:30", type: "meeting" },
//     { id: 3, title: "הגשת ציונים לתקופה", date: "24.12.2023", time: "20:00", type: "deadline" }
//   ];

//   // Sample recent files
//   const recentFiles = [
//     { id: 1, title: "מבחן אמצע שנה - היסטוריה", type: "exam", date: new Date(2023, 11, 18) },
//     { id: 2, title: "מערך שיעור - גיאוגרפיה", type: "lesson_plan", date: new Date(2023, 11, 17) },
//     { id: 3, title: "מצגת - מתמטיקה", type: "presentation", date: new Date(2023, 11, 15) },
//     { id: 4, title: "סיכום חומר - אנגלית", type: "summary", date: new Date(2023, 11, 14) }
//   ];

//   const formatDate = (date : Date) => {
//     return new Date(date).toLocaleDateString('he-IL', {
//       day: 'numeric',
//       month: 'numeric'
//     });
//   };

//   const fileTypeIcons = {
//     'exam': <PenTool className="h-4 w-4" />,
//     'lesson_plan': <BookOpen className="h-4 w-4" />,
//     'presentation': <FileText className="h-4 w-4" />,
//     'summary': <FileText className="h-4 w-4" />
//   };

//   const eventTypeColors = {
//     'exam': 'bg-red-100 text-red-800 border-red-200',
//     'meeting': 'bg-blue-100 text-blue-800 border-blue-200',
//     'deadline': 'bg-amber-100 text-amber-800 border-amber-200'
//   };

//   return (
    
//     <div className="fade-in space-y-6">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             שלום, 
//             {' '} 
//             {user.name  || 'משתמש יקר'} 
//             !
//           </h1>
//           <p className="text-gray-500 mt-1">הנה סיכום הפעילות שלך</p>
//         </div>
//         <Button
//           className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 shadow-md"
//           onClick={() => console.log("")
//             //window.location.href = createPageUrl("Files")
//             }
//         >
//           <Upload className="ml-2 h-4 w-4" />
//           העלאת קובץ חדש
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <KPICard 
//           title="קבצים שהועלו"
//           value={isLoading ? "..." : (
//             //user?.stats?.files_uploaded || 
//             "24")}
//           icon={Upload}
//           description="גידול של 12% מהחודש שעבר"
//           trend="up"
//           isLoading={isLoading}
//         />
//         <KPICard 
//           title="קבצים שנצפו"
//           value={isLoading ? "..." : (
//            // user?.stats?.files_viewed || 
//             "156")}
//           icon={FileText}
//           description="גידול של 8% מהחודש שעבר"
//           trend="up"
//           isLoading={isLoading}
//         />
//         <KPICard 
//           title="קבצים ששותפו"
//           value={isLoading ? "..." : (
//             //user?.stats?.files_shared || 
//             "8")}
//           icon={Share2}
//           description="ירידה של 5% מהחודש שעבר"
//           trend="down"
//           isLoading={isLoading}
//         />
//         <KPICard 
//           title="קבצים שהורדו"
//           value={isLoading ? "..." : (
//         //    user?.stats?.files_downloaded ||
//              "37")}
//           icon={Download}
//           description="זהה לחודש שעבר"
//           trend="neutral"
//           isLoading={isLoading}
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main content - 2/3 width on desktop */}
//         <div className="lg:col-span-2 space-y-6">
//           <Tabs value={activeTab} onValueChange={setActiveTab}>
//             <TabsList className="mb-4">
//               <TabsTrigger value="activity" className="flex items-center gap-2">
//                 <Clock className="h-4 w-4" />
//                 פעילות אחרונה
//               </TabsTrigger>
//               <TabsTrigger value="files" className="flex items-center gap-2">
//                 <FileText className="h-4 w-4" />
//                 קבצים אחרונים
//               </TabsTrigger>
//               <TabsTrigger value="stats" className="flex items-center gap-2">
//                 <BarChart2 className="h-4 w-4" />
//                 סטטיסטיקה
//               </TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="activity">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>פעילות אחרונה</CardTitle>
//                   <CardDescription>הפעולות האחרונות שבוצעו</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {isLoading ? (
//                       <div className="animate-pulse space-y-4">
//                         {[1, 2, 3].map((i) => (
//                           <div key={i} className="flex items-center gap-4">
//                             <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
//                             <div className="flex-1 space-y-2">
//                               <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//                               <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <>
//                         <div className="flex items-center gap-4">
//                           <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600">
//                             <Upload className="w-5 h-5" />
//                           </div>
//                           <div>
//                             <p className="font-medium">העלית קובץ חדש: "מבחן מסכם - מתמטיקה"</p>
//                             <p className="text-sm text-gray-500">לפני שעה</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center text-purple-600">
//                             <Share2 className="w-5 h-5" />
//                           </div>
//                           <div>
//                             <p className="font-medium">שיתפת קובץ עם דנה לוי</p>
//                             <p className="text-sm text-gray-500">לפני 3 שעות</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center text-green-600">
//                             <Download className="w-5 h-5" />
//                           </div>
//                           <div>
//                             <p className="font-medium">הורדת קובץ: "מערך שיעור - אלגברה"</p>
//                             <p className="text-sm text-gray-500">אתמול</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center text-amber-600">
//                             <Users className="w-5 h-5" />
//                           </div>
//                           <div>
//                             <p className="font-medium">הוספת לפורום הדיון "מתמטיקה לכיתה ט'"</p>
//                             <p className="text-sm text-gray-500">לפני יומיים</p>
//                           </div>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
            
//             <TabsContent value="files">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>קבצים אחרונים</CardTitle>
//                   <CardDescription>הקבצים האחרונים שהעלית וערכת</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {recentFiles.map(file => (
//                       <div key={file.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer">
//                         <div className="flex items-center gap-4">
//                           <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
//                             {
// //                            fileTypeIcons[file.type] || 
//                             <FileText className="w-5 h-5" />}
//                           </div>
//                           <div>
//                             <p className="font-medium">{file.title}</p>
//                             <p className="text-sm text-gray-500">{formatDate(file.date)}</p>
//                           </div>
//                         </div>
//                         <div className="flex gap-2">
//                           <Button variant="ghost" size="icon">
//                             <Download className="h-4 w-4" />
//                           </Button>
//                           <Button variant="ghost" size="icon">
//                             <Share2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
            
//             <TabsContent value="stats">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>סטטיסטיקה</CardTitle>
//                   <CardDescription>מידע סטטיסטי על הקבצים שלך</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
//                         <p className="text-sm font-medium text-blue-600 mb-1">התפלגות סוגי קבצים</p>
//                         <div className="flex items-center gap-2 text-sm text-gray-600 my-1">
//                           <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
//                           <span>מבחנים (42%)</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-sm text-gray-600 my-1">
//                           <div className="w-3 h-3 rounded-sm bg-purple-500"></div>
//                           <span>מערכי שיעור (28%)</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-sm text-gray-600 my-1">
//                           <div className="w-3 h-3 rounded-sm bg-green-500"></div>
//                           <span>מצגות (18%)</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-sm text-gray-600 my-1">
//                           <div className="w-3 h-3 rounded-sm bg-amber-500"></div>
//                           <span>סיכומים (12%)</span>
//                         </div>
//                       </div>
                      
//                       <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
//                         <p className="text-sm font-medium text-purple-600 mb-1">תגיות נפוצות</p>
//                         <div className="flex flex-wrap gap-2 mt-2">
//                           <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">מתמטיקה (14)</Badge>
//                           <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">היסטוריה (8)</Badge>
//                           <Badge className="bg-green-100 text-green-700 hover:bg-green-200">אנגלית (6)</Badge>
//                           <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">מדעים (5)</Badge>
//                           <Badge className="bg-red-100 text-red-700 hover:bg-red-200">ספרות (3)</Badge>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="mt-4">
//                       <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
//                         צפה בדוחות מפורטים
//                         <ChevronRight className="mr-2 h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>
        
//         {/* Sidebar - 1/3 width on desktop */}
//         <div className="space-y-6">
//           {/* Teaching tips */}
//           <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
//             <CardHeader className="pb-2">
//               <CardTitle className="flex items-center text-blue-700">
//                 <Lightbulb className="mr-2 h-5 w-5 text-blue-500" />
//                 טיפים להוראה
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {isLoading || !todayTips ? (
//                 <div className="animate-pulse space-y-3">
//                   <div className="h-4 bg-blue-100 rounded w-3/4"></div>
//                   <div className="h-4 bg-blue-100 rounded w-5/6"></div>
//                   <div className="h-4 bg-blue-100 rounded w-4/5"></div>
//                 </div>
//               ) : (
//                 <ul className="space-y-3">
//                   {todayTips.slice(0, 3).map((tip, index) => (
//                     <li key={index} className="flex items-start gap-2 text-gray-700">
//                       <div className="w-5 h-5 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
//                         {index + 1}
//                       </div>
//                       <p>{tip}</p>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </CardContent>
//           </Card>
          
//           {/* Upcoming events */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center">
//                 <Calendar className="mr-2 h-5 w-5 text-gray-500" />
//                 אירועים קרובים
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {upcomingEvents.map(event => (
//                   <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
//                     <div className="w-12 flex flex-col items-center justify-center flex-shrink-0">
//                       <span className="text-sm font-medium text-gray-600">{event.date.split('.')[0]}</span>
//                       <span className="text-xs text-gray-500">{event.time}</span>
//                     </div>
//                     <div className="flex-1">
//                       <p className="font-medium">{event.title}</p>
//                       <Badge variant="outline" 
// //                      className={eventTypeColors[event.type]}
//                       >
//                         {event.type === 'exam' ? 'מבחן' : 
//                          event.type === 'meeting' ? 'ישיבה' : 'תאריך יעד'}
//                       </Badge>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
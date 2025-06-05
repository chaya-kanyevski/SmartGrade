// components/AILessonPlanGenerator.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Copy, Download } from "lucide-react";
import { generateLessonPlan as generateLessonPlanApi } from "@/services/aiService"; // ייבוא מה-service

const AILessonPlanGenerator = () => {
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('middle');
  const [duration, setDuration] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [lessonPlan, setLessonPlan] = useState('');

  const [includeObjectives, setIncludeObjectives] = useState(true);
  const [includeActivities, setIncludeActivities] = useState(true);
  const [includeAssessment, setIncludeAssessment] = useState(true);
  const [includeResources, setIncludeResources] = useState(true);

  const generateLessonPlan = async () => {
    if (!topic.trim()) return;

    try {
      setIsLoading(true);

      const components: string[] = [];
      if (includeObjectives) components.push('Objectives');
      if (includeActivities) components.push('Activities');
      if (includeAssessment) components.push('Assessment');
      if (includeResources) components.push('Resources');

      const userId = 1; // בעתיד ניתן להעביר כ־prop או מתוך context

      const result = await generateLessonPlanApi(
        userId,
        topic,
        grade,
        duration,
        components
      );

      setLessonPlan(result);
    } catch (error) {
      console.error("Error generating lesson plan:", error);
      setLessonPlan("אירעה שגיאה בעת יצירת מערך השיעור. אנא נסה שוב מאוחר יותר.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (lessonPlan) {
      navigator.clipboard.writeText(lessonPlan);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>יצירת מערך שיעור</CardTitle>
        <CardDescription>צייני נושא ופרטי שיעור, וקבלי מערך מוכן תוך שניות</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>נושא השיעור</Label>
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} />
        </div>
        <div>
          <Label>שכבת גיל</Label>
          <Select value={grade} onValueChange={setGrade}>
            <SelectTrigger>
              <SelectValue placeholder="בחר שכבת גיל" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="elementary">יסודי</SelectItem>
              <SelectItem value="middle">חטיבת ביניים</SelectItem>
              <SelectItem value="high">תיכון</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>משך השיעור בדקות</Label>
          <Slider min={20} max={120} step={5} value={[duration]} onValueChange={([val]) => setDuration(val)} />
          <div>{duration} דקות</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
        <Label className="flex items-center space-x-2">
  <Checkbox checked={includeObjectives} onCheckedChange={(v) => setIncludeObjectives(v === true)} />
  <span>מטרות למידה</span>
</Label>
<Label className="flex items-center space-x-2">
  <Checkbox checked={includeActivities} onCheckedChange={(v) => setIncludeActivities(v === true)} />
  <span>שלבי שיעור</span>
</Label>
<Label className="flex items-center space-x-2">
  <Checkbox checked={includeAssessment} onCheckedChange={(v) => setIncludeAssessment(v === true)} />
  <span>הערכה</span>
</Label>
<Label className="flex items-center space-x-2">
  <Checkbox checked={includeResources} onCheckedChange={(v) => setIncludeResources(v === true)} />
  <span>חומרי עזר</span>
</Label>

        </div>
        <Button onClick={generateLessonPlan} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
          הפקת מערך שיעור
        </Button>
        {lessonPlan && (
          <div>
            <Label>מערך השיעור</Label>
            <Textarea rows={16} value={lessonPlan} readOnly />
            <div className="flex gap-2 mt-2">
              <Button variant="outline" onClick={handleCopyToClipboard}>
                <Copy className="h-4 w-4 mr-2" /> העתקה
              </Button>
              <Button variant="outline" onClick={() => {/* TODO: implement download */}}>
                <Download className="h-4 w-4 mr-2" /> הורדה
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default AILessonPlanGenerator;




// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Lightbulb,
//   Clock,
//   Users,
//   Loader2,
//   Copy,
//   Download,
//   Send,
//   BookOpen,
//   GraduationCap
// } from "lucide-react";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
// import { Checkbox } from '@/components/ui/checkbox';
// // import { InvokeLLM } from "@/integrations/Core";

// const AILessonPlanGenerator = () => {
//   const [topic, setTopic] = useState('');
//   const [grade, setGrade] = useState('middle');
//   const [duration, setDuration] = useState(45);
//   const [isLoading, setIsLoading] = useState(false);
//   const [lessonPlan, setLessonPlan] = useState('');
  
//   const [includeObjectives, setIncludeObjectives] = useState(true);
//   const [includeActivities, setIncludeActivities] = useState(true);
//   const [includeAssessment, setIncludeAssessment] = useState(true);
//   const [includeResources, setIncludeResources] = useState(true);

//   const generateLessonPlan = async () => {
//     if (!topic.trim()) return;

//     try {
//       setIsLoading(true);
      
//       let gradeText;
//       switch(grade) {
//         case 'elementary':
//           gradeText = 'יסודי (כיתות א-ו)';
//           break;
//         case 'middle':
//           gradeText = 'חטיב ת ביניים (כיתות ז-ט)';
//           break;
//         case 'high':
//           gradeText = 'תיכון (כיתות י-יב)';
//           break;
//         default:
//           gradeText = 'חטיבת ביניים';
//       }
      
//       let componentsText = [];
//       if (includeObjectives) componentsText.push('מטרות למידה');
//       if (includeActivities) componentsText.push('פעילויות מפורטות לשלבי השיעור השונים');
//       if (includeAssessment) componentsText.push('דרכי הערכה');
//       if (includeResources) componentsText.push('חומרי עזר וחומרי הוראה נדרשים');
      
//       const prompt = `
//       אנא צור מערך שיעור מפורט בעברית על הנושא: "${topic}".
      
//       פרטי השיעור:
//       - קהל יעד: ${gradeText}
//       - משך השיעור: ${duration} דקות
//       - יש לכלול: ${componentsText.join(', ')}
      
//       המערך צריך להיות מוצג במבנה ברור עם כותרות (#) וחלוקה לקטעים. השתמש בתבנית מקובלת של מערך שיעור כולל פתיחה, גוף, וסיכום.
      
//       כל הטקסט במערך צריך להיות בעברית ומותאם לשימוש על ידי מורה ישראלי.`;

//     //   const response = await InvokeLLM({
//     //     prompt,
//     //     add_context_from_internet: true
//     //   });

//     //  setLessonPlan(response);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error generating lesson plan:", error);
//       setIsLoading(false);
//       setLessonPlan("אירעה שגיאה בעת יצירת מערך השיעור. אנא נסה שוב מאוחר יותר.");
//     }
//   };

//   const handleCopyToClipboard = () => {
//     navigator.clipboard.writeText(lessonPlan);
//   };

//   const handleDownload = () => {
//     const blob = new Blob([lessonPlan], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `מערך_שיעור_${topic.replace(/\s+/g, '_')}.txt`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <BookOpen className="ml-2 h-5 w-5" />
//             יצירת מערך שיעור
//           </CardTitle>
//           <CardDescription>
//             צור מערך שיעור מפורט עם פעילויות ומטרות
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="space-y-2">
//             <Label htmlFor="topic">נושא השיעור</Label>
//             <Input
//               id="topic"
//               placeholder="לדוגמה: משפט פיתגורס, מלחמת העולם השנייה, מבנה התא"
//               value={topic}
//               onChange={(e : any) => setTopic(e.target.value)}
//             />
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="grade">קהל היעד</Label>
//             <Select value={grade} onValueChange={setGrade}>
//               <SelectTrigger>
//                 <SelectValue placeholder="בחר רמת גיל" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="elementary">יסודי (כיתות א-ו)</SelectItem>
//                 <SelectItem value="middle">חטיבת ביניים (כיתות ז-ט)</SelectItem>
//                 <SelectItem value="high">תיכון (כיתות י-יב)</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
          
//           <div className="space-y-2">
//             <div className="flex justify-between items-center">
//               <Label htmlFor="duration">משך השיעור</Label>
//               <span className="text-sm text-gray-600">{duration} דקות</span>
//             </div>
//             <Slider
//               id="duration"
//               min={10}
//               max={120}
//               step={5}
//               value={[duration]}
//               onValueChange={(val) => setDuration(val[0])}
//             />
//           </div>
          
//           <div className="space-y-2">
//             <Label>מרכיבי מערך השיעור</Label>
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <Checkbox 
//                   id="objectives"
//                   checked={includeObjectives}
//                 //  onCheckedChange={setIncludeObjectives}
//                 />
//                 <Label htmlFor="objectives" className="cursor-pointer">מטרות למידה</Label>
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <Checkbox 
//                   id="activities"
//                   checked={includeActivities}
//                 //  onCheckedChange={setIncludeActivities}
//                 />
//                 <Label htmlFor="activities" className="cursor-pointer">פעילויות</Label>
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <Checkbox 
//                   id="assessment"
//                   checked={includeAssessment}
//                 //  onCheckedChange={setIncludeAssessment}
//                 />
//                 <Label htmlFor="assessment" className="cursor-pointer">הערכה</Label>
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <Checkbox 
//                   id="resources"
//                   checked={includeResources}
//                  // onCheckedChange={setIncludeResources}
//                 />
//                 <Label htmlFor="resources" className="cursor-pointer">חומרי עזר</Label>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Button
//             className="w-full"
//             onClick={generateLessonPlan}
//             disabled={isLoading || !topic.trim()}
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="ml-2 h-4 w-4 animate-spin" />
//                 מייצר מערך שיעור...
//               </>
//             ) : (
//               <>
//                 <Send className="ml-2 h-4 w-4" />
//                 צור מערך שיעור
//               </>
//             )}
//           </Button>
//         </CardFooter>
//       </Card>
      
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <GraduationCap className="ml-2 h-5 w-5" />
//             מערך שיעור
//           </CardTitle>
//           <CardDescription>
//             מערך שיעור שנוצר על ידי בינה מלאכותית
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {lessonPlan ? (
//             <div className="p-4 bg-gray-50 rounded-lg border min-h-[200px] max-h-[500px] overflow-y-auto rtl whitespace-pre-wrap">
//               {lessonPlan}
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-[350px] text-center p-4">
//               <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
//               <h3 className="text-xl font-medium text-gray-700">אין מערך שיעור עדיין</h3>
//               <p className="text-gray-500 mt-2">
//                 השתמש בטופס משמאל כדי ליצור מערך שיעור
//               </p>
//             </div>
//           )}
//         </CardContent>
//         {lessonPlan && (
//           <CardFooter className="flex gap-2 justify-end border-t pt-4">
//             <Button variant="outline" onClick={handleCopyToClipboard}>
//               <Copy className="ml-2 h-4 w-4" />
//               העתק
//             </Button>
//             <Button variant="outline" onClick={handleDownload}>
//               <Download className="ml-2 h-4 w-4" />
//               הורד כקובץ
//             </Button>
//           </CardFooter>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default AILessonPlanGenerator;
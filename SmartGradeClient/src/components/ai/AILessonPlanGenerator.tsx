import { useContext, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Loader2, Copy, Download, Send, GraduationCap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from '@/components/ui/checkbox';
import { generateLessonPlan as generateLessonPlanApi } from "@/services/aiService";
import { UserContext } from '@/context/UserReducer';

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
  const { user } = useContext(UserContext);

  const generateLessonPlan = async () => {
    if (!topic.trim()) return;

    try {
      setIsLoading(true);

      const components: string[] = [];
      if (includeObjectives) components.push('Objectives');
      if (includeActivities) components.push('Activities');
      if (includeAssessment) components.push('Assessment');
      if (includeResources) components.push('Resources');

      const userId = user.id; // בעתיד ניתן להעביר כ־prop או מתוך context

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
    navigator.clipboard.writeText(lessonPlan);
  };

  const handleDownload = () => {
    const blob = new Blob([lessonPlan], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `מערך_שיעור_${topic.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="ml-2 h-5 w-5 text-blue-700" />
            יצירת מערך שיעור
          </CardTitle>
          <CardDescription>
            צור מערך שיעור מפורט עם פעילויות ומטרות
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">נושא השיעור</Label>
            <Input
              id="topic"
              placeholder="לדוגמה: משפט פיתגורס, מלחמת העולם השנייה, מבנה התא"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">קהל היעד</Label>
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger>
                <SelectValue placeholder="בחר רמת גיל" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elementary">יסודי (כיתות א-ו)</SelectItem>
                <SelectItem value="middle">חטיבת ביניים (כיתות ז-ט)</SelectItem>
                <SelectItem value="high">תיכון (כיתות י-יב)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="duration">משך השיעור</Label>
              <span className="text-sm text-gray-600">{duration} דקות</span>
            </div>
            <Slider
              id="duration"
              min={10}
              max={120}
              step={5}
              value={[duration]}
              onValueChange={(val) => setDuration(val[0])}
            />
          </div>

          <div className="space-y-2">
            <Label>מרכיבי מערך השיעור</Label>
            <div className="space-y-2">
              {[
                { id: "objectives", label: "מטרות למידה", state: includeObjectives, setter: setIncludeObjectives },
                { id: "activities", label: "פעילויות", state: includeActivities, setter: setIncludeActivities },
                { id: "assessment", label: "הערכה", state: includeAssessment, setter: setIncludeAssessment },
                { id: "resources", label: "חומרי עזר", state: includeResources, setter: setIncludeResources },
              ].map(({ id, label, state, setter }) => (
                <div key={id} className="flex items-center gap-2">
                  <Checkbox
                    id={id}
                    checked={state}
                    onCheckedChange={(checked) => setter(checked === true)}
                  />
                  <Label htmlFor={id} className="cursor-pointer">{label}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 rounded-md shadow-md hover:opacity-90 transition"
            onClick={generateLessonPlan}
            disabled={isLoading || !topic.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                מייצר מערך שיעור...
              </>
            ) : (
              <>
                <Send className="ml-2 h-4 w-4" />
                צור מערך שיעור
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="ml-2 h-5 w-5 text-blue-700" />
            מערך שיעור
          </CardTitle>
          <CardDescription>
            מערך שיעור שנוצר על ידי בינה מלאכותית
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lessonPlan ? (
            <div className="p-4 bg-gray-50 rounded-lg border min-h-[200px] max-h-[500px] overflow-y-auto rtl whitespace-pre-wrap">
              {lessonPlan}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[350px] text-center p-4">
              <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700">אין מערך שיעור עדיין</h3>
              <p className="text-gray-500 mt-2">
                השתמש בטופס משמאל כדי ליצור מערך שיעור
              </p>
            </div>
          )}
        </CardContent>
        {lessonPlan && (
          <CardFooter className="flex gap-2 justify-end border-t pt-4">
            <Button
              variant="outline"
              onClick={handleCopyToClipboard}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition"
            >
              <Copy className="ml-2 h-4 w-4" />
              העתק
            </Button>
            <Button
              variant="outline"
              onClick={handleDownload}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition"
            >
              <Download className="ml-2 h-4 w-4" />
              הורד כקובץ
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default AILessonPlanGenerator;
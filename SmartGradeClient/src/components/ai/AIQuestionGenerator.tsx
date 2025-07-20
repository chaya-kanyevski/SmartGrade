import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileQuestion, FileUp, FileText, Loader2, Copy, Download, Send } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { generateQuestions as generateQuestionsAPI } from "../../services/aiService";

const AIQuestionGenerator = () => {
  const [textInput, setTextInput] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficultyLevel, setDifficultyLevel] = useState('medium');
  const [questionType, setQuestionType] = useState('multiple_choice');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsLoading(true);
        setUploadedFileName(file.name);
        // const { file_url } = await UploadFile({ file });
        // setFileUrl(file_url);
        setFileUrl("uploaded-file-url"); // סימולציה
        setIsLoading(false);
      } catch (error) {
        console.error("Error uploading file:", error);
        setIsLoading(false);
      }
    }
  };

  const generateQuestions = async () => {
    if ((!textInput && activeTab === 'text') || (!fileUrl && activeTab === 'file')) {
      return;
    }

    try {
      setIsLoading(true);

      let prompt = `נא ליצור ${numQuestions} שאלות ${getQuestionTypeText(questionType)} ברמה ${getDifficultyText(difficultyLevel)} על הנושא הבא:\n\n`;

      if (activeTab === 'text') {
        prompt += textInput;
      } else {
        prompt += `הקובץ שהועלה: ${uploadedFileName}. אנא צור שאלות מבוססות על תוכן הקובץ.`;
      }

      prompt += `\n\nבנוסף, אנא הוסף תשובות לשאלות. יש לסדר את השאלות במספור ולהציג באופן ברור.`;

      const response = await generateQuestionsAPI(
        1,
        textInput,
        getQuestionTypeText(questionType),
        getDifficultyText(difficultyLevel),
        numQuestions,
        activeTab === 'text' ? textInput : uploadedFileName
      );

      setGeneratedQuestions(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating questions:", error);
      setIsLoading(false);
      setGeneratedQuestions("אירעה שגיאה בעת יצירת השאלות. אנא נסה שוב מאוחר יותר.");
    }
  };

  const getDifficultyText = (level: any) => {
    switch (level) {
      case 'easy': return 'רמה קלה';
      case 'medium': return 'רמה בינונית';
      case 'hard': return 'רמה קשה';
      default: return 'רמה בינונית';
    }
  };

  const getQuestionTypeText = (type: any) => {
    switch (type) {
      case 'multiple_choice': return 'רב-ברירה';
      case 'open': return 'פתוחות';
      case 'true_false': return 'נכון/לא נכון';
      default: return 'רב-ברירה';
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedQuestions);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedQuestions], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'שאלות_מחוללות.txt';
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
            <FileQuestion className="ml-2 h-5 w-5" />
            יצירת שאלות
          </CardTitle>
          <CardDescription>
            צור שאלות מתקדמות מתוך טקסט או קובץ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 p-1 shadow-sm">
              <TabsTrigger
                value="text"
                className="rounded-lg py-2 font-medium text-blue-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-colors"
              >
                הקלדת טקסט
              </TabsTrigger>
              <TabsTrigger
                value="file"
                className="rounded-lg py-2 font-medium text-blue-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-colors"
              >
                העלאת קובץ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="textInput">הזן טקסט ליצירת שאלות</Label>
                <Textarea
                  id="textInput"
                  placeholder="הזן את הטקסט כאן..."
                  className="min-h-[150px] rtl"
                  value={textInput}
                  onChange={(e: any) => setTextInput(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="file" className="space-y-4">
              <div className="space-y-2">
                <Label>העלה קובץ (PDF, DOCX, TXT)</Label>
                <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center bg-gradient-to-br from-blue-50 to-purple-50 shadow-inner">
                  <FileUp className="mx-auto h-10 w-10 text-blue-500 mb-3" />
                  <p className="text-sm text-blue-600 mb-2">גרור ושחרר קובץ, או</p>
                  <label htmlFor="file-upload" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md shadow hover:opacity-90 cursor-pointer transition">
                    בחר קובץ
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                  />
                  {fileUrl && (
                    <div className="mt-3">
                      <Badge variant="outline" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>{uploadedFileName}</span>
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="numQuestions">מספר שאלות</Label>
              <Select value={numQuestions.toString()} onValueChange={(value) => setNumQuestions(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מספר" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 שאלות</SelectItem>
                  <SelectItem value="5">5 שאלות</SelectItem>
                  <SelectItem value="10">10 שאלות</SelectItem>
                  <SelectItem value="15">15 שאלות</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">רמת קושי</Label>
              <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר רמה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">קלה</SelectItem>
                  <SelectItem value="medium">בינונית</SelectItem>
                  <SelectItem value="hard">קשה</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionType">סוג שאלות</Label>
              <Select value={questionType} onValueChange={setQuestionType}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">רב-ברירה</SelectItem>
                  <SelectItem value="open">שאלות פתוחות</SelectItem>
                  <SelectItem value="true_false">נכון/לא נכון</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 rounded-md shadow-md hover:opacity-90 transition"
            onClick={generateQuestions}
            disabled={
              isLoading ||
              (activeTab === 'text' && !textInput.trim()) ||
              (activeTab === 'file' && !fileUrl)
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                מייצר שאלות...
              </>
            ) : (
              <>
                <Send className="ml-2 h-4 w-4" />
                צור שאלות
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="ml-2 h-5 w-5" />
            שאלות שנוצרו
          </CardTitle>
          <CardDescription>
            שאלות שנוצרו על ידי בינה מלאכותית
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generatedQuestions ? (
            <div className="p-4 bg-gray-50 rounded-lg border min-h-[200px] max-h-[400px] overflow-y-auto rtl whitespace-pre-wrap">
              {generatedQuestions}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
              <FileQuestion className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700">אין שאלות עדיין</h3>
              <p className="text-gray-500 mt-2">
                השתמש בטופס משמאל כדי ליצור שאלות
              </p>
            </div>
          )}
        </CardContent>
        {generatedQuestions && (
          <CardFooter className="flex gap-2 justify-end border-t pt-4">
            <Button variant="outline" onClick={handleCopyToClipboard} className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition">
              <Copy className="ml-2 h-4 w-4" />
              העתק
            </Button>
            <Button variant="outline" onClick={handleDownload} className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition">
              <Download className="ml-2 h-4 w-4" />
              הורד כקובץ
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default AIQuestionGenerator;

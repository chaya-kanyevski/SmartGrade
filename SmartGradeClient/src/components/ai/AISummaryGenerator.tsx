import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlignJustify,
  FileUp,
  Loader2,
  Copy,
  Download,
  Send,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { summarizeText } from '@/services/aiService';

const AISummaryGenerator = () => {
  const [textInput, setTextInput] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  const [summaryLength, setSummaryLength] = useState(50);
  const [summaryStyle, setSummaryStyle] = useState('concise');

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsLoading(true);
        setUploadedFileName(file.name);
        // סימולציה להעלאת קובץ
        // const { file_url } = await UploadFile({ file });
        // setFileUrl(file_url);
        setFileUrl("uploaded-file-url");
        setIsLoading(false);
      } catch (error) {
        console.error("Error uploading file:", error);
        setIsLoading(false);
      }
    }
  };

  const generateSummary = async () => {
    if ((!textInput && activeTab === 'text') || (!fileUrl && activeTab === 'file')) {
      return;
    }

    try {
      setIsLoading(true);

      let lengthModifier;
      if (summaryLength < 30) {
        lengthModifier = "קצר מאוד, בתמצות רב";
      } else if (summaryLength < 60) {
        lengthModifier = "באורך בינוני";
      } else {
        lengthModifier = "ארוך ומפורט";
      }

      let styleModifier;
      switch (summaryStyle) {
        case 'concise':
          styleModifier = "תמציתי וממוקד";
          break;
        case 'bullet_points':
          styleModifier = "בנקודות עיקריות";
          break;
        case 'detailed':
          styleModifier = "מפורט ומעמיק";
          break;
        case 'simplified':
          styleModifier = "פשוט וקל להבנה";
          break;
        default:
          styleModifier = "תמציתי";
      }

      let prompt = `אנא צור סיכום ${lengthModifier} בסגנון ${styleModifier} לתוכן הבא:\n\n`;

      if (activeTab === 'text') {
        prompt += textInput;
      } else {
        prompt += `הקובץ שהועלה: ${uploadedFileName}. אנא סכם את תוכן הקובץ.`;
      }

      const response = await summarizeText(
        1,
        activeTab === 'text' ? textInput : uploadedFileName,
        lengthModifier,
        styleModifier
      );

      setGeneratedSummary(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating summary:", error);
      setIsLoading(false);
      setGeneratedSummary("אירעה שגיאה בעת יצירת הסיכום. אנא נסה שוב מאוחר יותר.");
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedSummary);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedSummary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'סיכום.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <AlignJustify className="h-5 w-5 text-blue-600" />
            יצירת סיכום
          </CardTitle>
          <CardDescription className="text-blue-600">
            צור סיכום תמציתי מטקסט או קובץ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-1 shadow-sm">
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
                <Label htmlFor="textInput" className="text-blue-700 font-semibold">הזן טקסט לסיכום</Label>
                <Textarea
                  id="textInput"
                  placeholder="הזן את הטקסט כאן..."
                  className="min-h-[200px] rtl border border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="file" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-blue-700 font-semibold">העלה קובץ (PDF, DOCX, TXT)</Label>
                <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center bg-gradient-to-br from-blue-50 to-purple-50 shadow-inner cursor-pointer hover:border-blue-500 transition-colors">
                  <FileUp className="mx-auto h-10 w-10 text-blue-500 mb-3" />
                  <p className="text-sm text-blue-600 mb-2">גרור ושחרר קובץ, או</p>
                  <label
                    htmlFor="file-upload-summary"
                    className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md shadow hover:opacity-90 cursor-pointer transition"
                  >
                    בחר קובץ
                  </label>
                  <input
                    id="file-upload-summary"
                    type="file"
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                  />
                  {fileUrl && (
                    <div className="mt-3">
                      <Badge variant="outline" className="text-blue-700 border-blue-700">
                        {uploadedFileName}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-6 mt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-blue-700 font-semibold">אורך הסיכום</Label>
                <span className="text-sm text-blue-500 font-medium">
                  {summaryLength < 30 ? 'קצר' : summaryLength < 60 ? 'בינוני' : 'ארוך'}
                </span>
              </div>
              <Slider
                value={[summaryLength]}
                min={1}
                max={100}
                step={1}
                onValueChange={(value: any) => setSummaryLength(value[0])}
                className="my-4"
                color="blue"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-blue-700 font-semibold">סגנון הסיכום</Label>
              <Select
                value={summaryStyle}
                onValueChange={setSummaryStyle}
              >
                <SelectTrigger className="border border-blue-300 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="בחר סגנון" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concise">תמציתי וממוקד</SelectItem>
                  <SelectItem value="bullet_points">נקודות עיקריות</SelectItem>
                  <SelectItem value="detailed">מפורט ומעמיק</SelectItem>
                  <SelectItem value="simplified">פשוט וקל להבנה</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 rounded-md shadow-md hover:opacity-90 transition"
            onClick={generateSummary}
            disabled={
              isLoading ||
              (activeTab === 'text' && !textInput.trim()) ||
              (activeTab === 'file' && !fileUrl)
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                מייצר סיכום...
              </>
            ) : (
              <>
                <Send className="ml-2 h-4 w-4" />
                צור סיכום
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <AlignJustify className="h-5 w-5 text-blue-600" />
            סיכום
          </CardTitle>
          <CardDescription className="text-blue-600">
            סיכום שנוצר על ידי בינה מלאכותית
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generatedSummary ? (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 min-h-[200px] max-h-[400px] overflow-y-auto rtl whitespace-pre-wrap text-blue-900 font-medium">
              {generatedSummary}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
              <AlignJustify className="h-16 w-16 text-blue-300 mb-4" />
              <h3 className="text-xl font-semibold text-blue-700">אין סיכום עדיין</h3>
              <p className="text-blue-500 mt-2">
                השתמש בטופס משמאל כדי ליצור סיכום
              </p>
            </div>
          )}
        </CardContent>
        {generatedSummary && (
          <CardFooter className="flex gap-2 justify-end border-t border-blue-200 pt-4">
            <Button
              variant="outline"
              className="text-blue-700 border-blue-700 hover:bg-blue-50 hover:text-blue-800 transition"
              onClick={handleCopyToClipboard}
            >
              <Copy className="ml-2 h-4 w-4" />
              העתק
            </Button>
            <Button
              variant="outline"
              className="text-blue-700 border-blue-700 hover:bg-blue-50 hover:text-blue-800 transition"
              onClick={handleDownload}
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

export default AISummaryGenerator;

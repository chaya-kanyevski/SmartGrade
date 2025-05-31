import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  AlignJustify, 
  FileUp, 
  Loader2, 
  Copy, 
  Download,
  Send
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
//import { InvokeLLM, UploadFile } from "@/integrations/Core";

const AISummaryGenerator = () => {
  const [textInput, setTextInput] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  const [summaryLength, setSummaryLength] = useState(50); // 1-100
  const [summaryStyle, setSummaryStyle] = useState('concise');

  const handleFileUpload = async (e : any) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsLoading(true);
        setUploadedFileName(file.name);
        // const { file_url } = await UploadFile({ file });
        // setFileUrl(file_url);
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

    //   const response = await InvokeLLM({
    //     prompt,
    //     add_context_from_internet: activeTab === 'text',
    //     file_urls: activeTab === 'file' ? [fileUrl] : undefined
    //   });

    //  setGeneratedSummary(response);
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
          <CardTitle className="flex items-center">
            <AlignJustify className="ml-2 h-5 w-5" />
            יצירת סיכום
          </CardTitle>
          <CardDescription>
            צור סיכום תמציתי מטקסט או קובץ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="text">הקלדת טקסט</TabsTrigger>
              <TabsTrigger value="file">העלאת קובץ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="textInput">הזן טקסט לסיכום</Label>
                <Textarea
                  id="textInput"
                  placeholder="הזן את הטקסט כאן..."
                  className="min-h-[200px] rtl"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="file" className="space-y-4">
              <div className="space-y-2">
                <Label>העלה קובץ (PDF, DOCX, TXT)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <FileUp className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500 mb-2">גרור ושחרר קובץ, או</p>
                  <div>
                    <label htmlFor="file-upload-summary" className="button bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer inline-block">
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
                  </div>
                  {fileUrl && (
                    <div className="mt-3">
                      <Badge variant="outline">{uploadedFileName}</Badge>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="space-y-6 mt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>אורך הסיכום</Label>
                <span className="text-sm text-gray-500">
                  {summaryLength < 30 ? 'קצר' : summaryLength < 60 ? 'בינוני' : 'ארוך'}
                </span>
              </div>
              <Slider
                value={[summaryLength]}
                min={1}
                max={100}
                step={1}
                onValueChange={(value : any) => setSummaryLength(value[0])}
                className="my-4"
              />
            </div>
            
            <div className="space-y-2">
              <Label>סגנון הסיכום</Label>
              <Select value={summaryStyle} onValueChange={setSummaryStyle}>
                <SelectTrigger>
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
            className="w-full"
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
          <CardTitle className="flex items-center">
            <AlignJustify className="ml-2 h-5 w-5" />
            סיכום
          </CardTitle>
          <CardDescription>
            סיכום שנוצר על ידי בינה מלאכותית
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generatedSummary ? (
            <div className="p-4 bg-gray-50 rounded-lg border min-h-[200px] max-h-[400px] overflow-y-auto rtl whitespace-pre-wrap">
              {generatedSummary}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
              <AlignJustify className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700">אין סיכום עדיין</h3>
              <p className="text-gray-500 mt-2">
                השתמש בטופס משמאל כדי ליצור סיכום
              </p>
            </div>
          )}
        </CardContent>
        {generatedSummary && (
          <CardFooter className="flex gap-2 justify-end border-t pt-4">
            <Button variant="outline" onClick={handleCopyToClipboard}>
              <Copy className="ml-2 h-4 w-4" />
              העתק
            </Button>
            <Button variant="outline" onClick={handleDownload}>
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
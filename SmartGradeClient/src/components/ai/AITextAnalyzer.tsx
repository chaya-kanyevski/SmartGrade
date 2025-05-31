import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  FileUp, 
  Loader2, 
  Copy, 
  Tag,
  List,
  Send
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
//import { InvokeLLM, UploadFile } from "@/integrations/Core";

const AITextAnalyzer = () => {
  const [textInput, setTextInput] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeTab, setActiveTab] = useState('text');
  const [analysisType, setAnalysisType] = useState('concepts');

  const handleFileUpload = async (e : any) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsLoading(true);
        setUploadedFileName(file.name);
        // const { file_url } = await UploadFile({ file : any });
        // setFileUrl(file_url);
        setIsLoading(false);
      } catch (error) {
        console.error("Error uploading file:", error);
        setIsLoading(false);
      }
    }
  };

  const analyzeText = async () => {
    if ((!textInput && activeTab === 'text') || (!fileUrl && activeTab === 'file')) {
      return;
    }

    try {
      setIsLoading(true);
      
      let prompt = '';
      
      switch (analysisType) {
        case 'concepts':
          prompt = 'זהה וסכם את המושגים המרכזיים בטקסט הבא. עבור כל מושג תן הגדרה ברורה והסבר על משמעותו בהקשר הכולל. הצג זאת במבנה של כותרת למושג ופסקה קצרה לכל מושג. השתמש בכותרות עם סולמיות (#) לארגון התוכן.\n\n';
          break;
        case 'themes':
          prompt = 'זהה את הנושאים והרעיונות המרכזיים בטקסט הבא. עבור כל נושא, תן הסבר על הרעיון המרכזי ואיך הוא מתקשר לתוכן הכולל. הצג זאת במבנה מדורג עם כותרות ברורות.\n\n';
          break;
        case 'tags':
          prompt = 'צור רשימה של תגיות רלוונטיות לטקסט הבא. התגיות צריכות לכלול מושגי מפתח, נושאים, וקטגוריות מרכזיות. עבור כל תגית, הסבר בקצרה מדוע היא רלוונטית. הצג את התגיות ברשימה מסודרת.\n\n';
          break;
      }
      
      if (activeTab === 'text') {
        prompt += textInput;
      } else {
        prompt += `הקובץ שהועלה: ${uploadedFileName}. אנא נתח את תוכן הקובץ.`;
      }

    //   const response = await InvokeLLM({
    //     prompt,
    //     add_context_from_internet: activeTab === 'text',
    //     file_urls: activeTab === 'file' ? [fileUrl] : undefined
    //   });

    //   setAnalysisResult(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Error analyzing text:", error);
      setIsLoading(false);
    //  setAnalysisResult("אירעה שגיאה בעת ניתוח הטקסט. אנא נסה שוב מאוחר יותר.");
    }
  };

  const handleCopyToClipboard = () => {
    if (analysisResult) {
      navigator.clipboard.writeText(analysisResult);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="ml-2 h-5 w-5" />
            ניתוח טקסט
          </CardTitle>
          <CardDescription>
            זיהוי מושגים, נושאים ותגיות מתוך טקסט
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
                <Label htmlFor="textInput">הזן טקסט לניתוח</Label>
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
                    <label htmlFor="file-upload-analysis" className="button bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer inline-block">
                      בחר קובץ
                    </label>
                    <input 
                      id="file-upload-analysis" 
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
          
          <div className="mt-6">
            <Label>סוג הניתוח</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                variant={analysisType === 'concepts' ? 'default' : 'outline'}
                className="flex items-center gap-2"
                onClick={() => setAnalysisType('concepts')}
              >
                <Search className="h-4 w-4" />
                מושגים מרכזיים
              </Button>
              <Button
                variant={analysisType === 'themes' ? 'default' : 'outline'}
                className="flex items-center gap-2"
                onClick={() => setAnalysisType('themes')}
              >
                <List className="h-4 w-4" />
                נושאים ורעיונות
              </Button>
              <Button
                variant={analysisType === 'tags' ? 'default' : 'outline'}
                className="flex items-center gap-2"
                onClick={() => setAnalysisType('tags')}
              >
                <Tag className="h-4 w-4" />
                הצעת תגיות
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={analyzeText}
            disabled={
              isLoading || 
              (activeTab === 'text' && !textInput.trim()) || 
              (activeTab === 'file' && !fileUrl)
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                מנתח טקסט...
              </>
            ) : (
              <>
                <Send className="ml-2 h-4 w-4" />
                נתח טקסט
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {analysisType === 'concepts' ? (
              <Search className="ml-2 h-5 w-5" />
            ) : analysisType === 'themes' ? (
              <List className="ml-2 h-5 w-5" />
            ) : (
              <Tag className="ml-2 h-5 w-5" />
            )}
            {analysisType === 'concepts' ? 'מושגים מרכזיים' : 
             analysisType === 'themes' ? 'נושאים ורעיונות' : 'תגיות מוצעות'}
          </CardTitle>
          <CardDescription>
            ניתוח שנוצר על ידי בינה מלאכותית
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analysisResult ? (
            <div className="p-4 bg-gray-50 rounded-lg border min-h-[200px] max-h-[400px] overflow-y-auto rtl whitespace-pre-wrap">
              {analysisResult}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
              <Search className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700">אין ניתוח עדיין</h3>
              <p className="text-gray-500 mt-2">
                השתמש בטופס משמאל כדי לנתח טקסט
              </p>
            </div>
          )}
        </CardContent>
        {analysisResult && (
          <CardFooter className="flex gap-2 justify-end border-t pt-4">
            <Button variant="outline" onClick={handleCopyToClipboard}>
              <Copy className="ml-2 h-4 w-4" />
              העתק ניתוח
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default AITextAnalyzer;
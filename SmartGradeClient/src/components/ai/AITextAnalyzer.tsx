import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, FileUp, Loader2, Copy, Tag, List, Send } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { analyzeText as analyzeTextAPI } from '../../services/aiService';

const AITextAnalyzer = () => {
  const [textInput, setTextInput] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  const [analysisType, setAnalysisType] = useState('concepts');

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsLoading(true);
        setUploadedFileName(file.name);
        // const { file_url } = await UploadFile({ file });
        // setFileUrl(file_url);
        setFileUrl('dummy_url'); // זמני
        setIsLoading(false);
      } catch (error) {
        console.error("Error uploading file:", error);
        setIsLoading(false);
      }
    }
  };

  const analyzeText = async () => {
    if ((!textInput && activeTab === 'text') || (!fileUrl && activeTab === 'file')) return;
    try {
      setIsLoading(true);
      let prompt = '';
      switch (analysisType) {
        case 'concepts':
          prompt = 'זהה וסכם את המושגים המרכזיים בטקסט הבא...';
          break;
        case 'themes':
          prompt = 'זהה את הנושאים והרעיונות המרכזיים בטקסט הבא...';
          break;
        case 'tags':
          prompt = 'צור רשימה של תגיות רלוונטיות לטקסט הבא...';
          break;
      }
      prompt += activeTab === 'text' ? textInput : `הקובץ: ${uploadedFileName}`;

      const response = await analyzeTextAPI(
        1,
        activeTab === 'text' ? textInput : uploadedFileName,
        analysisType
      );

      setAnalysisResult(response);
    } catch (error) {
      console.error("Error analyzing text:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (analysisResult) {
      navigator.clipboard.writeText(analysisResult);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-xl">
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
                <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center bg-gradient-to-br from-blue-50 to-purple-50 shadow-inner">
                  <FileUp className="mx-auto h-10 w-10 text-blue-500 mb-3" />
                  <p className="text-sm text-blue-600 mb-2">גרור ושחרר קובץ, או</p>
                  <label htmlFor="file-upload-analysis" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md shadow hover:opacity-90 cursor-pointer transition">
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
                  {fileUrl && (
                    <div className="mt-3">
                      <Badge variant="outline" className="flex items-center gap-2">
                        <FileUp className="h-4 w-4" />
                        <span>{uploadedFileName}</span>
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Label>סוג הניתוח</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['concepts', 'themes', 'tags'].map(type => (
                <Button
                  key={type}
                  variant={analysisType === type ? 'default' : 'outline'}
                  className={
                    analysisType === type
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow"
                      : "border-blue-200 text-blue-700 hover:bg-blue-50 transition"
                  }
                  onClick={() => setAnalysisType(type)}
                >
                  {type === 'concepts' && <Search className="h-4 w-4 ml-1" />}
                  {type === 'themes' && <List className="h-4 w-4 ml-1" />}
                  {type === 'tags' && <Tag className="h-4 w-4 ml-1" />}
                  {type === 'concepts' ? 'מושגים מרכזיים' : type === 'themes' ? 'נושאים ורעיונות' : 'הצעת תגיות'}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 rounded-md shadow-md hover:opacity-90 transition"
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

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            {analysisType === 'concepts' ? <Search className="ml-2 h-5 w-5" /> : analysisType === 'themes' ? <List className="ml-2 h-5 w-5" /> : <Tag className="ml-2 h-5 w-5" />}
            {analysisType === 'concepts' ? 'מושגים מרכזיים' : analysisType === 'themes' ? 'נושאים ורעיונות' : 'תגיות מוצעות'}
          </CardTitle>
          <CardDescription>ניתוח שנוצר על ידי בינה מלאכותית</CardDescription>
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
              <p className="text-gray-500 mt-2">השתמש בטופס משמאל כדי לנתח טקסט</p>
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

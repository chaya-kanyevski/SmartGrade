import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, FileQuestion, AlignJustify, BookOpen } from "lucide-react";

import AIQuestionGenerator from '../components/ai/AIQuestionGenerator';
import AISummaryGenerator from '../components/ai/AISummaryGenerator';
import AITextAnalyzer from '../components/ai/AITextAnalyzer';
import AILessonPlanGenerator from '../components/ai/AILessonPlanGenerator';

export default function AI() {
  const [activeTab, setActiveTab] = useState("questions");
  
  return (
    <div className="fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">עוזר מורה חכם</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="ml-2 h-6 w-6" />
            כלי בינה מלאכותית לעבודת המורה
          </CardTitle>
          <CardDescription>
            בחר באחד הכלים החכמים כדי לחסוך זמן ולהעשיר את ההוראה שלך
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="questions" className="flex items-center">
                <FileQuestion className="ml-2 h-4 w-4" />
                יצירת שאלות
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center">
                <AlignJustify className="ml-2 h-4 w-4" />
                יצירת סיכום
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center">
                <Brain className="ml-2 h-4 w-4" />
                ניתוח טקסט
              </TabsTrigger>
              <TabsTrigger value="lesson" className="flex items-center">
                <BookOpen className="ml-2 h-4 w-4" />
                מערך שיעור
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-8">
              <TabsContent value="questions">
                <AIQuestionGenerator />
              </TabsContent>
              
              <TabsContent value="summary">
                <AISummaryGenerator />
              </TabsContent>
              
              <TabsContent value="analysis">
                <AITextAnalyzer />
              </TabsContent>
              
              <TabsContent value="lesson">
                <AILessonPlanGenerator />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
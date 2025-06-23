using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Requests
{
    public class AIRequests
    {
        public int UserId { get; set; }
        public string Topic { get; set; }
        public string Grade { get; set; }
        public int Duration { get; set; }
        public List<string> Components { get; set; }
    }
    public class QuestionRequest
    {
        public int UserId { get; set; }
        public string Topic { get; set; }
        public string QuestionType { get; set; } // למשל: multiple_choice, open
        public string Difficulty { get; set; } // למשל: easy, medium, hard
        public int NumQuestions { get; set; }
        public string TextOrFileName { get; set; }
    }

    public class SummarizeRequest
    {
        public int UserId { get; set; }
        public string TextOrFileName { get; set; }
        public string SummaryLength { get; set; } 
        public string SummaryStyle { get; set; } 
    }

    public class AnalyzeRequest
    {
        public int UserId { get; set; }
        public string TextOrFileName { get; set; }
        public string AnalysisType { get; set; } // למשל: concepts, tags, themes
    }

    public class TeachingTipsRequest
    {
        public int UserId { get; set; }
    }

}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Models
{
    public class AiAction
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string ActionType { get; set; } // למשל: LessonPlan, QuestionGeneration, Summary, TextAnalysis
        public string InputData { get; set; }  // JSON או טקסט חופשי של הקלט
        public string Result { get; set; }     // הפלט מה-AI
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}

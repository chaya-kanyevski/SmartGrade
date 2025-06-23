using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.Repositories;
using SmartGradeAPI.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SmartGradeAPI.Service
{
    public class AiService : IAiService
    {
        private readonly IAiActionRepository _logRepository;
        private readonly IOpenAiClient _openAiClient; // תגדירי מחלקה שתדבר עם OpenAI

        public AiService(IAiActionRepository logRepository, IOpenAiClient openAiClient)
        {
            _logRepository = logRepository;
            _openAiClient = openAiClient;
        }

        public async Task<string> GenerateLessonPlanAsync(int userId, string topic, string grade, int duration, List<string> components)
        {
            string prompt = $@"
אנא צור מערך שיעור מפורט בעברית על הנושא: ""{topic}"".    

פרטי השיעור:
- קהל יעד: {grade}
- משך השיעור: {duration} דקות
- יש לכלול: {string.Join(", ", components)}

המערך צריך להיות מוצג במבנה ברור עם כותרות (#) וחלוקה לקטעים. השתמש בתבנית מקובלת של מערך שיעור כולל פתיחה, גוף, וסיכום.

כל הטקסט במערך צריך להיות בעברית ומותאם לשימוש על ידי מורה ישראלי.";

            var result = await _openAiClient.SendPromptAsync(prompt);

            await _logRepository.AddActionLogAsync(new AiAction
            {
                UserId = userId,
                ActionType = "LessonPlan",
                InputData = JsonSerializer.Serialize(new { topic, grade, duration, components }),
                Result = result
            });

            return result;
        }

        public async Task<string> GenerateQuestionsAsync(int userId, string topic, string questionType, string difficulty, int numQuestions, string textOrFileName)
        {
            string prompt = $@"נא ליצור {numQuestions} שאלות {GetQuestionTypeText(questionType)} ברמה {GetDifficultyText(difficulty)} על הנושא הבא:

{textOrFileName}

בנוסף, אנא הוסף תשובות לשאלות. יש לסדר את השאלות במספור ולהציג באופן ברור.";

            var result = await _openAiClient.SendPromptAsync(prompt);

            await _logRepository.AddActionLogAsync(new AiAction
            {
                UserId = userId,
                ActionType = "Questions",
                InputData = JsonSerializer.Serialize(new { topic, questionType, difficulty, numQuestions }),
                Result = result
            });

            return result;
        }

        public async Task<string> SummarizeTextAsync(int userId, string textOrFileName, string summaryLength, string summaryStyle)
        {
            //string lengthModifier = summaryLength < 30 ? "קצר מאוד, בתמצות רב" :
            //                        summaryLength < 60 ? "באורך בינוני" : "ארוך ומפורט";

            string styleModifier = summaryStyle switch
            {
                "concise" => "תמציתי וממוקד",
                "bullet_points" => "בנקודות עיקריות",
                "detailed" => "מפורט ומעמיק",
                "simplified" => "פשוט וקל להבנה",
                _ => "תמציתי"
            };

            string prompt = $@"אנא צור סיכום {summaryLength} בסגנון {styleModifier} לתוכן הבא:

{textOrFileName}";

            var result = await _openAiClient.SendPromptAsync(prompt);

            await _logRepository.AddActionLogAsync(new AiAction
            {
                UserId = userId,
                ActionType = "Summarize",
                InputData = JsonSerializer.Serialize(new { summaryLength, summaryStyle }),
                Result = result
            });

            return result;
        }

        public async Task<string> AnalyzeTextAsync(int userId, string textOrFileName, string analysisType)
        {
            string prompt = analysisType switch
            {
                "concepts" => @"זהה וסכם את המושגים המרכזיים בטקסט הבא. עבור כל מושג תן הגדרה והסבר בהקשר. הצג כותרות עם # לכל מושג:

                " + textOrFileName,

                "themes" => @"זהה את הנושאים המרכזיים בטקסט הבא. הסבר כיצד הם מתקשרים לרעיון הכללי. הצג זאת בכותרות ברורות:

                " + textOrFileName,

                "tags" => @"צור רשימת תגיות רלוונטיות לטקסט הבא. עבור כל תגית, הסבר בקצרה מדוע היא רלוונטית:

                " + textOrFileName,

                _ => throw new ArgumentException("Invalid analysis type")
            };

            var result = await _openAiClient.SendPromptAsync(prompt);

            await _logRepository.AddActionLogAsync(new AiAction
            {
                UserId = userId,
                ActionType = "Analyze",
                InputData = JsonSerializer.Serialize(new { analysisType }),
                Result = result
            });

            return result;
        }

        private string GetQuestionTypeText(string type) => type switch
        {
            "multiple_choice" => "רב-ברירה",
            "open" => "פתוחות",
            _ => "כלליות"
        };

        private string GetDifficultyText(string level) => level switch
        {
            "easy" => "קלה",
            "medium" => "בינונית",
            "hard" => "קשה",
            _ => "בינונית"
        };

        public async Task<List<string>> GetTeachingTipsAsync(int userId)
        {
            string prompt = @"תן לי 5 טיפים שימושיים להוראה עבור מורים בישראל, בעברית ברורה ותמציתית. הצג כל טיפ בשורה חדשה.";

            var result = await _openAiClient.SendPromptAsync(prompt);

            // הפרדה לפי שורות:
            var tips = result.Split('\n')
                             .Select(t => t.Trim())
                             .Where(t => !string.IsNullOrWhiteSpace(t))
                             .ToList();

            await _logRepository.AddActionLogAsync(new AiAction
            {
                UserId = userId,
                ActionType = "TeachingTips",
                InputData = "", // אין קלט מיוחד
                Result = result
            });

            return tips;
        }

    }
}

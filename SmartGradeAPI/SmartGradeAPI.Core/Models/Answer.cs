using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Models
{
    public class Answer
    {
        public int Id { get; set; }
        public int QuestionNumber { get; set; }
        public string Text { get; set; } 
        public bool IsCorrect { get; set; }
        public int Value { get; set; }
        public int ExamId { get; set; }
        public Answer()
        {

        }

        public Answer(int id, int questionNumber, string text, bool isCorrect, int value, int examId)
        {
            Id = id;
            QuestionNumber = questionNumber;
            Text = text;
            IsCorrect = isCorrect;
            Value = value;
            ExamId = examId;
        }
    }
}

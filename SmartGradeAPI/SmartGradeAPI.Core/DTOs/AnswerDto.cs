using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.DTOs
{
    public class AnswerDto
    {
        public int QuestionNumber { get; set; }
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
        public int Value { get; set; }
        public int ExamId { get; set; }
    }
}

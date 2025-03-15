using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Models
{
    public class Exam
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; } 
        public string Subject { get; set; } 
        public string Class { get; set; }
        public List<Question> Questions { get; set; } 

        public Exam()
        {
            Questions = new List<Question>();
        }
    }
}

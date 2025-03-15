using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Models
{
    public class Class
    {
        public int Id { get; set; }
        public string Name { get; set; }  
        public List<Student> Students { get; set; }  
        public List<Exam> Exams { get; set; }  

        public Class()
        {
            Students = new List<Student>();
            Exams = new List<Exam>();
        }
    }
}

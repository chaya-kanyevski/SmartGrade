using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Models
{
    public class Report
    {
        public int Id { get; set; }
        public int StudentId { get; set; }  
        public DateTime DateGenerated { get; set; }  
        public List<Grade> Grades { get; set; } 

        public Report()
        {
            Grades = new List<Grade>();
        }
    }
}

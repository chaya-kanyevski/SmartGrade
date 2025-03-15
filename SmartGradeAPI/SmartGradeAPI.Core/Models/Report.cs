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
        public string UserId { get; set; }
        public DateTime DateGenerated { get; set; }  = DateTime.Now;
        public List<Student> Students { get; set; } 

        public Report()
        {

        }
        public Report(int id, string userId, List<Student> students)
        {
            Id = id;
            UserId = userId;
            Students = students;
        }
    }
}

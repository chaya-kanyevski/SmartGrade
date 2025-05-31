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

        public Report()
        {

        }
        public Report(int id, string userId)
        {
            Id = id;
            UserId = userId;
        }
    }
}

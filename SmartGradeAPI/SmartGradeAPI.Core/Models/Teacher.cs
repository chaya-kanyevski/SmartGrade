using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Models
{
    public class Teacher : User
    {
        public string Subject { get; set; }
        public List<Class> Classes { get; set; }
    }
}

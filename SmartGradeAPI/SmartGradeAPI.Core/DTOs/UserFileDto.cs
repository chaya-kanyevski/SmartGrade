using SmartGradeAPI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.DTOs
{
    public class UserFileDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; }
        public string FilePath { get; set; }
        public string Tags { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public int Size { get; set; }


    }
}

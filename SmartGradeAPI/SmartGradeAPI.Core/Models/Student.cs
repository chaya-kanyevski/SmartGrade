﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Models
{
    public class Student : User
    {
        public int UserId { get; set; }
        public string Class { get; set; }
        public List<ExamUpload> ExamsUpload { get; set; }
        public Student()
        {

        }
        public Student(int id, string name, string email, string password, string @class) : base(id, name, email, password)
        {
            Class = @class;
        }
    }
}

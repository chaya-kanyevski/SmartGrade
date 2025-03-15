﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public int ExamId { get; set; }
        public Question()
        {
            
        }
        public Question(int id, string text, int examId)
        {
            Id = id;
            Text = text;
            ExamId = examId;
        }
    }
}

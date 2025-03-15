﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartGradeAPI.Core.Models;

namespace SmartGradeAPI.Data
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Exam> Exams { get; set; }
        public DbSet<ExamUpload> ExamsUploads { get; set; }   
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }  
        public DbSet<Report> Reports { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Server=(localdb)\MSSQLLocalDB;Database=sample_db");
        }
    }
}

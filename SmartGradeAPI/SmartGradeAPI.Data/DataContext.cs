using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartGradeAPI.Core.DTOs;
using SmartGradeAPI.Core.Models;

namespace SmartGradeAPI.Data
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Exam> Exam { get; set; }
        public DbSet<ExamUpload> ExamsUploads { get; set; }   
        public DbSet<Question> Questions { get; set; }
        public DbSet<Report> Reports { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Server=(localdb)\MSSQLLocalDB;Database=SmartGrade");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Student>().ToTable("Students");
            modelBuilder.Entity<ExamDto>().HasNoKey();
        }

    }
}

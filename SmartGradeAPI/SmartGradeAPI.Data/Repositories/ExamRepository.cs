using Microsoft.EntityFrameworkCore;
using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Data.Repositories
{
    public class ExamRepository : IExamRepository
    {
        private readonly DataContext _context;

        public ExamRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<bool> AddExamAsync(Exam newexam)
        {
            _context.Exam.Add(newexam);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Exam> GetByIdAsync(int id)
        {
            return await _context.Exam.FirstOrDefaultAsync(e => e.Id == id) ?? throw new Exception("Exam not found");
        }

        public async Task<List<Exam>> GetExamsByUserIdAsync(int userId)
        {
            return await _context.Exam.Where(e => e.UserId == userId).ToListAsync();
        }

        public async Task<bool> UpdateExamAsync(Exam exam)
        {
            var existingExam = await _context.Exam.FirstOrDefaultAsync(e => e.Id == exam.Id);
            if (existingExam == null)
                throw new Exception("המבחן לא נמצא");

            existingExam.Subject = exam.Subject;
            existingExam.Title = exam.Title;
            existingExam.Class = exam.Class;
            existingExam.Questions = exam.Questions;
            existingExam.ExamUploads = exam.ExamUploads;
            existingExam.ExampleExamPath = exam.ExampleExamPath;

            _context.Exam.Update(existingExam);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteExamAsync(int id)
        {
            var exam = await _context.Exam.FindAsync(id);
            if (exam == null)
            {
                return false;
            }

            _context.Exam.Remove(exam);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}

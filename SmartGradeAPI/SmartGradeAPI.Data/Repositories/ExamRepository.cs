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
            _context.Exams.Add(newexam);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Exam> GetByIdAsync(int id)
        {
            return await _context.Exams.FirstOrDefaultAsync(e => e.Id == id) ?? throw new Exception("Exam not found");
        }
    }
}

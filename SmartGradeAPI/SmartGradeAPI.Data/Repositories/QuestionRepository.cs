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
    public class QuestionRepository : IQuestionRepository
    {
        private readonly DataContext _context;
        public QuestionRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<bool> AddQuestionAsync(Question question)
        {
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Question> GetQuestionByIdAsync(int id, int examId)
        {
            return await _context.Questions.FirstOrDefaultAsync(q => q.Id == id && q.ExamId == examId) 
                ?? throw new Exception("Question not found");
        }
    }
}

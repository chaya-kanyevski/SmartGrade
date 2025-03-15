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
    public class AnswerRepository : IAnswerRepository
    {
        private readonly DataContext _context;

        public AnswerRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<bool> AddAnswerAsync(Answer answer)
        {
            _context.Answers.Add(answer);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Answer> GetAnswerByIdAsync(int id, int examId)
        {
            return await _context.Answers.FirstOrDefaultAsync(a => a.Id == id && a.ExamId == examId)
                ?? throw new Exception("Answer not found");
        }
    }
}

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
    public class ExamUploadRepository : IExamUploadRepository
    {
        private readonly DataContext _context;
        public ExamUploadRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> AddExamUploadAsync(ExamUpload examUpload)
        {
            _context.ExamsUploads.Add(examUpload);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<ExamUpload>> GetAllByIdAsync(int id)
        {
            return await _context.ExamsUploads.Where(e => e.Id == id).ToListAsync();
        }

        public async Task<ExamUpload> GetExamUploadAsync(int id, int exam_id)
        {
            return await _context.ExamsUploads.FirstOrDefaultAsync(e => e.Id == id && e.ExamId == exam_id)
                                ?? throw new Exception("ExamUpload not found"); ; 
        }
    }
}

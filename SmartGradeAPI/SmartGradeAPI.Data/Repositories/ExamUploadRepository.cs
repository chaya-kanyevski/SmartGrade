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
            return await _context.ExamsUploads.Where(e => e.ExamId == id).ToListAsync();
        }

        public async Task<ExamUpload> GetExamUploadByIdAsync(int id)
        {
            return await _context.ExamsUploads.FirstOrDefaultAsync(e => e.Id == id)
                                ?? throw new Exception("ExamUpload not found"); ; 
        }
        public async Task<bool> UpdateExamUploadAsync(ExamUpload examUpload)
        {
            var existingUpload = await _context.ExamsUploads.FindAsync(examUpload.Id);
            if (existingUpload != null)
            {
                _context.Entry(existingUpload).CurrentValues.SetValues(examUpload);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
        public async Task<bool> DeleteExamUploadAsync(int id)
        {
            var examUpload = await _context.ExamsUploads.FindAsync(id);
            if (examUpload != null)
            {
                _context.ExamsUploads.Remove(examUpload);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

    }
}

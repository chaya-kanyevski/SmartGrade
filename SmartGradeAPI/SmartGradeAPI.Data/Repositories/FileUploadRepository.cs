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
    public class FileUploadRepository : IFileUploadRepository
    {
        private readonly DataContext _context; 
        public FileUploadRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> AddFileUploadAsync(FileUpload fileUpload)
        {
            _context.FilesUploads.Add(fileUpload);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<FileUpload>> GetAllByIdAsync(int id)
        {
            return await _context.FilesUploads.Where(e => e.FileId == id).ToListAsync();
        }

        public async Task<FileUpload> GetFileUploadByIdAsync(int id)
        {
            return await _context.FilesUploads.FirstOrDefaultAsync(e => e.Id == id)
                                ?? throw new Exception("FileUpload not found"); ; 
        }
        public async Task<bool> UpdateFileUploadAsync(FileUpload fileUpload)
        {
            var existingUpload = await _context.FilesUploads.FindAsync(fileUpload.Id);
            if (existingUpload != null)
            {
                _context.Entry(existingUpload).CurrentValues.SetValues(fileUpload);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
        public async Task<bool> DeleteFileUploadAsync(int id)
        {
            var fileUpload = await _context.FilesUploads.FindAsync(id);
            if (fileUpload != null)
            {
                _context.FilesUploads.Remove(fileUpload);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

    }
}
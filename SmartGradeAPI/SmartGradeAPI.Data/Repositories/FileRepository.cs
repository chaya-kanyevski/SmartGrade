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
    public class FileRepository : IUserFileRepository
    {
        private readonly DataContext _context;

        public FileRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> AddFileAsync(UserFile newFile)
        {
            _context.Files.Add(newFile);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<UserFile> GetByIdAsync(int id)
        {
             return await _context.Files.FirstOrDefaultAsync(e => e.Id == id)
                   ?? throw new Exception("File not found");
        }

        public async Task<List<UserFile>> GetFilesByUserIdAsync(int userId)
        {
            return await _context.Files.Where(e => e.UserId == userId).ToListAsync();
        }

        public async Task<bool> UpdateFileAsync(UserFile file)
        {
            var existingFile = await _context.Files.FirstOrDefaultAsync(e => e.Id == file.Id);
            if (existingFile == null)
                throw new Exception("המבחן לא נמצא");

            existingFile.Title = file.Title;
            existingFile.Type = file.Type;
            existingFile.Size = file.Size;
            existingFile.Tags = file.Tags;
            existingFile.FilePath = file.FilePath;
            existingFile.Description = file.Description; 

            _context.Files.Update(existingFile); 
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteFileAsync(int id)
        {
            var file = await _context.Files.FindAsync(id);
            if (file == null)
            {
                return false;
            }

            _context.Files.Remove(file);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
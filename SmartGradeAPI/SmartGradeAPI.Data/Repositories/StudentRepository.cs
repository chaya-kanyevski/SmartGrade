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
    public class StudentRepository : IStudentRepository
    {
        private readonly DataContext _context;

        public StudentRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<bool> AddStudentAsync(Student student)
        {
            _context.Users.OfType<Student>().ToList();
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteStudentAsync(string id)
        {
            Student student = await _context.Users.OfType<Student>().FirstOrDefaultAsync(s => s.Id.Equals(id))
                ?? throw new Exception("Student not found");
            _context.Users.Remove(student);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Student>> GetAllStudentsAsync()
        {
            return await _context.Users.OfType<Student>().ToListAsync();
        }

        public async Task<Student> GetStudentById(string id)
        {
            return await _context.Users.OfType<Student>().FirstOrDefaultAsync(x => x.Id == id)
                ?? throw new Exception("Student not found");
        }
    }
}

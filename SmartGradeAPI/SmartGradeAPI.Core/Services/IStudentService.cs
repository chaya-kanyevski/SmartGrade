using SmartGradeAPI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Services
{
    public interface IStudentService
    {
        Task<List<Student>> GetAllStudentsAsync();

        Task<Student> GetStudentById(int id);

        Task<bool> DeleteStudentAsync(int id);

        Task<bool> AddStudentAsync(Student student);
    }
}

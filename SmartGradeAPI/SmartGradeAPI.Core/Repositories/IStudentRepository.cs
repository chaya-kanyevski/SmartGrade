using SmartGradeAPI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Repositories
{
    public interface IStudentRepository
    {
        Task<List<Student>> GetAllStudentsAsync();

        Task<Student> GetStudentById(string id);

        Task<bool> DeleteStudentAsync(string id);

        Task<bool> AddStudentAsync(Student student);
    }
}

using SmartGradeAPI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Services
{
    public interface IExamService
    {
        Task<Exam> GetByIdAsync(int id);
        Task<bool> AddExamAsync(Exam newexam);
        Task<List<Exam>> GetExamsByUserIdAsync(int userId);
    }
}

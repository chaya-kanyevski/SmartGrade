using SmartGradeAPI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Services
{
    public interface IQuestionService
    {
        Task<Question> GetQuestionByIdAsync(int id, int examId);
        Task<bool> AddQuestionAsync(Question question);
    }
}

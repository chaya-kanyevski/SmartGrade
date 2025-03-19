using SmartGradeAPI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Services
{
    public interface IAnswerService
    {
        Task<Answer> GetAnswerByIdAsync(int id, int examId);
        Task<bool> AddAnswerAsync(Answer answer);
        Task<List<Answer>> GetAllAnswersAsync(int exam_id);
        Task<bool> DeleteAnswerAsync(int id);
    }
}

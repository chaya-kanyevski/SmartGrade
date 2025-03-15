using SmartGradeAPI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Repositories
{
    public interface IAnswerRepository
    {
        Task<Answer> GetAnswerByIdAsync(int id, int examId);
        Task<bool> AddAnswerAsync(Answer answer);
    }
}

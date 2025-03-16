using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.Repositories;
using SmartGradeAPI.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Service
{
    public class AnswerService : IAnswerService
    {
        private readonly IAnswerRepository _answerRepository;
        public AnswerService(IAnswerRepository answerRepository)
        {
            _answerRepository = answerRepository;
        }
        public  async Task<bool> AddAnswerAsync(Answer answer)
        {
            return await _answerRepository.AddAnswerAsync(answer);
        }

        public async Task<Answer> GetAnswerByIdAsync(int id, int examId)
        {
            return await GetAnswerByIdAsync(id, examId);
        }
    }
}

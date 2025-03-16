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
    public class QuestionService : IQuestionService
    {
        private readonly IQuestionRepository _questionRepository;
        public QuestionService(IQuestionRepository questionRepository)
        {
            _questionRepository = questionRepository;
        }

        public async Task<bool> AddQuestionAsync(Question question)
        {
            return await _questionRepository.AddQuestionAsync(question);
        }

        public async Task<Question> GetQuestionByIdAsync(int id, int examId)
        {
            return await _questionRepository.GetQuestionByIdAsync(id, examId);
        }
    }
}

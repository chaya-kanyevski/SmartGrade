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
    public class ExamService : IExamService
    {
        private readonly IExamRepository _examRepository;
        public ExamService(IExamRepository examRepository)
        {
            _examRepository = examRepository;
        }

        public async Task<bool> AddExamAsync(Exam newexam)
        {
            return await _examRepository.AddExamAsync(newexam);
        }

        public async Task<Exam> GetByIdAsync(int id)
        {
            return await _examRepository.GetByIdAsync(id);
        }
    }
}

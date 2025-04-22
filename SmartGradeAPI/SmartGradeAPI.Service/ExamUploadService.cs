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
    public class ExamUploadService : IExamUploadService
    {
        private readonly IExamUploadRepository _examUploadRepository;
        public ExamUploadService(IExamUploadRepository examUploadRepository)
        {
            _examUploadRepository = examUploadRepository;
        }

        public async Task<bool> AddExamUploadAsync(ExamUpload examUpload)
        {
            return await _examUploadRepository.AddExamUploadAsync(examUpload);
        }

        public async Task<bool> DeleteExamUploadAsync(int id)
        {
            return await _examUploadRepository.DeleteExamUploadAsync(id);
        }

        public async Task<List<ExamUpload>> GetAllByIdAsync(int id)
        {
            return await _examUploadRepository.GetAllByIdAsync(id);
        }

        public async Task<ExamUpload> GetExamUploadByIdAsync(int id)
        {
            return await _examUploadRepository.GetExamUploadByIdAsync(id); 
        }

        public async Task<bool> UpdateExamUploadAsync(ExamUpload examUpload)
        {
            return await _examUploadRepository.UpdateExamUploadAsync(examUpload);
        }

    }
}

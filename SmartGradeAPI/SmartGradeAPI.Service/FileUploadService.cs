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
    public class FileUploadService : IFileUploadService
    {
        private readonly IFileUploadRepository _examUploadRepository;
        public FileUploadService(IFileUploadRepository examUploadRepository)
        {
            _examUploadRepository = examUploadRepository;
        }

        public async Task<bool> AddExamUploadAsync(FileUpload examUpload)
        {
            return await _examUploadRepository.AddFileUploadAsync(examUpload);
        }

        public async Task<bool> DeleteExamUploadAsync(int id)
        {
            return await _examUploadRepository.DeleteFileUploadAsync(id);
        }

        public async Task<List<FileUpload>> GetAllByIdAsync(int id)
        {
            return await _examUploadRepository.GetAllByIdAsync(id);
        }

        public async Task<FileUpload> GetExamUploadByIdAsync(int id)
        {
            return await _examUploadRepository.GetFileUploadByIdAsync(id); 
        }

        public async Task<bool> UpdateExamUploadAsync(FileUpload examUpload)
        {
            return await _examUploadRepository.UpdateFileUploadAsync(examUpload);
        }

    }
}

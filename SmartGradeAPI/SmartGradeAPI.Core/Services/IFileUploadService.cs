using SmartGradeAPI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Services
{
    public interface IFileUploadService
    {
        Task<FileUpload> GetExamUploadByIdAsync(int id);

        Task<List<FileUpload>> GetAllByIdAsync(int id);

        Task<bool> AddExamUploadAsync(FileUpload examUpload);

        Task<bool> UpdateExamUploadAsync(FileUpload examUpload);

        Task<bool> DeleteExamUploadAsync(int id);
    }
}

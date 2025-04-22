using SmartGradeAPI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Repositories
{
    public interface IExamUploadRepository
    {
        Task<ExamUpload> GetExamUploadByIdAsync(int id);

        Task<List<ExamUpload>> GetAllByIdAsync(int id);


        Task<bool> AddExamUploadAsync(ExamUpload examUpload);

        Task<bool> UpdateExamUploadAsync(ExamUpload examUpload);

        Task<bool> DeleteExamUploadAsync(int id);
    }
}

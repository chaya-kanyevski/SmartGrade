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
        Task<ExamUpload> GetExamUploadAsync(int id, int exam_id);

        Task<List<ExamUpload>> GetAllByIdAsync(int id);

        Task<bool> AddExamUploadAsync(ExamUpload examUpload);
    }
}

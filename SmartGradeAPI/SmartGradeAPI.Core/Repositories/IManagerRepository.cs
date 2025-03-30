using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Repositories
{
    public interface IManagerRepository
    {
        IUserRepository Users { get; }
        IExamRepository Exams { get; }

        //IStudentRepository Students { get; }
        IExamUploadRepository ExamUploads { get; }
        Task SaveAsync();
    }
}

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
        IUserFileRepository Exams { get; }
        IFileUploadRepository ExamUploads { get; }
        Task SaveAsync();
    }
}

using SmartGradeAPI.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Data.Repositories
{
    public class ManagerRepository : IManagerRepository
    {
        private readonly DataContext _context;
        public IUserRepository Users { get; }
        public IUserFileRepository Exams { get; }
        public IFileUploadRepository ExamUploads { get; }

        public ManagerRepository(DataContext context, IUserRepository users, IUserFileRepository exams, IFileUploadRepository examUploads)
        {
            _context = context;
            Users = users;
            Exams = exams;
            ExamUploads = examUploads;
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}

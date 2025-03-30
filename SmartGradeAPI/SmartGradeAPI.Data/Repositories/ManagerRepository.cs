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
        public IExamRepository Exams { get; }
        //public IStudentRepository Students { get; }
        public IExamUploadRepository ExamUploads { get; }

        public ManagerRepository(DataContext context, IUserRepository users, IExamRepository exams, IExamUploadRepository examUploads)
        {
            _context = context;
            Users = users;
            Exams = exams;
            //Students = students;
            ExamUploads = examUploads;
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}

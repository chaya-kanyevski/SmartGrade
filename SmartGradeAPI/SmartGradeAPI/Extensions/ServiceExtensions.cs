using SmartGradeAPI.Core.Repositories;
using SmartGradeAPI.Core.Services;
using SmartGradeAPI.Core;
using SmartGradeAPI.Data.Repositories;
using SmartGradeAPI.Data;
using SmartGradeAPI.Service;

namespace SmartGradeAPI.API.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureServices(this IServiceCollection services)
        {
            services.AddScoped<IManagerRepository, ManagerRepository>();

            services.AddScoped<IUserRepository, UserRepository>();
            //services.AddScoped<IStudentRepository, StudentRepository>();
            services.AddScoped<IExamUploadRepository, ExamUploadRepository>();
            services.AddScoped<IAnswerRepository, AnswerRepository>();
            services.AddScoped<IExamRepository, ExamRepository>();
            services.AddScoped<IAuthRepository, AuthRepository>();

            services.AddScoped<IUserService, UserService>();
            //services.AddScoped<IStudentService, StudentService>();
            services.AddScoped<IExamService, ExamService>();
            services.AddScoped<IAnswerService, AnswerService>();
            services.AddScoped<IExamUploadService, ExamUploadService>();
            services.AddScoped<IAuthService, AuthService>();



            services.AddAutoMapper(typeof(MappingProfile));
            services.AddDbContext<DataContext>();
            //        services.AddDbContext<DataContext>(options =>
            //options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        }

    }
}

using SmartGradeAPI.Core.Repositories;
using SmartGradeAPI.Core.Services;
using SmartGradeAPI.Core;
using SmartGradeAPI.Data.Repositories;
using SmartGradeAPI.Data;
using SmartGradeAPI.Service;
using Amazon.Runtime;
using Amazon.S3;
using Amazon;

namespace SmartGradeAPI.API.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureServices(this IServiceCollection services)
        {
            services.AddScoped<IManagerRepository, ManagerRepository>();

            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IFileUploadRepository, FileUploadRepository>();
            services.AddScoped<IUserFileRepository, FileRepository>();
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IChatRepository, ChatRepository>();


            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IFileService, FileService>();
            services.AddScoped<IFileUploadService, FileUploadService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IAiService, AiService>();
            //services.AddScoped<IOpenAiClient, OpenAiClient>();
            services.AddScoped<IAiActionRepository, AiActionRepository>();

            // זה פותר את הבעיה עם HttpClient
            services.AddHttpClient<IOpenAiClient, OpenAiClient>();
            services.AddScoped<IChatService, ChatService>();

            services.AddAutoMapper(typeof(MappingProfile));
            services.AddDbContext<DataContext>();
            //        services.AddDbContext<DataContext>(options =>
            //options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
            services.AddAutoMapper(typeof(MappingProfile));
            services.AddDbContext<DataContext>();
        }
    }
}
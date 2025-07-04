using Amazon;
using Amazon.S3;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using SmartGradeAPI.API.Extensions;
using SmartGradeAPI.API.Extentions;
using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.SignalR;
using SmartGradeAPI.Data;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;

var builder = WebApplication.CreateBuilder(args);

Env.TraversePath().Load();
if (FirebaseApp.DefaultInstance == null)
{
    GoogleCredential credential;

    var firebaseJson = Environment.GetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS_JSON");

    if (!string.IsNullOrEmpty(firebaseJson))
    {
        credential = GoogleCredential.FromJson(firebaseJson);
    }
    else
    {
        credential = GoogleCredential.FromFile("smartgrade-79f11-firebase-adminsdk-fbsvc-5b0d871db9.json");
    }

    FirebaseApp.Create(new AppOptions()
    {
        Credential = credential
    });
}

var accessKey = Env.GetString("AWS_ACCESS_KEY_ID");
var secretKey = Env.GetString("AWS_SECRET_ACCESS_KEY");
var bucketName = Env.GetString("AWS_BUCKET_NAME");
var region = Env.GetString("AWS_REGION");
var openAiKey = Env.GetString("OPENAI_API_KEY");
builder.Configuration["OpenAI:ApiKey"] = Env.GetString("OPENAI_API_KEY");


if (string.IsNullOrEmpty(accessKey) || string.IsNullOrEmpty(secretKey) || string.IsNullOrEmpty(region))
{
    throw new Exception("��� �������� AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY �� AWS_REGION �� ����!");
}
var s3Client = new AmazonS3Client(accessKey, secretKey, RegionEndpoint.GetBySystemName(region));

builder.Services.AddSingleton<IAmazonS3>(s3Client);

builder.Services.AddSingleton(new S3Settings
{
    BucketName = bucketName,
    Region = region
});

//var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "https://smartgradeonline.onrender.com")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials()
                  .SetIsOriginAllowed(_ => true);
        });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("SMARTGRADE_CONNECTION_STRING");

builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));


builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "SmartGrade API", Version = "v1" });

});

builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 10 * 1024 * 1024; 
});

builder.Services.ConfigureServices();

builder.Services.ConfigureJwt(builder.Configuration);
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("StudentOnly", policy => policy.RequireRole("Student"));
});

//var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
//builder.WebHost.UseUrls($"http://*:{port}");
builder.Services.AddSignalR();
var app = builder.Build();
//builder.Services.AddLogging();
app.MapHub<ChatHub>("/chatHub");
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "SmartGrade API v1"));
}

app.UseCors("AllowFrontend");

//app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGet("/", () => "SmartGrade API is running!");

app.Run();
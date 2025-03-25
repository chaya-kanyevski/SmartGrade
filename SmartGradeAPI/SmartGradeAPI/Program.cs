using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
using SmartGradeAPI.API.Extensions;
using SmartGradeAPI.API.Extentions;
using DotNetEnv;
using Amazon.S3;
using Amazon;
using System.Runtime;
using SmartGradeAPI.Core.Models;

var builder = WebApplication.CreateBuilder(args);

Env.TraversePath().Load();
// תוודאי שהקובץ קיים בתיקייה הראשית!
// טוען את משתני הסביבה
var accessKey = Env.GetString("AWS_ACCESS_KEY_ID");
var secretKey = Env.GetString("AWS_SECRET_ACCESS_KEY");
var bucketName = Env.GetString("AWS_BUCKET_NAME");
var region = Env.GetString("AWS_REGION");

// בדיקה שהערכים לא ריקים
Console.WriteLine($"AccessKey: {accessKey}");
Console.WriteLine($"SecretKey: {secretKey}");
Console.WriteLine($"BucketName: {bucketName}");
Console.WriteLine($"Region: {region}");

if (string.IsNullOrEmpty(accessKey) || string.IsNullOrEmpty(secretKey) || string.IsNullOrEmpty(region))
{
    throw new Exception("אחד מהמשתנים AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY או AWS_REGION לא נטען!");
}

// יצירת הלקוח של S3
var s3Client = new AmazonS3Client(accessKey, secretKey, RegionEndpoint.GetBySystemName(region));

// הוספת S3 ל-DI
builder.Services.AddSingleton<IAmazonS3>(s3Client);

// הוספת שם הבקט והאזור כמשתנים גלובליים
builder.Services.AddSingleton(new S3Settings
{
    BucketName = bucketName,
    Region = region
});

// הוספת CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAnyOrigin",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// הוספת Controllers
builder.Services.AddControllers();

// הוספת Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "SmartGrade API", Version = "v1" });
});

// הגדרת שירותים נוספים
builder.Services.ConfigureServices();

// הגדרת JWT
builder.Services.ConfigureJwt(builder.Configuration);
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// הגדרת מדיניות הרשאות
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("StudentOnly", policy => policy.RequireRole("Student"));
});

var app = builder.Build();
builder.Services.AddLogging();

// הגדרת Swagger במידה ויש סביבה לפיתוח
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "SmartGrade API v1"));
}

app.UseCors("AllowAnyOrigin");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// חיבור Controllers לאפליקציה
app.MapControllers();

app.Run();
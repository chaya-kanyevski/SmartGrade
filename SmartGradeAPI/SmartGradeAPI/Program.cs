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
// ������ ������ ���� ������� ������!
// ���� �� ����� ������
var accessKey = Env.GetString("AWS_ACCESS_KEY_ID");
var secretKey = Env.GetString("AWS_SECRET_ACCESS_KEY");
var bucketName = Env.GetString("AWS_BUCKET_NAME");
var region = Env.GetString("AWS_REGION");

// ����� ������� �� �����
Console.WriteLine($"AccessKey: {accessKey}");
Console.WriteLine($"SecretKey: {secretKey}");
Console.WriteLine($"BucketName: {bucketName}");
Console.WriteLine($"Region: {region}");

if (string.IsNullOrEmpty(accessKey) || string.IsNullOrEmpty(secretKey) || string.IsNullOrEmpty(region))
{
    throw new Exception("��� �������� AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY �� AWS_REGION �� ����!");
}

// ����� ����� �� S3
var s3Client = new AmazonS3Client(accessKey, secretKey, RegionEndpoint.GetBySystemName(region));

// ����� S3 �-DI
builder.Services.AddSingleton<IAmazonS3>(s3Client);

// ����� �� ���� ������ ������� ��������
builder.Services.AddSingleton(new S3Settings
{
    BucketName = bucketName,
    Region = region
});

// ����� CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAnyOrigin",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// ����� Controllers
builder.Services.AddControllers();

// ����� Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "SmartGrade API", Version = "v1" });
});

// ����� ������� ������
builder.Services.ConfigureServices();

// ����� JWT
builder.Services.ConfigureJwt(builder.Configuration);
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// ����� ������� ������
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("StudentOnly", policy => policy.RequireRole("Student"));
});

var app = builder.Build();
builder.Services.AddLogging();

// ����� Swagger ����� ��� ����� ������
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "SmartGrade API v1"));
}

app.UseCors("AllowAnyOrigin");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// ����� Controllers ���������
app.MapControllers();

app.Run();
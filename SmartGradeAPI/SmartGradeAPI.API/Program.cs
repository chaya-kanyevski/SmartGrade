using Amazon;
using Amazon.S3;
using AutoMapper;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using SmartGradeAPI.API.Extensions;
using SmartGradeAPI.API.Extentions;
using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Data;
using System;
using System.Runtime;

var builder = WebApplication.CreateBuilder(args);

Env.TraversePath().Load();

var accessKey = Env.GetString("AWS_ACCESS_KEY_ID");
var secretKey = Env.GetString("AWS_SECRET_ACCESS_KEY");
var bucketName = Env.GetString("AWS_BUCKET_NAME");
var region = Env.GetString("AWS_REGION");

if (string.IsNullOrEmpty(accessKey) || string.IsNullOrEmpty(secretKey) || string.IsNullOrEmpty(region))
{
    throw new Exception("אחד מהמשתנים AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY או AWS_REGION לא נטען!");
}
var s3Client = new AmazonS3Client(accessKey, secretKey, RegionEndpoint.GetBySystemName(region));

builder.Services.AddSingleton<IAmazonS3>(s3Client);

builder.Services.AddSingleton(new S3Settings
{
    BucketName = bucketName,
    Region = region
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAnyOrigin",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
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

var app = builder.Build();
builder.Services.AddLogging();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "SmartGrade API v1"));
}

app.UseCors("AllowAnyOrigin");

//app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGet("/", () => "SmartGrade API is running!");

app.Run();
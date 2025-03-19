using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SmartGradeAPI.API.Extensions;
using SmartGradeAPI.API.Extentions;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

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

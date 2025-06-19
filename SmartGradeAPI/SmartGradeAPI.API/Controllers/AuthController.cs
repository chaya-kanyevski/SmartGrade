using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGradeAPI.Core.DTOs;
using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.Services;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using SmartGradeAPI.API.Models;

namespace SmartGradeAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IMapper _mapper;

        public AuthController(IAuthService authService, IMapper mapper)
        {
            _authService = authService;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (await _authService.IsEmailExistAsync(model.Email))
                return BadRequest("האימייל כבר רשום במערכת.");

            if (string.IsNullOrWhiteSpace(model.Password) || model.Password.Length < 6)
                return BadRequest("הסיסמה חייבת להכיל לפחות 6 תווים.");

            User newUser = model.Role.ToLower() switch
            {
                "user" => new User { Name = model.Name, Email = model.Email, Password = model.Password, Role = "User" },
                "admin" => new Manager { Name = model.Name, Email = model.Email, Password = model.Password, Role = "Admin" },
                _ => throw new Exception("Invalid role")
            };

            await _authService.AddUserAsync(newUser);

            var token = _authService.GenerateJwtToken(newUser);
            return Ok(new { Token = token, User = new { newUser.Id, newUser.Name, newUser.Email, newUser.Role } });

            //return Ok(new { Token = token, User = new { newUser.Id, newUser.Name, newUser.Email, newUser.Password, newUser.Role } });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _authService.GetUserByEmailAsync(model.Email);

            if (user == null)
                return Unauthorized("האימייל או הסיסמה שגויים.");

            if (string.IsNullOrEmpty(user.Password))
                return Unauthorized("אנא התחבר באמצעות Google Sign-In.");
            if (!_authService.VerifyPassword(user, model.Password))
                return Unauthorized("האימייל או הסיסמה שגויים.");

            var token = _authService.GenerateJwtToken(user);
            var userDto = _mapper.Map<UserDto>(user);
            return Ok(new { Token = token, User = userDto }); 

        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            var firebaseToken = request.IdToken;

            // אמת את ה-IdToken מול Firebase
            var decoded = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(firebaseToken);
            var email = decoded.Claims["email"]?.ToString();
            var name = decoded.Claims["name"]?.ToString() ?? "";

            // חפש משתמש במסד
            var user = await _authService.GetUserByEmailAsync(email);

            if (user == null)
            {
                // צור משתמש חדש אם לא קיים
                user = new User { Name = name, Email = email, Role = "User", Password = null};
                await _authService.AddUserAsync(user);
            }

            var token = _authService.GenerateJwtToken(user);

            var userDto = _mapper.Map<UserDto>(user);
            return Ok(new { Token = token, User = userDto });
        }


    }
}
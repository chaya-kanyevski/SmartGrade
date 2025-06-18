using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGradeAPI.Core.DTOs;
using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.Services;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;

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
                return BadRequest("Email is already in use.");

            User newUser = model.Role.ToLower() switch
            {
                "user" => new User { Name = model.Name, Email = model.Email, Password = model.Password, Role = "User" },
                "admin" => new Manager { Name = model.Name, Email = model.Email, Password = model.Password, Role = "Admin" },
                _ => throw new Exception("Invalid role")
            };

            await _authService.AddUserAsync(newUser);

            var token = _authService.GenerateJwtToken(newUser);

            return Ok(new { Token = token, User = new { newUser.Id, newUser.Name, newUser.Email, newUser.Password, newUser.Role } });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _authService.GetUserByEmailAsync(model.Email);

            if (user == null)
                return Unauthorized("Invalid credentials");

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
                user = new User { Name = name, Email = email, Role = "User", Password = "Google"};
                await _authService.AddUserAsync(user);
            }

            var token = _authService.GenerateJwtToken(user);

            var userDto = _mapper.Map<UserDto>(user);
            return Ok(new { Token = token, User = userDto });
        }


    }

    public class RegisterModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }

    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}

public class GoogleLoginRequest
{
    public string IdToken { get; set; }
}

using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.Repositories;
using SmartGradeAPI.Core.Services;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Service
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly IAuthRepository _authRepository;
        private readonly IManagerRepository _managerRepository;

        public AuthService(IConfiguration configuration, IAuthRepository authRepository, IManagerRepository managerRepository)
        {
            _configuration = configuration;
            _authRepository = authRepository;
            _managerRepository = managerRepository;
        }

        public string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

            if (user is Student)
                claims.Add(new Claim(ClaimTypes.Role, "Student"));
            else if (user is Manager)
                claims.Add(new Claim(ClaimTypes.Role, "Admin"));

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<bool> IsEmailExistAsync(string email)
        {
            return await _authRepository.IsEmailExistAsync(email);
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _authRepository.GetUserByEmailAsync(email);
        }

        public async Task AddUserAsync(User user)
        {
            await _authRepository.AddUserAsync(user);
            await _managerRepository.SaveAsync();
        }
    }
}

using SmartGradeAPI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Services
{
    public interface IUserService
    {
        public Task<List<User>> GetAllUsersAsync();
        public Task<User> GetUserByIdAsync(string id);
        public Task<User> AddUserAsync(User user);
        public Task<bool> UpdateUserAsync(string id, User user);
        public Task<bool> DeleteUserAsync(string id);
    }
}

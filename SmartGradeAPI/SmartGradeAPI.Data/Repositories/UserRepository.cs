using Microsoft.EntityFrameworkCore;
using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        public UserRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }
        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FirstOrDefaultAsync(user => user.Id == id)
                ?? throw new Exception("User not found"); ;
        }
        public async Task<User> GetUserByMail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.Equals(email));
            return user;

        }
        public async Task<User> AddUserAsync(User user)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser != null)
            {
                return null; 
            }
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<bool> UpdateUserAsync(int id, User user)
        {
            var originUser = await GetUserByIdAsync(id);
            if (originUser != null)
            {
                originUser.Name = user.Name;
                originUser.Email = user.Email;
                originUser.Id = user.Id;
                originUser.Password = user.Password;
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(user => user.Id == id);
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            Console.WriteLine("deleted");
            return true;
        }

        public bool VerifyPassword(User user, string password)
        {
            return user.Password == password;
        }

    }
}

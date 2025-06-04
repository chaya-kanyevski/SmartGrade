using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Data.Repositories
{
    public class AiActionRepository : IAiActionRepository
    {
        private readonly DataContext _context;

        public AiActionRepository(DataContext context)
        {
            _context = context;
        }

        public async Task AddActionLogAsync(AiAction log)
        {
            _context.AiActions.Add(log);
            await _context.SaveChangesAsync();
        }

        public async Task<List<AiAction>> GetLogsByUserIdAsync(int userId)
        {
            return await _context.AiActions
                .Where(log => log.UserId == userId)
                .OrderByDescending(log => log.CreatedAt)
                .ToListAsync();
        }
    }

}

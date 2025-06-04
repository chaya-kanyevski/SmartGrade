using SmartGradeAPI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Repositories
{
    public interface IAiActionRepository
    {
        Task AddActionLogAsync(AiAction aiAction);
        Task<List<AiAction>> GetLogsByUserIdAsync(int userId);
    }

}

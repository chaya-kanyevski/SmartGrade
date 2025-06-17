using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Repositories
{
    public interface IChatRepository
    {
        Task<List<ChatTopic>> GetAllTopicsAsync();
        Task<ChatTopic?> GetTopicByIdAsync(int id);
        Task<ChatTopic> CreateTopicAsync(string title, int userId, string initialMessage);

        Task<List<ChatMessage>> GetMessagesForTopicAsync(int topicId);
        Task<ChatMessage> AddMessageAsync(int topicId, string text, int senderId);
    }
}
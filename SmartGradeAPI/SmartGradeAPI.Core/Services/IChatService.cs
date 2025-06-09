using SmartGradeAPI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Services
{
    public interface IChatService
    {
        Task<List<ChatTopic>> GetAllTopicsAsync();
        Task<ChatTopic?> GetTopicByIdAsync(int id);
        Task<ChatTopic> CreateTopicAsync(string title, int userId);

        Task<List<ChatMessage>> GetMessagesForTopicAsync(int topicId);
        Task<ChatMessage> AddMessageAsync(int topicId, string text, string senderId);
    }

}

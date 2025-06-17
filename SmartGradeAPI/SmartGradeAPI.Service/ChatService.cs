using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.Repositories;
using SmartGradeAPI.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Service
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _chatRepository;
        public ChatService(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
        }

        public async Task<ChatMessage> AddMessageAsync(int topicId, string text, int senderId)
        {
            return await _chatRepository.AddMessageAsync(topicId, text, senderId);
        }

        public Task<ChatTopic> CreateTopicAsync(string title, int userId, string initialMessage)
        {
            return _chatRepository.CreateTopicAsync(title, userId, initialMessage);
        }

        public Task<List<ChatTopic>> GetAllTopicsAsync()
        {
            return _chatRepository.GetAllTopicsAsync();
        }

        public Task<List<ChatMessage>> GetMessagesForTopicAsync(int topicId)
        {
            return _chatRepository.GetMessagesForTopicAsync(topicId);
        }

        public Task<ChatTopic?> GetTopicByIdAsync(int id)
        {
            return _chatRepository.GetTopicByIdAsync(id);
        }
    }
}

﻿using SmartGradeAPI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartGradeAPI.Core.Repositories;

namespace SmartGradeAPI.Data.Repositories
{
    public class ChatRepository : IChatRepository
    {
        private readonly DataContext _context;

        public ChatRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<List<ChatTopic>> GetAllTopicsAsync()
        {
            return await _context.ChatTopics
                .Include(t => t.CreatedBy)
                .Include(t => t.Messages)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }


        public async Task<ChatTopic?> GetTopicByIdAsync(int id)
        {
            return await _context.ChatTopics.FindAsync(id);
        }

        public async Task<ChatTopic> CreateTopicAsync(string title, int userId, string initialMessage)
        {
            var topic = new ChatTopic
            {
                Title = title,
                CreatedById = userId,
                CreatedAt = DateTime.UtcNow,
            };
            // אם יש הודעה התחלתית:
            if (!string.IsNullOrWhiteSpace(initialMessage))
            {
                topic.Messages.Add(new ChatMessage
                {
                    Text = initialMessage,
                    SenderId = userId,
                    SentAt = DateTime.UtcNow
                });
            }
            _context.ChatTopics.Add(topic);
            await _context.SaveChangesAsync();
            Console.WriteLine($"id:::::::::::::::: {topic.CreatedById}");
            return topic;
        }

        //public async Task<List<ChatMessage>> GetMessagesForTopicAsync(int topicId)
        //{
        //    return await _context.ChatMessages
        //        .Where(m => m.ChatTopicId == topicId)
        //        .OrderBy(m => m.SentAt)
        //        .ToListAsync();
        //}

        public async Task<List<ChatMessage>> GetMessagesForTopicAsync(int topicId)
        {
            return await _context.ChatMessages
                .Where(m => m.ChatTopicId == topicId)
                .Include(m => m.Sender)
                .OrderBy(m => m.SentAt)
                .ToListAsync();
        }



        public async Task<ChatMessage> AddMessageAsync(int topicId, string text, int senderId)
        {
            var message = new ChatMessage
            {
                ChatTopicId = topicId,
                Text = text,
                SenderId = senderId,
                SentAt = DateTime.UtcNow
            };

            _context.ChatMessages.Add(message);
            await _context.SaveChangesAsync();
            return message;
        }



    }
}
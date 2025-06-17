using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SmartGradeAPI.Core.DTOs;
using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.Services;
using SmartGradeAPI.Core.SignalR;

namespace SmartGradeAPI.API.Controllers
{
    [Route("api/chat")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        private readonly IHubContext<ChatHub> _hubContext;


        public ChatController(IChatService chatService, IHubContext<ChatHub> hubContext)
        {
            _chatService = chatService;
            _hubContext = hubContext;
        }

        [HttpGet("topics")]
        public async Task<IActionResult> GetTopics()
        {
            var topics = await _chatService.GetAllTopicsAsync();

            var dtos = topics.Select(t => new ChatTopicDto
            {
                Id = t.Id,
                Title = t.Title,
                CreatedAt = t.CreatedAt,
                AuthorId = t.CreatedBy?.Id ?? 0,
                AuthorName = t.CreatedBy?.Name ?? "לא ידוע",
                AuthorInitials = string.IsNullOrEmpty(t.CreatedBy?.Name) ? "?" : t.CreatedBy.Name.Substring(0, 1).ToUpper(),
                LastMessage = t.Messages.OrderByDescending(m => m.SentAt).FirstOrDefault()?.Text,
                MessageCount = t.Messages.Count
            }).ToList();

            return Ok(dtos);
        }


        [HttpPost("topics")]
        public async Task<IActionResult> CreateTopic([FromBody] CreateTopicDto dto)
        {
            Console.WriteLine($"Title: {dto.Title}, UserId: {dto.UserId}");

            var created = await _chatService.CreateTopicAsync(dto.Title, dto.UserId, dto.InitialMessage);
            var topicDto = new
            {
                Id = created.Id,
                Title = created.Title,
                CreatedAt = created.CreatedAt,
                AuthorId = created.CreatedBy?.Id ?? 0,
                AuthorName = created.CreatedBy?.Name,
                AuthorInitials = created.CreatedBy?.Name?.Substring(0, 1).ToUpper(),
                LastMessage = created.Messages?.FirstOrDefault()?.Text,
                MessageCount = created.Messages?.Count ?? 0
            };
            return CreatedAtAction(nameof(GetTopics), new { id = created.Id }, topicDto);
        }


        [HttpPost("messages")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageDto dto)
        {
            var message = await _chatService.AddMessageAsync(dto.TopicId, dto.Text, dto.UserId);

            var messageDto = new
            {
                Id = message.Id,
                Text = message.Text,
                SenderId = message.SenderId,
                SentAt = message.SentAt
            };

            await _hubContext.Clients.All.SendAsync("ReceiveMessage", dto.TopicId.ToString(), messageDto);

            return Ok(messageDto);
        }


        [HttpGet("messages")]
        public async Task<IActionResult> GetMessages([FromQuery] int topicId)
        {
            var messages = await _chatService.GetMessagesForTopicAsync(topicId);

            var dtos = messages.Select(m => new ChatMessageDto
            {
                Id = m.Id,
                Text = m.Text,
                SentAt = m.SentAt,
                SenderId = m.SenderId,
                SenderName = m.Sender?.Name ?? "?"
            }).ToList();

            return Ok(dtos);
        }

    }
}
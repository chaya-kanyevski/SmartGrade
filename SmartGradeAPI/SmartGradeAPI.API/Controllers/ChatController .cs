using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.Services;

namespace SmartGradeAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpGet("topics")]
        public async Task<IActionResult> GetTopics()
        {
            var topics = await _chatService.GetAllTopicsAsync();
            return Ok(topics);
        }

        [HttpPost("topics")]
        public async Task<IActionResult> CreateTopic([FromBody] ChatTopic topic, int userId)
        {
            var created = await _chatService.CreateTopicAsync(topic.Title, userId);
            return CreatedAtAction(nameof(GetTopics), new { id = created.Id }, created);
        }

        [HttpGet("messages")]
        public async Task<IActionResult> GetMessages([FromQuery] int topicId)
        {
            var messages = await _chatService.GetMessagesForTopicAsync(topicId);
            return Ok(messages);
        }
    }
}

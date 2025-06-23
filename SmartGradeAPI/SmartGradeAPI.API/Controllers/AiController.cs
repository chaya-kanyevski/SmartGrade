using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartGradeAPI.Core.Repositories;
using SmartGradeAPI.Core.Requests;
using SmartGradeAPI.Core.Services;
using SmartGradeAPI.Data.Repositories;

namespace SmartGradeAPI.API.Controllers
{
    [Authorize]
    [Route("api/ai")]
    [ApiController]
    public class AiController : ControllerBase
    {
        private readonly IAiService _aiService;

        public AiController(IAiService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("lesson-plan")]
        public async Task<IActionResult> GenerateLessonPlan([FromBody] AIRequests request)
        {
            var result = await _aiService.GenerateLessonPlanAsync(
                request.UserId, request.Topic, request.Grade, request.Duration, request.Components);

            return Ok(result);
        }

        [HttpPost("generate-questions")]
        public async Task<IActionResult> GenerateQuestions([FromBody] QuestionRequest request)
        {
            var result = await _aiService.GenerateQuestionsAsync(
                request.UserId, request.Topic, request.QuestionType, request.Difficulty,
                request.NumQuestions, request.TextOrFileName);

            return Ok(result);
        }

        [HttpPost("summarize")]
        public async Task<IActionResult> SummarizeText([FromBody] SummarizeRequest request)
        {
            var result = await _aiService.SummarizeTextAsync(
                request.UserId, request.TextOrFileName, request.SummaryLength, request.SummaryStyle);

            return Ok(result);
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> AnalyzeText([FromBody] AnalyzeRequest request)
        {
            var result = await _aiService.AnalyzeTextAsync(
                request.UserId, request.TextOrFileName, request.AnalysisType);

            return Ok(result);
        }

        [HttpPost("teaching-tips")]
        public async Task<IActionResult> GetTeachingTips([FromBody] TeachingTipsRequest request)
        {
            var result = await _aiService.GetTeachingTipsAsync(request.UserId);
            return Ok(result);
        }

    }

}



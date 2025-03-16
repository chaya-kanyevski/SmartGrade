using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SmartGradeAPI.Core.DTOs;
using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SmartGradeAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly IQuestionService _questionService;
        private readonly IMapper _mapper;
        public QuestionsController(IQuestionService questionService, IMapper mapper)
        {
            _questionService = questionService;
            _mapper = mapper;
        }
        // GET: api/<QuestionController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<QuestionController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<QuestionDto>> Get(int id, int examId)
        {
            var question = await _questionService.GetQuestionByIdAsync(id, examId);
            return Ok(_mapper.Map<QuestionDto>(question));
        }

        // POST api/<QuestionController>
        [HttpPost]
        public async Task<ActionResult<bool>> Post([FromBody] QuestionDto questionDto)
        {
            var newQuestion = _mapper.Map<Question>(questionDto);
            return await _questionService.AddQuestionAsync(newQuestion);
        }

        // PUT api/<QuestionController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<QuestionController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}

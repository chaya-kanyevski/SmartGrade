using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SmartGradeAPI.Core.DTOs;
using SmartGradeAPI.Core.Services;
using SmartGradeAPI.Service;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SmartGradeAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnswersController : ControllerBase
    {
        private readonly IAnswerService _answerService;
        private readonly IMapper _mapper;
        public AnswersController(IAnswerService answerService, IMapper mapper)
        {
            _answerService = answerService;
            _mapper = mapper;
        }

        //[HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        // GET api/<AnswerController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AnswerDto>> Get(int id, int examId)
        {
            var answer = await _answerService.GetAnswerByIdAsync(id, examId);
            return Ok(_mapper.Map<AnswerDto>(answer));
        }

        // POST api/<AnswerController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<AnswerController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<AnswerController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}

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
    public class ExamsController : ControllerBase
    {
        private readonly IExamService _examService;
        private readonly IMapper _mapper;
        public ExamsController(IExamService examService, IMapper mapper)
        {
            _examService = examService;
            _mapper = mapper;
        }
        // GET: api/<ExamController>
        //[HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        // GET api/<ExamController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ExamDto>> Get(int id)
        {
            var exam = await _examService.GetByIdAsync(id);
            return Ok(_mapper.Map<ExamDto>(exam));
        }

        // POST api/<ExamController>
        [HttpPost]
        public async Task<ActionResult<bool>> Post([FromBody] ExamDto examDto)
        {
            var exam = _mapper.Map<Exam>(examDto);
            return Ok(await _examService.AddExamAsync(exam));
        }

        // PUT api/<ExamController>/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        // DELETE api/<ExamController>/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}

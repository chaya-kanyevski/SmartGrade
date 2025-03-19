using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SmartGradeAPI.Core.DTOs;
using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.Services;
//!!
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

        [HttpGet("{id}")]
        public async Task<ActionResult<ExamDto>> Get(int id)
        {
            var exam = await _examService.GetByIdAsync(id);
            return Ok(_mapper.Map<ExamDto>(exam));
        }

        [HttpPost]
        public async Task<ActionResult<bool>> Post([FromBody] ExamDto examDto)
        {
            var exam = _mapper.Map<Exam>(examDto);
            return Ok(await _examService.AddExamAsync(exam));
        }

    }
}

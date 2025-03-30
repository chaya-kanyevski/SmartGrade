using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SmartGradeAPI.Core.DTOs;
using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.Services;

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

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<ExamDto>>> GetExamsByUserId(int userId)
        {
            var exams = await _examService.GetExamsByUserIdAsync(userId);
            if (exams == null || exams.Count == 0)
            {
                return NotFound("No exams found for this user");
            }
            return Ok(_mapper.Map<List<ExamDto>>(exams));
        }

        [HttpPost]
        public async Task<ActionResult<bool>> Post([FromBody] ExamDto examDto)
        {
            var exam = _mapper.Map<Exam>(examDto);
            return Ok(await _examService.AddExamAsync(exam));
        }

    }
}
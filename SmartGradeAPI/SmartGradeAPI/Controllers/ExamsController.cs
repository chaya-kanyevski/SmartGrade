using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SmartGradeAPI.API.Models;
using SmartGradeAPI.Core.DTOs;
using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.Services;
using SmartGradeAPI.Service;

namespace SmartGradeAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamsController : ControllerBase
    {
        private readonly IExamService _examService;
        private readonly IExamUploadService _examUploadService;
        private readonly IMapper _mapper;
        public ExamsController(IExamService examService, IExamUploadService examUploadService, IMapper mapper)
        {
            _examService = examService;
            _examUploadService = examUploadService;
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
        public async Task<ActionResult<ExamDto>> Post([FromBody] ExamPost examPost)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdExam = _mapper.Map<Exam>(examPost);
            await _examService.AddExamAsync(createdExam); // שמור את המבחן שנוצר

            if (createdExam == null || createdExam.Id == 0)
            {
                return StatusCode(500, "Failed to create exam.");
            }

            var examDto = _mapper.Map<ExamDto>(createdExam);

            // החזרת CreatedAtAction עם ה-ID של המשאב החדש
            return CreatedAtAction(nameof(Get), new { id = createdExam.Id }, _mapper.Map<ExamDto>(createdExam));
        }

        [HttpGet("{examId}/uploads")]
        public async Task<ActionResult<List<ExamUploadDto>>> GetExamUploadsByExamId(int examId)
        {
            Console.WriteLine($"Received request for examId: {examId}");
            var uploads = await _examUploadService.GetAllByIdAsync(examId);
            if (uploads == null || uploads.Count == 0)
            {
                return NotFound("No uploads found for this exam");
            }
            return Ok(_mapper.Map<List<ExamUploadDto>>(uploads));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<bool>> UpdateExam(int id, [FromBody] ExamDto examUpdate)
        {
            var exam = _mapper.Map<Exam>(examUpdate);
            exam.Id = id; // וודא שהמזהה מוגדר
            return Ok(await _examService.UpdateExamAsync(exam));
        }

        // ExamsController.cs
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            try
            {
                var result = await _examService.DeleteExamAsync(id);
                if (!result)
                {
                    return NotFound($"Exam with id {id} not found.");
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
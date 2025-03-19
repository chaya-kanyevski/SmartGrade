using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGradeAPI.Core.DTOs;
using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.Services;
using SmartGradeAPI.Service;
using System.Data;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AnswerDto>>> Get(int examId)
        {
            try
            {
                var list = await _answerService.GetAllAnswersAsync(examId);
                if (list == null || !list.Any())
                {
                    return BadRequest("No answers found for the specified exam.");
                }
                return Ok(_mapper.Map<IEnumerable<AnswerDto>>(list));
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching answers: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AnswerDto>> Get(int id, int examId)
        {
            try
            {
                var answer = await _answerService.GetAnswerByIdAsync(id, examId);
                if (answer == null)
                {
                    return NotFound($"Answer with ID {id} not found for the specified exam.");
                }
                return Ok(_mapper.Map<AnswerDto>(answer));
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching the answer: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] AnswerDto answerDto)
        {
            try
            {
                if (answerDto == null)
                {
                    return BadRequest("Answer data is required.");
                }

                await _answerService.AddAnswerAsync(_mapper.Map<Answer>(answerDto));
                return Ok("Answer added successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while adding the answer: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id, int examId)
        {
            try
            {
                var answer = await _answerService.GetAnswerByIdAsync(id, examId); 
                if (answer == null)
                {
                    return NotFound($"Answer with ID {id} not found.");
                }                
                await _answerService.DeleteAnswerAsync(id);
                return Ok("Answer deleted successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while deleting the answer: {ex.Message}");
            }
        }

    }
}

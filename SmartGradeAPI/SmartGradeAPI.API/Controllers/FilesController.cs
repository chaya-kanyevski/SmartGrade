using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SmartGradeAPI.Core.DTOs;
using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.Services;
using SmartGradeAPI.Service;

namespace SmartGradeAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly IFileService _fileService;
        private readonly IFileUploadService _fileUploadService;
        private readonly IMapper _mapper;
        public FilesController(IFileService fileService, IFileUploadService fileUploadService, IMapper mapper)
        {
            _fileService = fileService;
            _fileUploadService = fileUploadService;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserFileDto>> Get(int id)
        {
            var file = await _fileService.GetByIdAsync(id);
            return Ok(_mapper.Map<UserFileDto>(file));
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<UserFileDto>>> GetFilesByUserId(int userId)
        {
            var files = await _fileService.GetFilesByUserIdAsync(userId);
            if (files == null || files.Count == 0)
            {
                return NotFound("No files found for this user");
            }
            return Ok(_mapper.Map<List<UserFileDto>>(files));
        }

        [HttpPost]
        public async Task<ActionResult<UserFileDto>> Post([FromBody] UserFilePost filePost)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdFile = _mapper.Map<UserFile>(filePost);
            await _fileService.AddFileAsync(createdFile); 

            if (createdFile == null || createdFile.Id == 0)
            {
                return StatusCode(500, "Failed to create file.");
            }

            var fileDto = _mapper.Map<UserFileDto>(createdFile);

            return CreatedAtAction(nameof(Get), new { id = createdFile.Id }, _mapper.Map<UserFileDto>(createdFile));
        }

        //[HttpGet("{examId}/uploads")]
        //public async Task<ActionResult<List<FileUploadDto>>> GetExamUploadsByExamId(int fileId)
        //{
        //    Console.WriteLine($"Received request for examId: {fileId}");
        //    var uploads = await _fileUploadService.GetAllByIdAsync(fileId);
        //    if (uploads == null || uploads.Count == 0)
        //    {
        //        return NotFound("No uploads found for this exam");
        //    }
        //    return Ok(_mapper.Map<List<FileUploadDto>>(uploads));
        //}

        [HttpPut("{id}")]
        public async Task<ActionResult<bool>> UpdateFile(int id, [FromBody] UserFileDto fileUpdate)
        {
            var file = _mapper.Map<UserFile>(fileUpdate);
            file.Id = id; 
            return Ok(await _fileService.UpdateFileAsync(file));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            try
            {
                var result = await _fileService.DeleteFileAsync(id);
                if (!result)
                {
                    return NotFound($"File with id {id} not found.");
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
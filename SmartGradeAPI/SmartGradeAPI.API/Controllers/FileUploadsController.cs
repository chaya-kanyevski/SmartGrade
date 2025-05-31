using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGradeAPI.Core.DTOs;
using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.Services;
using static System.Net.Mime.MediaTypeNames;


namespace SmartGradeAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin")]
    public class FileUploadController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly IFileService _fileService;
        private readonly IFileUploadService _fileUploadService;

        public FileUploadController(IAmazonS3 s3Client, IConfiguration configuration, IFileService fileService, IFileUploadService fileUploadService)
        {
            _s3Client = s3Client;
            _bucketName = Environment.GetEnvironmentVariable("AWS_BUCKET_NAME");
            _fileService = fileService;
            _fileUploadService = fileUploadService;
            //_bucketName = configuration["AWS:BucketName"];
        }

        [HttpGet("presigned-url")]
        public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
                return BadRequest("שם הקובץ נדרש");

            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(20),
            };
            try
            {
                Console.WriteLine(fileName);
                string url = _s3Client.GetPreSignedURL(request);
                return Ok(new { url });
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode(500, $"Error generating presigned URL: {ex.Message}");
            }
        }

        [HttpPost("upload-url")]
        public async Task<IActionResult> UploadFileUrl([FromBody] FileUploadDto request)
        {
            if (string.IsNullOrEmpty(request.FilePath))
                return BadRequest("ה-URL לא תקין");

            var file = await _fileService.GetByIdAsync(request.FileId);
            if (file == null)
                return NotFound("הקובץ לא נמצא");

            var existingUploads = await _fileUploadService.GetAllByIdAsync(request.FileId) ?? new List<FileUpload>();
            int submissionNumber = existingUploads.Count + 1;
            var newFileUpload = new FileUpload
            {
                FileId = request.FileId,
                StudentName = request.StudentName,
                FilePath = request.FilePath,
                UploadDate = DateTime.UtcNow,
                Score = 0,
                SubmissionNumber = submissionNumber
            };

            await _fileUploadService.AddExamUploadAsync(newFileUpload);
            await _fileService.UpdateFileAsync(file);
            return Ok(new { Message = "ה-URL נוספה בהצלחה לקובץ", SubmissionNumber = submissionNumber });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExamUpload(int id)
        {
            var result = await _fileUploadService.DeleteExamUploadAsync(id);
            if (result)
            {
                return Ok(new { Message = $"ההעלאה עם מזהה {id} נמחקה בהצלחה." });
            }
            else
            {
                return NotFound($"לא נמצאה העלאה עם מזהה {id}.");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFileUpload(int id, [FromBody] FileUploadDto request)
        {
            if (id != request.FileId)
            {
                return BadRequest("מזהה ההעלאה בנתיב אינו תואם למזהה בגוף הבקשה.");
            }

            var existingUpload = await _fileUploadService.GetExamUploadByIdAsync(id);
            if (existingUpload == null)
            {
                return NotFound($"לא נמצאה העלאה עם מזהה {id}.");
            }

            existingUpload.StudentName = request.StudentName;
            existingUpload.FilePath = request.FilePath;

            await _fileUploadService.UpdateExamUploadAsync(existingUpload);

            return Ok(new { Message = $"ההעלאה עם מזהה {id} עודכנה בהצלחה." });
        }
    }
}
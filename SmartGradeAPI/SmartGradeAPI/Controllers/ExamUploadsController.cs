using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Service;
using static System.Net.Mime.MediaTypeNames;


namespace SmartGradeAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin")]
    public class ExamUploadController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly ExamService _examService;
        private readonly ExamUploadService _examUploadService;

        public ExamUploadController(IAmazonS3 s3Client, IConfiguration configuration, ExamService examService, ExamUploadService examUploadService)
        {
            _s3Client = s3Client;
            _bucketName = Environment.GetEnvironmentVariable("AWS_BUCKET_NAME");
            _examService = examService;
            _examUploadService = examUploadService;
            Console.WriteLine(_bucketName);
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
                Key = fileName, // קבצים נשמרים בתיקיית exams
                //Key = $"{fileName}", // קבצים נשמרים בתיקיית exams
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(20),
                //ContentType = "application/pdf" // ניתן לשנות לסוג קובץ אחר
                //ContentType = "multipart/form-data"
            };
            //request.Headers["x-amz-acl"] = "bucket-owner-full-control";

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

        [HttpPost("upload")]
        public async Task<IActionResult> UploadStudentExam([FromQuery] int examId, [FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("לא נבחר קובץ");

            var exam = await _examService.GetByIdAsync(examId);
            if (exam == null)
                return NotFound("המבחן לא נמצא");

            // חישוב מספר הגשה אוטומטי
            var existingUploads = await _examUploadService.GetAllByIdAsync(examId) ?? new List<ExamUpload>();
            int submissionNumber = existingUploads.Count + 1;

            // טיפול בשם הקובץ למניעת בעיות
            var safeFileName = Path.GetFileNameWithoutExtension(file.FileName)
                                   .Replace(" ", "_")
                                   .Replace(".", "_")
                                   .Replace("/", "_")
                                   .Replace("\\", "_");
            var fileName = $"{Guid.NewGuid()}_{safeFileName}{Path.GetExtension(file.FileName)}";

            var request = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                InputStream = file.OpenReadStream(),
                ContentType = file.ContentType
            };

            await _s3Client.PutObjectAsync(request);
            var fileUrl = $"https://{_bucketName}.s3.amazonaws.com/{fileName}";

            // יצירת מבחן חדש עם מספר רץ
            var upload = new ExamUpload
            {
                ExamId = examId,
                SubmissionNumber = submissionNumber, // מספר אוטומטי
                FilePath = fileUrl,
                UploadDate = DateTime.UtcNow,
                Score = 0
            };

            await _examUploadService.AddExamUploadAsync(upload);

            return Ok(new { Message = "המבחן הועלה בהצלחה", SubmissionNumber = submissionNumber, FileUrl = fileUrl });
        }

    }
}
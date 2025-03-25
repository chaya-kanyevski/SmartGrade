using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        public ExamUploadController(IAmazonS3 s3Client, IConfiguration configuration)
        {
            _s3Client = s3Client;
            _bucketName = Environment.GetEnvironmentVariable("AWS_S3_BUCKET_NAME");
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
                Key = $"exams/{fileName}", // קבצים נשמרים בתיקיית exams
                //Key = $"{fileName}", // קבצים נשמרים בתיקיית exams
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(20),
                //ContentType = "application/pdf" // ניתן לשנות לסוג קובץ אחר
                ContentType = "application/pdf"
            };
            request.Headers["x-amz-acl"] = "bucket-owner-full-control";

            try
            {
                string url = _s3Client.GetPreSignedURL(request);
                return Ok(new { url });
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode(500, $"Error generating presigned URL: {ex.Message}");
            }
        }
    }
}
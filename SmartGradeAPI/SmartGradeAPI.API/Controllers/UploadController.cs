using Microsoft.AspNetCore.Mvc;
using Amazon.S3;
using Amazon.S3.Model;
using System;
using System.Threading.Tasks;
using System.Runtime;
using SmartGradeAPI.Core.Models;

namespace SmartGradeAPI.API.Controllers
{
    [ApiController]
    [Route("api/upload")]
    public class UploadController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public UploadController(IAmazonS3 s3Client, S3Settings s3Settings)
        {
            _s3Client = s3Client;
            _bucketName = s3Settings.BucketName;
        }

        [HttpGet("presigned-url")]
        public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName, [FromQuery] string contentType)
        {
            if (string.IsNullOrEmpty(fileName))
            {
                return BadRequest("שם הקובץ חסר");
            }

            if (string.IsNullOrEmpty(contentType))
            {
                return BadRequest("סוג הקובץ חסר");
            }

            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(30),
                ContentType = contentType 
            };

            string url = _s3Client.GetPreSignedURL(request);
            return Ok(new { url });

        }
    }
}
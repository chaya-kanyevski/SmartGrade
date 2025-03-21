﻿using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SmartGradeAPI.Core.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SmartGradeAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamUploadsController : ControllerBase
    {
        private readonly IExamUploadService _examUploadService;
        private readonly IMapper _mapper;
        public ExamUploadsController(IExamUploadService examUploadService, IMapper mapper)
        {
            _examUploadService = examUploadService;
            _mapper = mapper;
        }
        // GET: api/<ExamUploadController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<ExamUploadController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<ExamUploadController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<ExamUploadController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ExamUploadController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}

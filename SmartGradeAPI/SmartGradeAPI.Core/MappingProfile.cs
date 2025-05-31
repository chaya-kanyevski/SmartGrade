using AutoMapper;
using SmartGradeAPI.Core.DTOs;
using SmartGradeAPI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<UserFile, UserFileDto>().ReverseMap();
            CreateMap<UserFile, UserFilePost>().ReverseMap();
            CreateMap<FileUpload, FileUploadDto>().ReverseMap();
            CreateMap<Report, ReportDto>().ReverseMap();
        }
    }
}

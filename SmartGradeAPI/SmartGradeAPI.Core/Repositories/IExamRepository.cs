﻿using SmartGradeAPI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Repositories
{
    public interface IExamRepository
    {
        Task<Exam> GetByIdAsync(int id);
        Task<bool> AddExamAsync(Exam newexam);
    }
}

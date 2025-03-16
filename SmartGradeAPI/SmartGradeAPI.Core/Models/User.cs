﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Models
{
    public class User
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;
        public string Role { get; set; } = "User";
        public User()
        {

        }

        public User(string id, string name, string email, string password)
        {
            Id = id;
            Name = name;
            Email = email;
            Password = password;
        }
        public User(string id, string name, string email, string password, string role)
        {
            Id = id;
            Name = name;
            Email = email;
            Password = password;
            Role = role;
        }
    }
}

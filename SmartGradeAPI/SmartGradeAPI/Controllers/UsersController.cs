using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartGradeAPI.Core.DTOs;
using SmartGradeAPI.Core.Models;
using SmartGradeAPI.Core.Services;
using SmartGradeAPI.Service;
using System.Data;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SmartGradeAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UsersController(IUserService userService, IMapper mapper)
        {
            _userService = userService; 
            _mapper = mapper;
        }

        // get all users
        [HttpGet]
        public async Task<ActionResult<UserDto>> Get()
        {
            var usersList = await _userService.GetAllUsersAsync();
            return Ok(_mapper.Map<List<UserDto>>(usersList));
        }

        // Get user data by Id
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound("No user with id " + id);
            }
            return Ok(_mapper.Map<UserDto>(user));
        }

        // Add new user
        [HttpPost("register")]
        public async Task<ActionResult<bool>> Post(UserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);
            try
            {
                var result = await _userService.AddUserAsync(user);
                if (result != null) 
                {
                    return Ok(true); 
                }
                return Conflict("User already exists.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        // Update user
        [HttpPut("{id}")]
        public async Task<ActionResult<bool>> Put(int id, UserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);
            var result = await _userService.UpdateUserAsync(id, user);
            if (!result)
            {
                return NotFound("User not found.");
            }
            return Ok(result);
        }

        // Delete user
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            var result = await _userService.DeleteUserAsync(id);
            if (!result)
            {
                return BadRequest(true);
            }
            return Ok(true);
        }
    }
}
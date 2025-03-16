using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        public UsersController(IUserService userService)
        {
            _userService = userService; 
        }

        // get all users
        [HttpGet]
        public async Task<ActionResult<User>> GetAllUsersAsync()
        {
            var userList = await _userService.GetAllUsersAsync();
            return Ok(userList);
        }

        // Get user data by Id
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserByIdAsync(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound("No user with id " + id);
            }
            return Ok(user);
        }

        // Add new user
        [HttpPost("register")]
        public async Task<ActionResult<string>> PostAsync()
        {

            return BadRequest(false);

        }




        // Update user
        [HttpPut("{id}")]
        public async Task<ActionResult<bool>> PutAsync(string id)
        {

            return BadRequest(false);

        }

        // Delete user
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteUserAsync(string id)
        {
            if (await _userService.DeleteUserAsync(id))
            {
                return Ok(true);
            }
            return BadRequest(true);

        }
    }
}

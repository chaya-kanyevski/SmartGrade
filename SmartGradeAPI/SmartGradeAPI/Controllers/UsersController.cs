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
        public async Task<ActionResult<string>> PostAsync([FromBody] UserPost user)
        {
            var tmpuser = await _userService.AddUserAsync(user);
            if (tmpuser != null)
            {
                var token = _userService.GenerateJwtToken(user.Email, "User");
                return Ok(new { Token = token, userId = tmpuser.Id });
            }

            return BadRequest(false);

        }

        //Login to a logged-in user
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userService.GetUserByMail(model.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
                return Unauthorized();


            var token = _userService.GenerateJwtToken(user.Email, user.Role);
            return Ok(new { Token = token, userId = user.Id });
        }


        // Update user
        [HttpPut("{id}")]
        public async Task<ActionResult<bool>> PutAsync(string id, [FromBody] UserPost user)
        {
            if (await _userService.UpdateUserAsync(id, user))
            {
                return Ok(true);
            }
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

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebApplicationTemplate.Server.Data;
using WebApplicationTemplate.Server.Dtos;
using WebApplicationTemplate.Server.Entities;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;


namespace WebApplicationTemplate.Server.Controllers;

[ApiController]
[Route("/api/auth")]
public class AuthenticationController : Controller
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;

    public AuthenticationController(UserManager<User> userManager, SignInManager<User> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    [Authorize]
    [HttpGet("/me")]
    public async Task<ActionResult> GetCurrentUser()
    {
        string identifier = HttpContext.User.Identity?.Name ?? string.Empty;

        User? user = await _userManager.FindByNameAsync(identifier);

        if (user == null)
        {
            return NotFound();
        }

        UserDto dto = new()
        {
            Id = user.Id,
            Username = user.UserName!,
            Firstname = user.Firstname,
            Lastname = user.Lastname,
            Email = user.Email!
        };
        
        return Ok(dto);
    }

    [HttpPost("/login")]
    public async Task<ActionResult> Login(LoginDto loginDto)
    {
        User? user = await _userManager.FindByNameAsync(loginDto.Username);
        if (user == null)
        {
            return NotFound("Username or Password was incorrect.");
        }

        SignInResult result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, true, false);
        
        if (result.Succeeded)
        {
            UserDto userDto = new()
            {
                Id = user.Id,
                Username = user.UserName!,
                Firstname = user.Firstname,
                Lastname = user.Lastname,
                Email = user.Email!
            };
            return Ok(userDto);
        }

        return BadRequest();
    }

    [HttpPost]
    public async Task<ActionResult> Create(CreateUserDto createUserDto)
    {
        User user = new()
        {
            Firstname = createUserDto.Password,
            UserName = createUserDto.Username,
            Lastname = createUserDto.Lastname,
            Email = createUserDto.Email
        };
        IdentityResult result = await _userManager.CreateAsync(user);

        if (!result.Succeeded)
        {
            return BadRequest("An error occured trying to create a user");
        }

        User? findUser = await _userManager.FindByEmailAsync(user.Email);
        if (findUser != null)
        {
            await _userManager.AddPasswordAsync(findUser, createUserDto.Password);

            UserDto userDto = new()
            {
                Id = user.Id,
                Username = user.UserName!,
                Firstname = user.Firstname,
                Lastname = user.Lastname,
                Email = user.Email!
            };

            return Created("", userDto);
        }
        return BadRequest("An error occured trying to create a user");
    }
}
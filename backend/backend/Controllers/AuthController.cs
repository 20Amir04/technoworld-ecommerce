using E_commerce_backend.Data;
using backend.Auth;
using E_commerce_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly PasswordHasher<User> _hasher = new();

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest req)
        {
            var email = (req.Email ?? "").Trim().ToLower();
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(req.Password))
                return BadRequest("Email and password are required");

            var exists = await _context.Users.AnyAsync(u => u.Email.ToLower() == email);
            if (exists) return Conflict("Email is already in use");

            var user = new User
            {
                Name = req.Name.Trim(),
                Email = email,
                CreatedAt = DateTime.UtcNow,
                Password = ""

            };

            user.Password = _hasher.HashPassword(user, req.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            IssueAuthCookie(user);

            return Ok(new AuthResponse {Id = user.Id, Name = user.Name, Email = user.Email });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest req)
        {
            var email = (req.Email ?? "").Trim().ToLower();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email);
            if (user == null) return Unauthorized("Invalid email or password");

            var ok = _hasher.VerifyHashedPassword(user, user.Password, req.Password);
            if (ok == PasswordVerificationResult.Failed) return Unauthorized("Invalid email or password");

            IssueAuthCookie(user);

            return Ok(new AuthResponse {Id = user.Id, Name = user.Name, Email = user.Email });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<AuthResponse>> Me()
        {
            var userId = GetUserIdOrNull();
            if (userId == null) return Unauthorized();

            var user = await _context.Users.FindAsync(userId.Value);
            if (user == null) return Unauthorized();

            return Ok(new AuthResponse { Id = user.Id, Name = user.Name, Email = user.Email });
        }

        public record UpdateMeRequest(
                [Required, MaxLength(100)] string Name,
                [Required, EmailAddress, MaxLength(120)] string Email
            );

        [Authorize]
        [HttpPatch("me")]
        public async Task<ActionResult<AuthResponse>> UpdateMe([FromBody] UpdateMeRequest req)
        {
            var userId = GetUserIdOrNull();
            if (userId == null) return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId.Value);
            if (user == null) return Unauthorized();

            var newName = (req.Name ?? "").Trim();
            var newEmail = (req.Email ?? "").Trim().ToLower();

            if (string.IsNullOrWhiteSpace(newName)) return BadRequest("Name is required");
            if (string.IsNullOrWhiteSpace(newEmail)) return BadRequest("Email is required");

            var exists = await _context.Users.AnyAsync(u => u.Id != user.Id && u.Email.ToLower() == newEmail);
            if (exists) return Conflict("Email is already in use");

            user.Name = newName;
            user.Email = newEmail;

            await _context.SaveChangesAsync();

            IssueAuthCookie(user);

            return Ok(new AuthResponse { Id = user.Id, Name = user.Name, Email = user.Email });
        }

        [Authorize]
        [HttpDelete("me")]
        public async Task<IActionResult> DeleteMe()
        {
            var userId = GetUserIdOrNull();
            if (userId == null) return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync (u => u.Id == userId.Value);
            if (user == null)
            {
                Response.Cookies.Delete("tw_auth");
                return Ok();
            }

            var cart = await _context.Carts.Where(x => x.UserId == user.Id).ToListAsync();
            var wl = await _context.Wishlists.Where(x => x.UserId == user.Id).ToListAsync();

            var orders = await _context.Orders.Where(o => o.UserId == user.Id).ToListAsync();
            var orderIds = orders.Select(o => o.Id).ToList();
            var orderItems = orderIds.Count == 0
                ? new List<OrderItem>()
                : await _context.OrderItems.Where(oi => orderIds.Contains(oi.OrderId)).ToListAsync();

            _context.Carts.RemoveRange(cart);
            _context.Wishlists.RemoveRange(wl);
            _context.OrderItems.RemoveRange(orderItems);
            _context.Orders.RemoveRange(orders);

            _context.Users.Remove(user);

            await _context.SaveChangesAsync();

            Response.Cookies.Delete("tw_auth");
            return Ok();

        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("tw_auth");
            return Ok();
        }

        private int? GetUserIdOrNull()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out var userId)) return null;
            return userId;
        }

        private void IssueAuthCookie(User user)
        {
            var key = _config["Jwt:Key"]!;
            var issuer = _config["Jwt:Issuer"]!;
            var audience = _config["Jwt:Audience"]!;

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name)
            };

            var creds = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims, 
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            Response.Cookies.Append("tw_auth", jwt, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });
        }

        public record ChangePasswordRequest
        (
            [Required] string CurrentPassword,
            [Required] string NewPassword
        );

        [Authorize]
        [HttpPatch("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest req)
        {
            var userId = GetUserIdOrNull();
            if (userId == null) return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId.Value);
            if (user == null) return Unauthorized();

            if (string.IsNullOrWhiteSpace(req.CurrentPassword) || string.IsNullOrWhiteSpace(req.NewPassword))
                return BadRequest("Current password and new password are required");

            var ok = _hasher.VerifyHashedPassword(user, user.Password, req.CurrentPassword);
            if (ok == PasswordVerificationResult.Failed)
                return BadRequest("Current password is incorrect.");

            user.Password = _hasher.HashPassword(user, req.NewPassword);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}

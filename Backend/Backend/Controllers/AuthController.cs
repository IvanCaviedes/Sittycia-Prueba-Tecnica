using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Backend.Models.Request;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Backend.Configuration;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly ApplicationDbContext _context;
        private readonly ILogger<AuthController> _logger;
        private readonly JwtSettings _jwt;

        public AuthController(ApplicationDbContext context, IConfiguration configuration, ILogger<AuthController> logger)
        {
            _context = context;
            _logger = logger;
            _jwt = configuration.GetSection("jwt").Get<JwtSettings>();
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Models.Request.RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Registro fallido: modelo inválido.");
                return BadRequest(ModelState);
            }

            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (existingUser != null)
            {
                _logger.LogWarning("Registro fallido: el usuario ya existe.");
                return StatusCode(409, new { Status = false, Message = $"Registro fallido: el nombre de usuario '{request.Username}' ya está en uso." });
            }

            var user = new User
            {
                Username = request.Username
            };

            var passwordHasher = new PasswordHasher<User>();
            user.Password = passwordHasher.HashPassword(user, request.Password);

            await _context.Users.AddAsync(user);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error al guardar el usuario en la base de datos.");
                return StatusCode(500, new { Status = "Error", Message = "Error interno del servidor." }); // Internal Server Error (500)
            }

            var token = GenerateJwtToken(user);

            return StatusCode(201, new { Status = true, Message = "Usuario registrado con éxito.", token });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Models.Request.LoginRequest request)
        {

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Inicio de sesión fallido: modelo inválido.");
                return StatusCode(400, new { Status = false, Message = "Modelo de solicitud inválido." });

            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null)
            {
                return StatusCode(404, new { Status = false, Message = "Usuario no encontrado." });
            }
            var passwordHasher = new PasswordHasher<User>();
            var result = passwordHasher.VerifyHashedPassword(user, user.Password, request.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                _logger.LogWarning("Inicio de sesión fallido: contraseña incorrecta.");
                return StatusCode(401, new { Status = false, Message = "Contraseña incorrecta." });
            }

            var token = GenerateJwtToken(user);

            return StatusCode(200, new { Status = true, Message = "Inicio de sesión exitoso.", token });
        }

        // GET: api/auth/Me
        [Authorize]
        [HttpGet("Me")]
        public async Task<IActionResult> GetMe()
        {
            var userIdClaim = User.FindFirst("id");
            if (userIdClaim == null)
            {
                return Unauthorized(new { Status = false, Message = "No se pudo identificar al usuario." });
            }

            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized(new { Status = false, Message = "ID de usuario inválido." });
            }

            var user = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.CreatedAt,
                    u.UpdatedAt,
                    u.Tasks
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(new { Status = false, Message = "Usuario no encontrado." });
            }

            return StatusCode(200, user);
        }

        // POST: api/auth/update-password
        [Authorize]
        [HttpPost("update-password")]
        public async Task<IActionResult> UpdatePassword([FromBody] Models.Request.UpdatePasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Status = false, Message = "Datos inválidos." });
            }

            var userIdClaim = User.FindFirst("id");
            if (userIdClaim == null)
            {
                return Unauthorized(new { Status = false, Message = "No se pudo identificar al usuario." });
            }

            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized(new { Status = false, Message = "ID de usuario inválido." });
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { Status = false, Message = "Usuario no encontrado." });
            }

            var passwordHasher = new PasswordHasher<User>();
            var result = passwordHasher.VerifyHashedPassword(user, user.Password, request.CurrentPassword);
            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { Status = false, Message = "Contraseña actual incorrecta." });
            }

            user.Password = passwordHasher.HashPassword(user, request.NewPassword);

            try
            {
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error al actualizar la contraseña del usuario.");
                return StatusCode(500, new { Status = "Error", Message = "Error interno del servidor." });
            }

            return StatusCode(200, new { Status = true, Message = "Contraseña actualizada con éxito." });

        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwt.Key);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
     {
new Claim(JwtRegisteredClaimNames.Sub, _jwt.Subject),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToUniversalTime().ToString()), // Usa UTC
                new Claim("id", user.Id.ToString())
     }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _jwt.Issuer,
                Audience = _jwt.Audience
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

    }
}

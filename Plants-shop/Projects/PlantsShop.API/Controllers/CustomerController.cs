using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PlantsShop.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace PlantsShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly PlantsshopdbContext _context;
        private readonly IConfiguration _configuration;
        private readonly byte[] _secretKey;

        public CustomerController(PlantsshopdbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _secretKey = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            var user = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == loginRequest.Email && c.Password == loginRequest.Password);

            if (user == null)
                return Unauthorized("Invalid email or password.");

            var token = GenerateJwtToken(user, 60); // Access token valid for 60 minutes
            var refreshToken = GenerateJwtToken(GenerateRefreshClaims(user.Id, user.Email), 7 * 24 * 60); // Refresh token valid for 7 days
            var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

            return Ok(new
            {
                Token = token,
                RefreshToken = refreshToken,
                RefreshTokenExpiry = new DateTimeOffset(refreshTokenExpiry).ToUnixTimeMilliseconds(),
                Customer = new
                {
                    user.Id,
                    user.First_Name,
                    user.Last_Name,
                    user.Email,
                    user.Phone_Number
                }
            });
        }

        [HttpPost("refresh")]
        public IActionResult Refresh([FromBody] TokenRequest tokenRequest)
        {
            // Validate the existing token
            var principal = GetPrincipalFromToken(tokenRequest.Token);
            if (principal == null)
                return BadRequest("Invalid token.");

            var newJwtToken = GenerateJwtToken(principal.Claims, 15); // New access token valid for 15 minutes
            var newRefreshToken = GenerateJwtToken(GenerateRefreshClaims(principal), 7 * 24 * 60); // New refresh token valid for 7 days
            var newRefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

            return Ok(new
            {
                Token = newJwtToken,
                RefreshToken = newRefreshToken,
                RefreshTokenExpiry = new DateTimeOffset(newRefreshTokenExpiry).ToUnixTimeMilliseconds()
            });
        }

        private string GenerateJwtToken(Customer customer, int minutes)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, customer.Id.ToString()),
                    new Claim(ClaimTypes.Email, customer.Email)
                }),
                Expires = DateTime.UtcNow.AddMinutes(15),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(_secretKey), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string GenerateJwtToken(IEnumerable<Claim> claims, int minutes)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(minutes),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(_secretKey), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private IEnumerable<Claim> GenerateRefreshClaims(int customerId, string email)
        {
            return new[]
            {
                new Claim(ClaimTypes.NameIdentifier, customerId.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim("RefreshToken", "true")
            };
        }

        private IEnumerable<Claim> GenerateRefreshClaims(ClaimsPrincipal principal)
        {
            var customerId = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var email = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(customerId) || string.IsNullOrEmpty(email))
                return null;

            return new[]
            {
                new Claim(ClaimTypes.NameIdentifier, customerId),
                new Claim(ClaimTypes.Email, email),
                new Claim("RefreshToken", "true")
            };
        }

        private ClaimsPrincipal GetPrincipalFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(_secretKey),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            };

            try
            {
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
                return principal;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error validating token: {ex.Message}");
                return null;
            }
        }


        [HttpGet("all")]
        [Authorize]
        public async Task<IEnumerable<Customer>> GetAllCustomers()
        {
            return await _context.Customers.ToListAsync();
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Id == id);
            if (customer == null)
                return NotFound("Customer Not Found");
            return Ok(customer);
        }

        [HttpPost("add")]
        public async Task<ActionResult<Customer>> AddCustomer(Customer customer)
        {
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            var savedCustomer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Id == customer.Id);

            return Ok(savedCustomer);
        }

        [HttpPut("update")]
        [Authorize]
        public async Task<ActionResult<Customer>> UpdateCustomer(Customer updateCustomer)
        {
            var dbCustomer = await _context.Customers.FindAsync(updateCustomer.Id);
            if (dbCustomer == null)
                return NotFound("Customer Not Found");

            dbCustomer.First_Name = updateCustomer.First_Name;
            dbCustomer.Last_Name = updateCustomer.Last_Name;
            dbCustomer.Email = updateCustomer.Email;
            dbCustomer.Password = updateCustomer.Password;
            dbCustomer.Phone_Number = updateCustomer.Phone_Number;

            _context.Entry(dbCustomer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(updateCustomer.Id))
                    return NotFound("Customer Not Found");
                else
                    throw;
            }

            return Ok(await _context.Customers.ToListAsync());
        }

        [HttpDelete("delete/{id}")]
        [Authorize]
        public async Task<ActionResult<Customer>> DeleteCustomer(int id)
        {
            var dbCustomer = await _context.Customers.FindAsync(id);
            if (dbCustomer == null)
                return NotFound("Customer Not Found");
            _context.Customers.Remove(dbCustomer);
            await _context.SaveChangesAsync();
            return Ok(await _context.Customers.ToListAsync());
        }

        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.Id == id);
        }
    }
}

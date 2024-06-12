using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PlantsShop.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PlantsShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly PlantsshopdbContext _context;
        private readonly IConfiguration _configuration;

        public CustomerController(PlantsshopdbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            var user = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == loginRequest.Email && c.Password == loginRequest.Password);

            if (user == null)
                return Unauthorized("Invalid email or password.");

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                Token = token,
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


        private string GenerateJwtToken(Customer customer)
        {
            // Retrieve the JWT key from the configuration and convert it to a byte array
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

            // Create an instance of JwtSecurityTokenHandler to handle the creation of the JWT token
            var tokenHandler = new JwtSecurityTokenHandler();

            // Define the token descriptor, which includes the claims, expiration time, and signing credentials
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] // Define the subject of the token with a set of claims
                {
            // Add a claim for the customer's ID
            new Claim(ClaimTypes.NameIdentifier, customer.Id.ToString()),
            // Add a claim for the customer's email
            new Claim(ClaimTypes.Email, customer.Email),
            // Add a unique GUID claim to ensure each token is unique
            new Claim("unique_id", Guid.NewGuid().ToString())
        }),
                Expires = DateTime.UtcNow.AddMinutes(1), // Set the desired expiration time

                 // Specify the signing credentials, using the symmetric key and HMAC SHA-256 algorithm
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor); // Create the token using the token handler and the token descriptor
            return tokenHandler.WriteToken(token); // Write the token as a string and return it
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

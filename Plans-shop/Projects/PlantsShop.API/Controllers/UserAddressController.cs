using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantsShop.API.Models;

namespace PlantsShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserAddressController : ControllerBase
    {
        private readonly PlantsshopdbContext _context;

        public UserAddressController(PlantsshopdbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IEnumerable<UserAddress>> GetAllUserAddresses()
        {
            return await _context.UserAddresses
                .Include(c => c.Customer)
                    .ThenInclude(customer => customer.Address) // Include the address
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserAddress>> GetUserAddress(int id)
        {
            var useraddress = await _context.UserAddresses
                .Include(c => c.Customer)
                    .ThenInclude(customer => customer.Address) // Include the address
                .FirstOrDefaultAsync(c => c.Id == id);

            if (useraddress == null)
                return NotFound("User Address Not Found");

            return Ok(useraddress);
        }

        [HttpPost("add")]
        public async Task<ActionResult<UserAddress>> AddUserAddress(UserAddress useraddress)
        {
            _context.UserAddresses.Add(useraddress);
            await _context.SaveChangesAsync();
            // Eager loading the address data
            return Ok(await _context.UserAddresses
                .Include(c => c.Customer)
                    .ThenInclude(customer => customer.Address) // Include the address
                .ToListAsync());
        }

        [HttpPut("update")]
        public async Task<ActionResult<UserAddress>> UpdateUserAddress(UserAddress updateUserAddress)
        {
            var dbUserAddress = await _context.UserAddresses.FindAsync(updateUserAddress.Id);
            if (dbUserAddress == null)
                return NotFound("User Address Not Found");

            await _context.SaveChangesAsync();

            // Eager loading the address data
            return Ok(await _context.UserAddresses
                .Include(c => c.Customer)
                    .ThenInclude(customer => customer.Address) // Include the address
                .ToListAsync());
        }

        [HttpDelete("delete")]
        public async Task<ActionResult<UserAddress>> DeleteUserAddress(int id)
        {
            var dbUserAddress = await _context.UserAddresses.FindAsync(id);
            if (dbUserAddress == null)
                return NotFound("User Address Items Not Found");

            _context.UserAddresses.Remove(dbUserAddress);
            await _context.SaveChangesAsync();

            // Eager loading the address data
            return Ok(await _context.UserAddresses
                .Include(c => c.Customer)
                    .ThenInclude(customer => customer.Address) // Include the address
                .ToListAsync());
        }

    }
}
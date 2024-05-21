using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantsShop.API.Models;
using System.Net;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PlantsShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AddressController : ControllerBase
    {
        private readonly PlantsshopdbContext _context;

        public AddressController(PlantsshopdbContext context)
        {
            _context = context;
        }

        // Retrieve all addresses with associated customer information
        [HttpGet("all")]
        public async Task<IEnumerable<Address>> GetAllAddresses()
        {
            return await _context.Address.Include(c => c.Customer).ToListAsync();
        }

        // Retrieve a single address by ID and include customer information
        [HttpGet("{id}")]
        public async Task<ActionResult<Address>> GetAddress(int id)
        {
            var address = await _context.Address
                .Include(c => c.Customer) // Include the related customer information
                .FirstOrDefaultAsync(a => a.Id == id);

            if (address == null)
                return NotFound("Address Not Found");

            return Ok(address);
        }

        // Add a new address and return all addresses
        [HttpPost("add")]
        public async Task<IEnumerable<Address>> AddAddress(Address address)
        {
            _context.Address.Add(address);
            await _context.SaveChangesAsync();
            return await GetAllAddresses();
        }

        // Update an existing address by ID, ensuring that customer data remains intact
        [HttpPut("update")]
        public async Task<ActionResult<IEnumerable<Address>>> UpdateAddress(Address updateAddress)
        {
            var dbAddress = await _context.Address.FindAsync(updateAddress.Id);

            if (dbAddress == null)
                return NotFound("Address Not Found");

            // Update only address fields while keeping the original customer association
            dbAddress.city = updateAddress.city;
            dbAddress.region = updateAddress.region;
            dbAddress.address = updateAddress.address;
            dbAddress.street_number = updateAddress.street_number;
            dbAddress.postal_code = updateAddress.postal_code;
            dbAddress.Customer_id = updateAddress.Customer_id;

            await _context.SaveChangesAsync();

            // Return the updated list of addresses with customer data
            return Ok(await _context.Address.Include(c => c.Customer).ToListAsync());
        }

        // Delete an address and return the remaining addresses
        [HttpDelete("delete")]
        public async Task<ActionResult<IEnumerable<Address>>> DeleteAddress(int id)
        {
            var dbAddress = await _context.Address.FindAsync(id);

            if (dbAddress == null)
                return NotFound("Address Not Found");

            _context.Address.Remove(dbAddress);
            await _context.SaveChangesAsync();

            // Return the remaining list of addresses with customer data
            return Ok(await _context.Address.Include(c => c.Customer).ToListAsync());
        }
    }
}

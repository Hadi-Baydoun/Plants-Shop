using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantsShop.API.Models;
using System.Net;

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

        [HttpGet("all")]
        public async Task<IEnumerable<Address>> GetAllAddresses()
        {
            return await _context.Address.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Address>> GetAddress(int id)
        {
            var address = await _context.Address.FindAsync(id);
            if (address is null)
                return NotFound("Address Not Found");
            return Ok(address);
        }

        [HttpPost("add")]
        public async Task<IEnumerable<Address>> AddAddress(Address address)
        {
            _context.Address.Add(address);
            await _context.SaveChangesAsync();
            return await GetAllAddresses();
        }

        [HttpPut("update")]
        public async Task<ActionResult<Address>> UpdateAddress(Address updateAddress)
        {
            var dbAddress = await _context.Address.FindAsync(updateAddress.Id);
            if (dbAddress is null)
                return NotFound("Address Not Found");
            dbAddress.city = updateAddress.city;
            dbAddress.region = updateAddress.region;
            dbAddress.address = updateAddress.address;
            dbAddress.street_number = updateAddress.street_number;
            dbAddress.postal_code = updateAddress.postal_code;



            await _context.SaveChangesAsync();

            return Ok(await _context.Address.ToListAsync());

        }

        [HttpDelete("delete")]
        public async Task<ActionResult<Address>> DeleteAddress(int id)
        {
            var dbAddress = await _context.Address.FindAsync(id);
            if (dbAddress is null)
                return NotFound("Address Not Found");
            _context.Address.Remove(dbAddress);
            await _context.SaveChangesAsync();
            return Ok(await _context.Address.ToListAsync());
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantsShop.API.Models;

namespace PlantsShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly PlantsshopdbContext _context;

        public AdminController(PlantsshopdbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IEnumerable<Admin>> GetAllAdmins()
        {
            return await _context.Admins.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Admin>> GetAdmin(int id)
        {
            var admin = await _context.Admins.FirstOrDefaultAsync(c => c.Id == id);
            if (admin == null)
                return NotFound("Admin Not Found");
            return Ok(admin);
        }

        [HttpPost("add")]
        public async Task<ActionResult<Admin>> AddAdmin(Admin admin)
        {
            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();
            // Eager loading the address data
            return Ok(await _context.Admins.ToListAsync());
        }

        [HttpPut("update")]
        public async Task<ActionResult<Admin>> UpdateAdmin(Admin updateAdmin)
        {
            var dbAdmin = await _context.Admins.FindAsync(updateAdmin.Id);
            if (dbAdmin == null)
                return NotFound("Admin Not Found");
            dbAdmin.Name = updateAdmin.Name;

            await _context.SaveChangesAsync();

            // Eager loading the address data
            return Ok(await _context.Admins.ToListAsync());
        }

        [HttpDelete("delete")]
        public async Task<ActionResult<Admin>> DeleteAdmin(int id)
        {
            var dbAdmin = await _context.Admins.FindAsync(id);
            if (dbAdmin == null)
                return NotFound("Admin Not Found");
            _context.Admins.Remove(dbAdmin);
            await _context.SaveChangesAsync();
            // Eager loading the address data
            return Ok(await _context.Admins.ToListAsync());
        }

    }
}
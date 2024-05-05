using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantsShop.API.Models;

namespace PlantsShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderStatusController : ControllerBase
    {
        private readonly PlantsshopdbContext _context;

        public OrderStatusController(PlantsshopdbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IEnumerable<OrderStatus>> GetAllOrderStatus()
        {
            return await _context.Orderstatus.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderStatus>> GetOrderStatus(int id)
        {
            var orderstatus = await _context.Orderstatus.FirstOrDefaultAsync(c => c.Id == id);
            if (orderstatus == null)
                return NotFound("Status Not Found");
            return Ok(orderstatus);
        }

        [HttpPost("add")]
        public async Task<ActionResult<OrderStatus>> AddOrderStatus(OrderStatus orderstatus)
        {
            _context.Orderstatus.Add(orderstatus);
            await _context.SaveChangesAsync();
            // Eager loading the address data
            return Ok(await _context.Orderstatus.ToListAsync());
        }

        [HttpPut("update")]
        public async Task<ActionResult<OrderStatus>> UpdateOrderStatus(OrderStatus updateOrderStatus)
        {
            var dbOrderStatus = await _context.Orderstatus.FindAsync(updateOrderStatus.Id);
            if (dbOrderStatus == null)
                return NotFound("Status Not Found");
            dbOrderStatus.Status = updateOrderStatus.Status;

            await _context.SaveChangesAsync();

            // Eager loading the address data
            return Ok(await _context.Orderstatus.ToListAsync());
        }

        [HttpDelete("delete")]
        public async Task<ActionResult<OrderStatus>> DeleteOrderStatus(int id)
        {
            var dbOrderStatus = await _context.Orderstatus.FindAsync(id);
            if (dbOrderStatus == null)
                return NotFound("Status Not Found");
            _context.Orderstatus.Remove(dbOrderStatus);
            await _context.SaveChangesAsync();
            // Eager loading the address data
            return Ok(await _context.Orderstatus.ToListAsync());
        }

    }
}
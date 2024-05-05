using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantsShop.API.Models;

namespace PlantsShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentMethodsController : ControllerBase
    {
        private readonly PlantsshopdbContext _context;

        public PaymentMethodsController(PlantsshopdbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IEnumerable<PaymnetMethods>> GetAllPaymentMethods()
        {
            return await _context.paymnetmethods.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PaymnetMethods>> GetPaymentMethod(int id)
        {
            var payment = await _context.paymnetmethods.FirstOrDefaultAsync(c => c.Id == id);
            if (payment == null)
                return NotFound("Payment Method Not Found");
            return Ok(payment);
        }

        [HttpPost("add")]
        public async Task<ActionResult<PaymnetMethods>> AddPaymentMethod(PaymnetMethods payment)
        {
            _context.paymnetmethods.Add(payment);
            await _context.SaveChangesAsync();
            // Eager loading the address data
            return Ok(await _context.paymnetmethods.ToListAsync());
        }

        [HttpPut("update")]
        public async Task<ActionResult<PaymnetMethods>> UpdatePaymentMethod(PaymnetMethods updatePaymentMethods)
        {
            var dbPaymentMethods = await _context.paymnetmethods.FindAsync(updatePaymentMethods.Id);
            if (dbPaymentMethods == null)
                return NotFound("Payment Method Not Found");
            dbPaymentMethods.Type = updatePaymentMethods.Type;

            await _context.SaveChangesAsync();

            // Eager loading the address data
            return Ok(await _context.paymnetmethods.ToListAsync());
        }

        [HttpDelete("delete")]
        public async Task<ActionResult<PaymnetMethods>> DeletePaymentMethod(int id)
        {
            var dbPaymentMethods = await _context.paymnetmethods.FindAsync(id);
            if (dbPaymentMethods == null)
                return NotFound("Payment Method Not Found");
            _context.paymnetmethods.Remove(dbPaymentMethods);
            await _context.SaveChangesAsync();
            // Eager loading the address data
            return Ok(await _context.paymnetmethods.ToListAsync());
        }

    }
}
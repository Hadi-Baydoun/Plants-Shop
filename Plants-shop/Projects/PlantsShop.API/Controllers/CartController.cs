using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantsShop.API.Models;

namespace PlantsShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly PlantsshopdbContext _context;

        public CartController(PlantsshopdbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IEnumerable<Cart>> GetAllCart()
        {
            return await _context.Carts
                .Include(c => c.Customer)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Cart>> GetCart(int id)
        {
            var cart = await _context.Carts
                .Include(c => c.Customer)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cart == null)
                return NotFound("Cart Not Found");

            return Ok(cart);
        }


        [HttpPost("add")]
        public async Task<ActionResult<Cart>> AddCart(Cart cart)
        {
            // Find the existing Customer
            var customer = await _context.Customers.FindAsync(cart.Customer_id);

            // Associate the new Cart with the existing Customer
            cart.Customer = customer;

            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();

            // Eager loading the customer data
            return Ok(await _context.Carts.Include(c => c.Customer).ToListAsync());
        }

        [HttpPut("update")]
        public async Task<ActionResult<Cart>> UpdateCart(Cart updateCart)
        {
            var dbCart = await _context.Carts.FindAsync(updateCart.Id);
            if (dbCart == null)
                return NotFound("Cart Not Found");

            // Check if the customer exists in the Customer table
            var customer = await _context.Customers.FindAsync(updateCart.Customer_id);
            if (customer == null)
                return BadRequest("Invalid Customer ID");

            // Update the Customer_id property
            dbCart.Customer_id = updateCart.Customer_id;

            // Update any other properties if needed
            _context.Entry(dbCart).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CartExists(updateCart.Id))
                    return NotFound("Cart Not Found");
                else
                    throw;
            }

            // Eager loading the customer data
            return Ok(await _context.Carts.Include(c => c.Customer).ToListAsync());
        }

        private bool CartExists(int id)
        {
            return _context.Carts.Any(e => e.Id == id);
        }




        [HttpDelete("delete")]
        public async Task<ActionResult<Cart>> DeleteCart(int id)
        {
            var dbCart = await _context.Carts.FindAsync(id);
            if (dbCart == null)
                return NotFound("Cart Not Found");

            _context.Carts.Remove(dbCart);
            await _context.SaveChangesAsync();

            // Eager loading the customer data
            return Ok(await _context.Carts.ToListAsync());
        }

        [HttpGet("getOrCreateCartByCustomerId/{customerId}")]
        public async Task<ActionResult<Cart>> GetOrCreateCartByCustomerId(int customerId)
        {
            var cart = await _context.Carts.FirstOrDefaultAsync(c => c.Customer_id == customerId);
            if (cart == null)
            {
                cart = new Cart { Customer_id = customerId };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }
            return Ok(cart);
        }


    }
}

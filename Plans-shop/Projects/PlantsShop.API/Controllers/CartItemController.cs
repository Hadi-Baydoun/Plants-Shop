using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantsShop.API.Models;

namespace PlantsShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartItemController : ControllerBase
    {
        private readonly PlantsshopdbContext _context;

        public CartItemController(PlantsshopdbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IEnumerable<CartItem>> GetAllCartItems()
        {
            return await _context.CartItems
                .Include(c => c.Product)
                    .ThenInclude(p => p.SubCategories)
                        .ThenInclude(sc => sc.Category)
                .Include(c => c.Cart)
                    .ThenInclude(cart => cart.Customer)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CartItem>> GetCartItem(int id)
        {
            var cartItem = await _context.CartItems
                .Include(c => c.Product)
                    .ThenInclude(p => p.SubCategories)
                        .ThenInclude(sc => sc.Category)
                .Include(c => c.Cart)
                    .ThenInclude(cart => cart.Customer)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cartItem == null)
                return NotFound("Cart Item Not Found");

            return Ok(cartItem);
        }

        [HttpPost("add")]
        public async Task<ActionResult<CartItem>> AddCartItem(CartItem cartItem)
        {
            // Find the existing Product
            var product = await _context.Products
                .Include(p => p.SubCategories)
                .ThenInclude(sc => sc.Category)
                .FirstOrDefaultAsync(p => p.Id == cartItem.Product_id);

            // Find the existing Cart
            var cart = await _context.Carts
                .Include(c => c.Customer)
                .FirstOrDefaultAsync(c => c.Id == cartItem.Cart_id);

            // If the Product or Cart doesn't exist, return NotFound
            if (product == null || cart == null)
                return NotFound("Product or Cart not found.");

            // Associate the new CartItem with the existing Product and Cart
            cartItem.Product = product;
            cartItem.Cart = cart;

            // Calculate the total based on quantity and product price
            cartItem.Total = product.Price * cartItem.Quantity;

            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            // Eager loading the related data
            return Ok(await _context.CartItems
                .Include(c => c.Product)
                .ThenInclude(p => p.SubCategories)
                .ThenInclude(sc => sc.Category)
                .Include(c => c.Cart)
                .ThenInclude(cart => cart.Customer)
                .ThenInclude(customer => customer)
                .ToListAsync());
        }

        [HttpPut("update")]
        public async Task<ActionResult<CartItem>> UpdateCartItem(CartItem updateCartItem)
        {
            var dbCartItem = await _context.CartItems.FindAsync(updateCartItem.Id);
            if (dbCartItem == null)
                return NotFound("CartItem Not Found");

            // Update the quantity and product id
            dbCartItem.Quantity = updateCartItem.Quantity;
            dbCartItem.Product_id = updateCartItem.Product_id; // Add this line to update the Product_id

            // Find the product to get the price for total calculation
            var product = await _context.Products.FindAsync(updateCartItem.Product_id);
            if (product != null)
            {
                dbCartItem.Total = product.Price * updateCartItem.Quantity;
            }

            await _context.SaveChangesAsync();

            // Eager loading the address data
            return Ok(await _context.CartItems.Include(c => c.Product).Include(c => c.Cart).ToListAsync());
        }


        [HttpDelete("delete")]
        public async Task<ActionResult<CartItem>> DeleteCartItem(int id)
        {
            var dbCartItem = await _context.CartItems.FindAsync(id);
            if (dbCartItem == null)
                return NotFound("Cart Item Not Found");
            _context.CartItems.Remove(dbCartItem);
            await _context.SaveChangesAsync();
            // Eager loading the address data
            return Ok(await _context.CartItems.Include(c => c.Product).Include(c => c.Cart).ToListAsync());
        }


    }
}
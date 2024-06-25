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
        public async Task<ActionResult<CartItemDto>> AddCartItem(CartItemDto cartItemDto)
        {
            // Find the existing Product
            var product = await _context.Products.FindAsync(cartItemDto.Product_id);

            // Find the existing Cart
            var cart = await _context.Carts.FindAsync(cartItemDto.Cart_id);

            // If the Product or Cart doesn't exist, return NotFound
            if (product == null || cart == null)
                return NotFound("Product or Cart not found.");

            // Create a new CartItem from the DTO
            var cartItem = new CartItem
            {
                Quantity = cartItemDto.Quantity,
                Product_id = cartItemDto.Product_id,
                Cart_id = cartItemDto.Cart_id,
                Total = product.Price * cartItemDto.Quantity
            };

            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            // Map the saved CartItem back to a CartItemDto
            var savedCartItemDto = new CartItemDto
            {
                Id = cartItem.Id,
                Quantity = cartItem.Quantity,
                Total = cartItem.Total,
                Product_id = cartItem.Product_id,
                Cart_id = cartItem.Cart_id
            };

            return Ok(savedCartItemDto);
        }

        [HttpGet("getByCustomerId/{customerId}")]
        public async Task<ActionResult<Cart>> GetCartByCustomerId(int customerId)
        {
            var cart = await _context.Carts.FirstOrDefaultAsync(c => c.Customer_id == customerId);
            if (cart == null)
                return NotFound("Cart not found for this customer.");
            return Ok(cart);
        }

        [HttpGet("getByCartId/{cartId}")]
        public async Task<IEnumerable<CartItem>> GetCartItemsByCartId(int cartId)
        {
            return await _context.CartItems
          
                .Where(c => c.Cart_id == cartId)
                .ToListAsync();
        }


        [HttpPut("update")]
        public async Task<ActionResult<CartItemDto>> UpdateCartItem(CartItemDto updateCartItem)
        {
            var dbCartItem = await _context.CartItems.FindAsync(updateCartItem.Id);
            if (dbCartItem == null)
                return NotFound("CartItem Not Found");

            // Update the quantity and product id
            dbCartItem.Quantity = updateCartItem.Quantity;
            dbCartItem.Product_id = updateCartItem.Product_id; 

            // Find the product to get the price for total calculation
            var product = await _context.Products.FindAsync(updateCartItem.Product_id);
            if (product != null)
            {
                dbCartItem.Total = product.Price * updateCartItem.Quantity;
            }

            await _context.SaveChangesAsync();

            // Eager loading the address data
            return Ok(await _context.CartItems.ToListAsync());
        }


        [HttpDelete("delete/{id}")]
        public async Task<ActionResult<CartItem>> DeleteCartItem(int id)
        {
            var dbCartItem = await _context.CartItems.FindAsync(id);
            if (dbCartItem == null)
                return NotFound("Cart Item Not Found");
            _context.CartItems.Remove(dbCartItem);
            await _context.SaveChangesAsync();
            return NoContent();
        }







    }
}
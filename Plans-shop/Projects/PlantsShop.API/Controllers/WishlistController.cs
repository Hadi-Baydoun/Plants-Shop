using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantsShop.API.Models;

namespace PlantsShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WishlistController : ControllerBase
    {
        private readonly PlantsshopdbContext _context;

        public WishlistController(PlantsshopdbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IEnumerable<Wishlist>> GetAllWishlists()
        {
            return await _context.Wishlists
                .Include(c => c.Customer)
                .Include(c => c.Product)
                .ToListAsync();
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Wishlist>> GetWishlist(int id)
        {
            var wishlist = await _context.Wishlists
                .Include(c => c.Customer) 
                .Include(c => c.Product)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (wishlist == null)
                return NotFound("Wishlist Not Found");

            return Ok(wishlist);
        }

        [HttpPost("add")]
        public async Task<ActionResult<Wishlist>> AddWishlist(Wishlist wishlist)
        {
            // Check if the provided wishlist has valid customer ID and product ID
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == wishlist.Customer_id);
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == wishlist.Product_id);

            if (!customerExists || product == null)
            {
                return BadRequest("Invalid customer ID or product ID.");
            }

            // Calculate the Price based on the Product's Price and Quantity
            wishlist.Price = product.Price * wishlist.Quantity;

            // Set the Customer and Product navigation properties to null
            wishlist.Customer = null;
            wishlist.Product = null;

            // Add the new Wishlist to the context
            _context.Wishlists.Add(wishlist);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                // Handle any other exceptions that might occur during SaveChanges
                return BadRequest(ex.Message);
            }

            // Return the added Wishlist without eager loading the related data
            return Ok(wishlist);
        }




        [HttpPut("update")]
        public async Task<ActionResult<Wishlist>> UpdateWishlist(Wishlist updateWishlist)
        {
            var dbWishlist = await _context.Wishlists
                .Include(w => w.Product)
                .FirstOrDefaultAsync(w => w.Id == updateWishlist.Id);

            if (dbWishlist == null)
                return NotFound("Wishlist Not Found");

            // Check if the Product_id has changed
            if (dbWishlist.Product_id != updateWishlist.Product_id)
            {
                // Retrieve the new Product
                var newProduct = await _context.Products.FindAsync(updateWishlist.Product_id);
                if (newProduct == null)
                    return NotFound("Product not found.");

                // Update the Product and Price
                dbWishlist.Product = newProduct;
                dbWishlist.Price = newProduct.Price * updateWishlist.Quantity;
            }
            else
            {
                // Recalculate the Price based on the existing Product and updated Quantity
                var product = await _context.Products.FindAsync(dbWishlist.Product_id);
                if (product != null)
                {
                    dbWishlist.Price = product.Price * updateWishlist.Quantity;
                }
            }

            // Update other properties
            dbWishlist.Quantity = updateWishlist.Quantity;
            dbWishlist.Customer_id = updateWishlist.Customer_id;

            // Mark the entity as modified
            _context.Entry(dbWishlist).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WishlistExists(updateWishlist.Id))
                    return NotFound("Wishlist Not Found");
                else
                    throw;
            }

            // Eager loading the related data
            return Ok(await _context.Wishlists
                .Include(w => w.Customer)
                .Include(w => w.Product)
                .ToListAsync());
        }

        private bool WishlistExists(int id)
        {
            return _context.Wishlists.Any(e => e.Id == id);
        }

        [HttpDelete("delete")]
        public async Task<ActionResult<Wishlist>> DeleteWishlist(int id)
        {
            var dbWishlist = await _context.Wishlists.FindAsync(id);
            if (dbWishlist == null)
                return NotFound("Wishlist Not Found");
            _context.Wishlists.Remove(dbWishlist);
            await _context.SaveChangesAsync();
            // Eager loading the address data
            return Ok(await _context.Wishlists.Include(c => c.Customer).Include(c => c.Product).ToListAsync());
        }

    }
}
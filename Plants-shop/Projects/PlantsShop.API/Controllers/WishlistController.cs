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
                .ToListAsync();
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Wishlist>> GetWishlist(int id)
        {
            var wishlist = await _context.Wishlists
                .Include(c => c.Customer) 
                .FirstOrDefaultAsync(c => c.Id == id);

            if (wishlist == null)
                return NotFound("Wishlist Not Found");

            return Ok(wishlist);
        }

        [HttpGet("getByCustomerId/{customerId}")]
        public async Task<ActionResult<Wishlist>> GetWishlistByCustomerId(int customerId)
        {
            var wishlist = await _context.Wishlists.FirstOrDefaultAsync(w => w.Customer_id == customerId);
            if (wishlist == null)
                return NotFound("Wishlist not found for this customer.");
            return Ok(wishlist);
        }

        [HttpGet("getByWishlistId/{wishlistId}")]
        public async Task<IEnumerable<Wishlist>> GetWishlistItemsByWishlistId(int wishlistId)
        {
            return await _context.Wishlists
                .Include(w => w.Customer)
                .Where(w => w.Id == wishlistId)
                .ToListAsync();
        }

        [HttpPost("add")]
        public async Task<ActionResult<Wishlist>> AddWishlist(Wishlist wishlist)
        {
            // Check if the provided wishlist has valid customer ID and product ID
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Id == wishlist.Customer_id);

            if (customer == null)
            {
                return BadRequest("Invalid customer ID. ");
            }

            // Set the Customer and Product navigation properties
            wishlist.Customer = customer;

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
                .FirstOrDefaultAsync(w => w.Id == updateWishlist.Id);

            if (dbWishlist == null)
                return NotFound("Wishlist Not Found");

            // Update other properties
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
            return Ok(await _context.Wishlists.Include(c => c.Customer).ToListAsync());
        }


        [HttpGet("getOrCreateWishlistByCustomerId/{customerId}")]
        public async Task<ActionResult<Wishlist>> GetOrCreateWishlistByCustomerId(int customerId)
        {
            var wishlist = await _context.Wishlists.FirstOrDefaultAsync(c => c.Customer_id == customerId);
            if (wishlist == null)
            {
                // Check if a Wishlist already exists for the given customerId
                var existingWishlist = await _context.Wishlists.FirstOrDefaultAsync(w => w.Customer_id == customerId);
                if (existingWishlist != null)
                {
                    return Ok(existingWishlist);
                }

                wishlist = new Wishlist { Customer_id = customerId };
                _context.Wishlists.Add(wishlist);
                await _context.SaveChangesAsync();
            }
            return Ok(wishlist);
        }

    }
}
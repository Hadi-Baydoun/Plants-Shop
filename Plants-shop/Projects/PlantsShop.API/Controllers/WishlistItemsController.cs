using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantsShop.API.Models;

namespace PlantsShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WishlistItemsController : ControllerBase
    {
        private readonly PlantsshopdbContext _context;

        public WishlistItemsController(PlantsshopdbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IEnumerable<WishlistItems>> GetAllWishlistItems()
        {
            return await _context.WishlistItems
                .Include(c => c.Product)
                    .ThenInclude(p => p.SubCategories)
                        .ThenInclude(sc => sc.Category)
                .Include(c => c.Wishlist)
                    .ThenInclude(wishlist => wishlist.Customer)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<WishlistItems>> GetWishlistItem(int id)
        {
            var wishlistItem = await _context.WishlistItems
                .Include(c => c.Product)
                    .ThenInclude(p => p.SubCategories)
                        .ThenInclude(sc => sc.Category)
                .Include(c => c.Wishlist)
                    .ThenInclude(wishlist => wishlist.Customer)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (wishlistItem == null)
                return NotFound("Wishlist Item Not Found");

            return Ok(wishlistItem);
        }

        [HttpPost("add")]
        public async Task<ActionResult<WishlistItems>> AddWishlisttItem(WishlistItems wishlistItem)
        {
            // Find the existing Product
            var product = await _context.Products
                .Include(p => p.SubCategories)
                .ThenInclude(sc => sc.Category)
                .FirstOrDefaultAsync(p => p.Id == wishlistItem.Product_id);

            // Find the existing Wishlist
            var wishlist = await _context.Wishlists
                .Include(c => c.Customer)
                .FirstOrDefaultAsync(c => c.Id == wishlistItem.Wishlist_id);

            // If the Product or Wishlist doesn't exist, return NotFound
            if (product == null || wishlist == null)
                return NotFound("Product or Wishlist not found.");

            // Associate the new WishlistItem with the existing Product and Wishlist
            wishlistItem.Product = product;
            wishlistItem.Wishlist = wishlist;

            _context.WishlistItems.Add(wishlistItem);
            await _context.SaveChangesAsync();

            // Eager loading the related data
            return Ok(await _context.WishlistItems
                .Include(c => c.Product)
                .ThenInclude(p => p.SubCategories)
                .ThenInclude(sc => sc.Category)
                .Include(c => c.Wishlist)
                .ThenInclude(wishlist => wishlist.Customer)
                .ToListAsync());
        }


        [HttpGet("getByCustomerId/{customerId}")]
        public async Task<ActionResult<Wishlist>> GetWishlistByCustomerId(int customerId)
        {
            var wishlist = await _context.Wishlists.FirstOrDefaultAsync(c => c.Customer_id == customerId);
            if (wishlist == null)
                return NotFound("Wishlist not found for this customer.");
            return Ok(wishlist);
        }

        [HttpGet("getByWishlistId/{wishlistId}")]
        public async Task<IEnumerable<WishlistItems>> GetWishlistItemsByWishlisttId(int wishlistId)
        {
            return await _context.WishlistItems
                .Include(c => c.Product)
                    .ThenInclude(p => p.SubCategories)
                        .ThenInclude(sc => sc.Category)
                .Include(c => c.Wishlist)
                    .ThenInclude(wishlist => wishlist.Customer)
                .Where(c => c.Wishlist_id == wishlistId)
                .ToListAsync();
        }


        [HttpPut("update")]
        public async Task<ActionResult<WishlistItems>> UpdateWishlistItem(WishlistItems updateWishlistItem)
        {
            var dbWishlistItem = await _context.WishlistItems.FindAsync(updateWishlistItem.Id);
            if (dbWishlistItem == null)
                return NotFound("WishlistItem Not Found");

            // Update the  product id
            dbWishlistItem.Product_id = updateWishlistItem.Product_id;

            // Find the product to get the price for total calculation
            var product = await _context.Products.FindAsync(updateWishlistItem.Product_id);

            await _context.SaveChangesAsync();

            // Eager loading the address data
            return Ok(await _context.WishlistItems.Include(c => c.Product).Include(c => c.Wishlist).ToListAsync());
        }


        [HttpDelete("delete/{id}")]
        public async Task<ActionResult<WishlistItems>> DeleteWishlistItem(int id)
        {
            var dbWishlistItem = await _context.WishlistItems.FindAsync(id);
            if (dbWishlistItem == null)
                return NotFound("Wishlist Item Not Found");
            _context.WishlistItems.Remove(dbWishlistItem);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
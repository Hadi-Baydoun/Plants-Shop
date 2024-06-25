using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantsShop.API.Models;

namespace PlantsShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly PlantsshopdbContext _context;

        public ProductsController(PlantsshopdbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IEnumerable<Product>> GetAllProducts()
        {
            return await _context.Products
                .Include(p => p.SubCategories)
                    .ThenInclude(sc => sc.Category)
                .ToListAsync();
        }



        [HttpGet("details/{id}")]
        public async Task<ActionResult<Product>> GetProductDetails(int id)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound("Product Not Found");

            return Ok(product);
        }




        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.SubCategories)
                    .ThenInclude(sc => sc.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound("Product Not Found");

            return Ok(product);
        }


        [HttpPost("add")]
public async Task<ActionResult<Product>> AddProducts(Product product)
{
    // Find the existing SubCategory and Category
    var subCategory = await _context.SubCategory.FindAsync(product.Sub_categories_id);

    // Associate the new Product with the existing SubCategory and Category
    product.SubCategories = subCategory;

    _context.Products.Add(product);
    await _context.SaveChangesAsync();

    // Eager loading the product data
    return Ok(await _context.Products.Include(c => c.SubCategories).ToListAsync());
}

        [HttpPut("update")]
        public async Task<ActionResult<Product>> UpdateProducts(Product updateProduct)
        {
            var dbProduct = await _context.Products.FindAsync(updateProduct.Id);

            if (dbProduct == null)
                return NotFound("Product Not Found");

            // Check if the SubCategory_id has changed
            if (dbProduct.Sub_categories_id != updateProduct.Sub_categories_id)
            {
                // Retrieve the new SubCategory
                var newSubCategory = await _context.SubCategory.FindAsync(updateProduct.Sub_categories_id);
                if (newSubCategory == null)
                    return NotFound("Sub Category not found.");

                // Update the SubCategory_id
                dbProduct.Sub_categories_id = updateProduct.Sub_categories_id;
            }

            // Update other properties
            dbProduct.Name = updateProduct.Name;
            dbProduct.Description = updateProduct.Description;
            dbProduct.Price = updateProduct.Price;
            dbProduct.Rating = updateProduct.Rating;
            dbProduct.Quantity = updateProduct.Quantity;
            dbProduct.Image_url = updateProduct.Image_url;

            // Mark the entity as modified
            _context.Entry(dbProduct).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(updateProduct.Id))
                    return NotFound("Product Not Found");
                else
                    throw;
            }

            // Eager loading the SubCategories data
            return Ok(await _context.Products.Include(p => p.SubCategories).ToListAsync());
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }

        [HttpDelete("delete")]
        public async Task<ActionResult<Product>> DeleteProducts(int id)
        {
            var dbProduct = await _context.Products.FindAsync(id);
            if (dbProduct == null)
                return NotFound("Products Not Found");
            _context.Products.Remove(dbProduct);
            await _context.SaveChangesAsync();
            // Eager loading the address data
            return Ok(await _context.Products.Include(c => c.SubCategories).ToListAsync());
        }

    }
}
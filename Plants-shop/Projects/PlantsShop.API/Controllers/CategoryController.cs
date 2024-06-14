using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantsShop.API.Models;

namespace PlantsShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly PlantsshopdbContext _context;

        public CategoryController(PlantsshopdbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IEnumerable<Category>> GetAllCategories()
        {
            return await _context.Categories.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
            if (category == null)
                return NotFound("Customer Not Found");
            return Ok(category);
        }

        [HttpPost("add")]
        public async Task<ActionResult<Category>> AddCategory(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            // Eager loading the address data
            return Ok(await _context.Categories.ToListAsync());
        }

        [HttpPut("update")]
        public async Task<ActionResult<Category>> UpdateCategory(Category updateCategory)
        {
            var dbCategory = await _context.Categories.FindAsync(updateCategory.Id);
            if (dbCategory == null)
                return NotFound("Category Not Found");
            dbCategory.Name = updateCategory.Name;

            await _context.SaveChangesAsync();

            // Eager loading the address data
            return Ok(await _context.Categories.ToListAsync());
        }

        [HttpDelete("delete")]
        public async Task<ActionResult<Category>> DeleteCategory(int id)
        {
            var dbCategory = await _context.Categories.FindAsync(id);
            if (dbCategory == null)
                return NotFound("Category Not Found");
            _context.Categories.Remove(dbCategory);
            await _context.SaveChangesAsync();
            // Eager loading the address data
            return Ok(await _context.Categories.ToListAsync());
        }

    }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantsShop.API.Models;

namespace PlantsShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubCategoriesController : ControllerBase
    {
        private readonly PlantsshopdbContext _context;

        public SubCategoriesController(PlantsshopdbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IEnumerable<SubCategories>> GetAllSubCategory()
        {
            return await _context.SubCategory.Include(c => c.Category).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SubCategories>> GetSubCategory(int id)
        {
            var customer = await _context.SubCategory.Include(c => c.Category).FirstOrDefaultAsync(c => c.Id == id);
            if (customer == null)
                return NotFound("SubCategory Not Found");
            return Ok(customer);
        }


        [HttpPost("add")]
        public async Task<ActionResult<SubCategories>> AddSubCategory(SubCategories subCategory)
        {
            // Find the existing Category
            var category = await _context.Categories.FindAsync(subCategory.Category_id);

            // If the Category doesn't exist, return NotFound
            if (category == null)
                return NotFound("Category not found.");

            // Set the Category navigation property
            subCategory.Category = category;

            _context.SubCategory.Add(subCategory);
            await _context.SaveChangesAsync();

            // Return the added SubCategory without eager loading the related data
            return Ok(subCategory);
        }


        [HttpPut("update")]
        public async Task<ActionResult<SubCategories>> UpdateSubCategory(SubCategories updateSubCategory)
        {
            var dbSubCategory = await _context.SubCategory.FindAsync(updateSubCategory.Id);
            if (dbSubCategory == null)
                return NotFound("SubCategory Not Found");
            dbSubCategory.Name = updateSubCategory.Name;

            await _context.SaveChangesAsync();

            // Eager loading the address data
            return Ok(await _context.SubCategory.Include(c => c.Category).ToListAsync());
        }

        [HttpDelete("delete")]
        public async Task<ActionResult<SubCategories>> DeleteCustomer(int id)
        {
            var dbSubCategory = await _context.SubCategory.FindAsync(id);
            if (dbSubCategory == null)
                return NotFound("SubCategory Not Found");
            _context.SubCategory.Remove(dbSubCategory);
            await _context.SaveChangesAsync();
            // Eager loading the address data
            return Ok(await _context.SubCategory.Include(c => c.Category).ToListAsync());
        }

    }
}
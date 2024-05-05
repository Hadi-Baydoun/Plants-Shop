using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantsShop.API.Models;

namespace PlantsShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly PlantsshopdbContext _context;

        public CustomerController(PlantsshopdbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IEnumerable<Customer>> GetAllCustomers()
        {
            return await _context.Customers.Include(c => c.Address).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            var customer = await _context.Customers.Include(c => c.Address).FirstOrDefaultAsync(c => c.Id == id);
            if (customer == null)
                return NotFound("Customer Not Found");
            return Ok(customer);
        }

        [HttpPost("add")]
        public async Task<ActionResult<Customer>> AddCustomer(Customer customer)
        {
            // If the AddressId is provided, find the existing Address
            if (customer.Address_id != null)
            {
                var address = await _context.Address.FindAsync(customer.Address_id);
                if (address == null)
                    return NotFound("Address not found.");

                // Associate the Address with the new Customer
                customer.Address = address;
            }

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            // Eager loading the address data
            var savedCustomer = await _context.Customers
                .Include(c => c.Address)
                .FirstOrDefaultAsync(c => c.Id == customer.Id); // Include other related entities if needed

            return Ok(savedCustomer);
        }


        [HttpPut("update")]
        public async Task<ActionResult<Customer>> UpdateCustomer(Customer updateCustomer)
        {
            var dbCustomer = await _context.Customers.FindAsync(updateCustomer.Id);
            if (dbCustomer == null)
                return NotFound("Customer Not Found");

            // Check if the address exists in the Address table
            var address = await _context.Address.FindAsync(updateCustomer.Address_id);
            if (address == null)
                return BadRequest("Invalid Address ID");

            // Update the Address_id property
            dbCustomer.Address_id = updateCustomer.Address_id;

            // Update other properties
            dbCustomer.First_Name = updateCustomer.First_Name;
            dbCustomer.Last_Name = updateCustomer.Last_Name;
            dbCustomer.Email = updateCustomer.Email;
            dbCustomer.Password = updateCustomer.Password;
            dbCustomer.Phone_Number = updateCustomer.Phone_Number;

            // Mark the entity as modified
            _context.Entry(dbCustomer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(updateCustomer.Id))
                    return NotFound("Customer Not Found");
                else
                    throw;
            }

            // Eager loading the address data
            return Ok(await _context.Customers.Include(c => c.Address).ToListAsync());
        }

        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.Id == id);
        }

        [HttpDelete("delete")]
        public async Task<ActionResult<Customer>> DeleteCustomer(int id)
        {
            var dbCustomer = await _context.Customers.FindAsync(id);
            if (dbCustomer == null)
                return NotFound("Customer Not Found");
            _context.Customers.Remove(dbCustomer);
            await _context.SaveChangesAsync();
            // Eager loading the address data
            return Ok(await _context.Customers.Include(c => c.Address).ToListAsync());
        }

    }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantsShop.API.Models;

namespace PlantsShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShopOrderController : ControllerBase
    {
        private readonly PlantsshopdbContext _context;

        public ShopOrderController(PlantsshopdbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IEnumerable<ShopOrder>> GetAllOrders()
        {
            return await _context.ShopOrders.Include(c => c.Address).Include(c=>c.Customer).Include(c=>c.OrderStatus).Include(c => c.PaymnetMethods).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ShopOrder>> GetOrder(int id)
        {
            var shoporder = await _context.ShopOrders.Include(c => c.Address).Include(c => c.Customer).Include(c => c.OrderStatus).Include(c => c.PaymnetMethods).FirstOrDefaultAsync(c => c.Id == id);
            if (shoporder == null)
                return NotFound("Order Not Found");
            return Ok(shoporder);
        }

        [HttpPost("add")]
        public async Task<ActionResult<ShopOrder>> AddOrder(ShopOrder shopOrder)
        {
            // Find the existing Customer
            var customer = await _context.Customers.FindAsync(shopOrder.Customer_id);

            // If the Customer doesn't exist, return NotFound
            if (customer == null)
                return NotFound("Customer not found.");

            // Set the Customer navigation property
            shopOrder.Customer = customer;

            // If the AddressId is provided, set the AddressId property
            if (shopOrder.Address_id != 0)
            {
                // Check if the Address with the provided Id exists
                var addressExists = await _context.Address.AnyAsync(a => a.Id == shopOrder.Address_id);
                if (!addressExists)
                    return NotFound("Address not found.");

                // Associate the AddressId with the new ShopOrder
                shopOrder.Address = null; // Setting Address navigation property to null
            }

            // If the OrderStatusId is provided, set the OrderStatusId property
            if (shopOrder.Order_Status_id != null)
            {
                // Check if the OrderStatus with the provided Id exists
                var orderStatusExists = await _context.Orderstatus.AnyAsync(os => os.Id == shopOrder.Order_Status_id);
                if (!orderStatusExists)
                    return NotFound("Order status not found.");

                // Associate the OrderStatusId with the new ShopOrder
                shopOrder.OrderStatus = null; // Setting OrderStatus navigation property to null
            }

            // If the PaymentMethodId is provided, set the PaymentMethodId property
            if (shopOrder.Payment_Methods_id != null)
            {
                // Check if the PaymentMethod with the provided Id exists
                var paymentMethodExists = await _context.paymnetmethods.AnyAsync(pm => pm.Id == shopOrder.Payment_Methods_id);
                if (!paymentMethodExists)
                    return NotFound("Payment method not found.");

                // Associate the PaymentMethodId with the new ShopOrder
                shopOrder.PaymnetMethods = null; // Setting PaymentMethods navigation property to null
            }

            _context.ShopOrders.Add(shopOrder);
            await _context.SaveChangesAsync();

            // Return the added ShopOrder without eager loading the related data
            return Ok(shopOrder);
        }



        [HttpPut("update")]
        public async Task<ActionResult<ShopOrder>> UpdateOrder(ShopOrder updateShopOrder)
        {
            var dbShopOrder = await _context.ShopOrders.FindAsync(updateShopOrder.Id);
            if (dbShopOrder == null)
                return NotFound("Order Not Found");

            // Check if the related entities exist
            var customer = await _context.Customers.FindAsync(updateShopOrder.Customer_id);
            if (customer == null)
                return BadRequest("Invalid Customer ID");

            var address = await _context.Address.FindAsync(updateShopOrder.Address_id);
            if (address == null)
                return BadRequest("Invalid Address ID");

            var orderStatus = await _context.Orderstatus.FindAsync(updateShopOrder.Order_Status_id);
            if (orderStatus == null)
                return BadRequest("Invalid Order Status ID");

            var paymentMethod = await _context.paymnetmethods.FindAsync(updateShopOrder.Payment_Methods_id);
            if (paymentMethod == null)
                return BadRequest("Invalid Payment Method ID");

            // Update the foreign key properties
            dbShopOrder.Customer_id = updateShopOrder.Customer_id;
            dbShopOrder.Address_id = updateShopOrder.Address_id;
            dbShopOrder.Order_Status_id = updateShopOrder.Order_Status_id;
            dbShopOrder.Payment_Methods_id = updateShopOrder.Payment_Methods_id;

            // Update other properties
            dbShopOrder.Order_Total = updateShopOrder.Order_Total;
            dbShopOrder.Order_Date = updateShopOrder.Order_Date;

            // Mark the entity as modified
            _context.Entry(dbShopOrder).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShopOrderExists(updateShopOrder.Id))
                    return NotFound("Order Not Found");
                else
                    throw;
            }

            // Eager loading the related data
            return Ok(await _context.ShopOrders
                .Include(c => c.Address)
                .Include(c => c.Customer)
                .Include(c => c.OrderStatus)
                .Include(c => c.PaymnetMethods)
                .ToListAsync());
        }

        private bool ShopOrderExists(int id)
        {
            return _context.ShopOrders.Any(e => e.Id == id);
        }

        [HttpDelete("delete")]
        public async Task<ActionResult<ShopOrder>> DeleteOrder(int id)
        {
            var dbShopOrder = await _context.ShopOrders.FindAsync(id);
            if (dbShopOrder == null)
                return NotFound("Order Not Found");
            _context.ShopOrders.Remove(dbShopOrder);
            await _context.SaveChangesAsync();
            // Eager loading the address data
            return Ok(await _context.ShopOrders.Include(c => c.Address).Include(c => c.Customer).Include(c => c.OrderStatus).Include(c => c.PaymnetMethods).ToListAsync());
        }

    }
}
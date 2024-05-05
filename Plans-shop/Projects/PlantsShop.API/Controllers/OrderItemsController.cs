using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PlantsShop.API.Models;

namespace PlantsShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderItemsController : ControllerBase
    {
        private readonly PlantsshopdbContext _context;

        public OrderItemsController(PlantsshopdbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IEnumerable<OrderItems>> GetAllOrderItems()
        {
            return await _context.orderitems
                .Include(c => c.Product)
                    .ThenInclude(p => p.SubCategories)
                        .ThenInclude(sc => sc.Category)
                .Include(c => c.ShopOrder)
                    .ThenInclude(so => so.Address)
                .Include(c => c.ShopOrder)
                    .ThenInclude(so => so.Customer)
                .Include(c => c.ShopOrder)
                    .ThenInclude(so => so.OrderStatus)
                .Include(c => c.ShopOrder)
                    .ThenInclude(so => so.PaymnetMethods)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderItems>> GetOrderItems(int id)
        {
            var orderitems = await _context.orderitems
                .Include(c => c.Product)
                    .ThenInclude(p => p.SubCategories)
                        .ThenInclude(sc => sc.Category)
                .Include(c => c.ShopOrder)
                    .ThenInclude(so => so.Address)
                .Include(c => c.ShopOrder)
                    .ThenInclude(so => so.Customer)
                .Include(c => c.ShopOrder)
                    .ThenInclude(so => so.OrderStatus)
                .Include(c => c.ShopOrder)
                    .ThenInclude(so => so.PaymnetMethods)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (orderitems == null)
                return NotFound("Order Items Not Found");

            return Ok(orderitems);
        }

        [HttpPost("add")]
        public async Task<ActionResult<OrderItems>> AddOrderItems(OrderItems orderitem)
        {
            // Find the existing Product
            var product = await _context.Products.FindAsync(orderitem.Product_id);

            // If the Product doesn't exist, return NotFound
            if (product == null)
                return NotFound("Product not found.");

            // Calculate the total price based on the product's price and quantity
            var totalPrice = product.Price * orderitem.Quantity;

            // Set the calculated price to the Price property of the OrderItems
            orderitem.Price = totalPrice;

            // Associate the new OrderItems with the existing Product
            orderitem.Product = product;

            // Remove ShopOrder navigation property to prevent changes in ShopOrder table
            orderitem.ShopOrder = null;

            _context.orderitems.Add(orderitem);
            await _context.SaveChangesAsync();

            // Eager loading the related data
            return Ok(await _context.orderitems
                .Include(oi => oi.Product)
                    .ThenInclude(p => p.SubCategories)
                        .ThenInclude(sc => sc.Category)
                .Include(oi => oi.ShopOrder)
                    .ThenInclude(so => so.Customer)
                        .ThenInclude(customer => customer.Address)
                .ToListAsync());
        }


        [HttpPut("update")]
        public async Task<ActionResult<OrderItems>> UpdateOrder(OrderItems updateOrderItems)
        {
            var dbOrderItems = await _context.orderitems
                .Include(oi => oi.Product)
                .Include(oi => oi.ShopOrder)
                .FirstOrDefaultAsync(oi => oi.Id == updateOrderItems.Id);

            if (dbOrderItems == null)
                return NotFound("Order Items Not Found");

            // Check if the ShopOrder_id has changed
            if (dbOrderItems.Shop_Order_id != updateOrderItems.Shop_Order_id)
            {
                // Retrieve the new ShopOrder
                var newShopOrder = await _context.ShopOrders.FindAsync(updateOrderItems.Shop_Order_id);
                if (newShopOrder == null)
                    return NotFound("Shop Order not found.");

                // Update the ShopOrder
                dbOrderItems.ShopOrder = newShopOrder;
            }

            // Update the Quantity
            dbOrderItems.Quantity = updateOrderItems.Quantity;

            // Check if the Product_id has changed
            if (dbOrderItems.Product_id != updateOrderItems.Product_id)
            {
                // Retrieve the new Product
                var newProduct = await _context.Products.FindAsync(updateOrderItems.Product_id);
                if (newProduct == null)
                    return NotFound("Product not found.");

                // Update the Product and Price
                dbOrderItems.Product = newProduct;
                dbOrderItems.Price = newProduct.Price * dbOrderItems.Quantity;
            }
            else
            {
                // Recalculate the Price based on the existing Product and updated Quantity
                if (dbOrderItems.Quantity.HasValue && dbOrderItems.Product != null)
                {
                    dbOrderItems.Price = dbOrderItems.Product.Price * dbOrderItems.Quantity.Value;
                }
            }

            // Mark the entity as modified
            _context.Entry(dbOrderItems).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderItemsExists(updateOrderItems.Id))
                    return NotFound("Order Items Not Found");
                else
                    throw;
            }

            // Eager loading the related data
            return Ok(await _context.orderitems
                .Include(oi => oi.Product)
                .ThenInclude(p => p.SubCategories)
                .ThenInclude(sc => sc.Category)
                .Include(oi => oi.ShopOrder)
                .ToListAsync());
        }

        private bool OrderItemsExists(int id)
        {
            return _context.orderitems.Any(e => e.Id == id);
        }





        [HttpDelete("delete")]
        public async Task<ActionResult<OrderItems>> DeleteOrder(int id)
        {
            var dbOrderItems = await _context.orderitems.FindAsync(id);
            if (dbOrderItems == null)
                return NotFound("Order Items Not Found");

            _context.orderitems.Remove(dbOrderItems);
            await _context.SaveChangesAsync();
            // Eager loading the address data
            return Ok(await _context.orderitems
                .Include(c => c.Product)
                    .ThenInclude(p => p.SubCategories)
                        .ThenInclude(sc => sc.Category)
                .Include(c => c.ShopOrder)
                .ToListAsync());
        }

    }
}
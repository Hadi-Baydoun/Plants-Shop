namespace PlantsShop.API.Models
{
    public class CartItemDto
    {
        public int Id { get; set; }


        public int? Quantity { get; set; }

        public decimal? Total { get; set; }

        public int Product_id { get; set; }
     

        public int Cart_id { get; set; }
      
    }
}

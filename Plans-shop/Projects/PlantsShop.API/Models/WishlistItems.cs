namespace PlantsShop.API.Models;

public partial class WishlistItems
{
    public int Id { get; set; }

    public int Product_id { get; set; }
    public Product Product { get; set; } = null!;

    public int Wishlist_id { get; set; }
    public Wishlist Wishlist { get; set; } = null!;
}


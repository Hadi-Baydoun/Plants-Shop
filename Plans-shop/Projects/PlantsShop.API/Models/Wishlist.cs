using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net;

namespace PlantsShop.API.Models;

public partial class Wishlist
{
    public int Id { get; set; }
    public int? Quantity { get; set; }
    public decimal? Price { get; set; }
    public int Customer_id { get; set; }
    public Customer Customer { get; set; } = null!;
    public int Product_id { get; set; }
    public Product Product { get; set; } = null!;
}


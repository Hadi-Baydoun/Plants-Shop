using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net;

namespace PlantsShop.API.Models;

public partial class OrderItems
{
    public int Id { get; set; }

    public int? Quantity { get; set; }
    public decimal? Price { get; set; }
    public int Product_id { get; set; }
    public Product Product { get; set; } = null!;

    public int Shop_Order_id { get; set; }
    public ShopOrder ShopOrder { get; set; } = null!;

}


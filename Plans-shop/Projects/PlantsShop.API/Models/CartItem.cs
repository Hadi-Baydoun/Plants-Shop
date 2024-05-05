using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net;

namespace PlantsShop.API.Models;

public partial class CartItem
{
    public int Id { get; set; }


    public int? Quantity { get; set; } 

    public decimal? Total { get; set; } 

    public int Product_id { get; set; }
    public Product Product { get; set; } = null!;

    public int Cart_id { get; set; }
    public Cart Cart { get; set; } = null!;
}


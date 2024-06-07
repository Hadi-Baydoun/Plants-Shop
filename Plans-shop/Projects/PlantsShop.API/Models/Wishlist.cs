using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net;

namespace PlantsShop.API.Models;

public partial class Wishlist
{
    public int Id { get; set; }
    public int Customer_id { get; set; }
    public Customer Customer { get; set; } = null!;


}


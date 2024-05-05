using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net;

namespace PlantsShop.API.Models;

public partial class OrderStatus
{
    public int Id { get; set; }
    public string Status { get; set; } = null!;

}


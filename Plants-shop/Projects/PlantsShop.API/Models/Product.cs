using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net;

namespace PlantsShop.API.Models;

public partial class Product
{
    public int Id { get; set; }

    public string? Description { get; set; } 
    public string? Image_url { get; set; }

    public int Quantity { get; set; }

    public string Name { get; set; } = null!;

    public decimal Price { get; set; }
    public decimal Rating { get; set; }


    public int Sub_categories_id { get; set; }
    public SubCategories SubCategories { get; set; } = null!;

}


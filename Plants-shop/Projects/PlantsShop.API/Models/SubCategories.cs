using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net;

namespace PlantsShop.API.Models;

public partial class SubCategories
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int Category_id { get; set; }
    public Category Category { get; set; } = null!;
}


using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net;

namespace PlantsShop.API.Models;

public partial class Category
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

}


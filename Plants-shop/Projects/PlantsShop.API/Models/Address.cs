using System;
using System.Collections.Generic;
using System.Net;
namespace PlantsShop.API.Models
{
    public partial class Address
    {
        public int Id { get; set; }

        public string city { get; set; } = null!;
        public string region { get; set; } = null!;
        public string address { get; set; } = null!;
        public string street_number { get; set; } = null!;

        public string? postal_code { get; set; }
        public int Customer_id { get; set; }
        public Customer Customer { get; set; } = null!;
    }
}

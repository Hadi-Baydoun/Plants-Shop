using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net;

namespace PlantsShop.API.Models;

public partial class ShopOrder
{
    public int Id { get; set; }

    public DateTime? Order_Date { get; set; } 
    public decimal? Order_Total { get; set; }

    public int Address_id { get; set; }
    public Address Address { get; set; } = null!;

    public int Customer_id { get; set; }
    public Customer Customer { get; set; } = null!;

    public int? Order_Status_id { get; set; }
    public OrderStatus? OrderStatus { get; set; } 

    public int? Payment_Methods_id { get; set; }
    public PaymnetMethods? PaymnetMethods { get; set; } 

}



namespace PlantsShop.API.Models;

public partial class Customer
{
    public int Id { get; set; }

    public string First_Name { get; set; } = null!;
    public string Last_Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string Phone_Number { get; set; } = null!;

    public int Address_id { get; set; }
    public Address Address { get; set; } = null!;
}
    

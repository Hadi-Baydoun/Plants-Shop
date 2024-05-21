using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;


namespace PlantsShop.API.Models;

public partial class PlantsshopdbContext : DbContext
{
    public PlantsshopdbContext()
    {
    }

    public PlantsshopdbContext(DbContextOptions<PlantsshopdbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Customer> Customers { get; set; }
    public virtual DbSet<Address> Address { get; set; }
    public virtual DbSet<Cart> Carts { get; set; }

    public virtual DbSet<Category> Categories { get; set; }
    public virtual DbSet<SubCategories> SubCategory { get; set; }
    public virtual DbSet<Product> Products { get; set; }
    public virtual DbSet<Admin> Admins { get; set; }
    public virtual DbSet<CartItem> CartItems { get; set; }
    public virtual DbSet<OrderStatus> Orderstatus { get; set; }
    public virtual DbSet<PaymnetMethods> paymnetmethods { get; set; }
    public virtual DbSet<ShopOrder> ShopOrders { get; set; }
    public virtual DbSet<OrderItems> orderitems { get; set; }
    public virtual DbSet<Wishlist> Wishlists { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;port=3306;database=plantsshopdb;user=root;password=C.ronaldo777", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.28-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.ToTable("customer");
            entity.HasKey(e => e.Id).HasName("PRIMARY");
            entity.Property(e => e.Email).IsRequired();
            entity.Property(e => e.First_Name).IsRequired();
            entity.Property(e => e.Last_Name).IsRequired();
            entity.Property(e => e.Password).IsRequired();
            entity.Property(e => e.Phone_Number).IsRequired();
        });
        modelBuilder.Entity<Address>(entity =>
        {
            entity.ToTable("address");
            entity.HasKey(e => e.Id).HasName("PRIMARY");
            entity.Property(e => e.city).IsRequired();
            entity.Property(e => e.region).IsRequired();
            entity.Property(e => e.address).IsRequired();
            entity.Property(e => e.street_number).IsRequired();
            entity.Property(e => e.postal_code).HasMaxLength(10);
            entity.HasOne(c => c.Customer)
                  .WithMany() // Assuming a cart can be associated with multiple customers
                  .HasForeignKey(c => c.Customer_id) // Specify the foreign key property
                  .OnDelete(DeleteBehavior.Restrict); // or other desired behavior
        });
        modelBuilder.Entity<Cart>(entity =>
        {
            entity.ToTable("cart"); // Define the table name
            entity.HasKey(e => e.Id).HasName("PRIMARY"); // Define the primary key

            // Define foreign key relationship with Customer entity
            entity.HasOne(c => c.Customer)
                  .WithMany() // Assuming a cart can be associated with multiple customers
                  .HasForeignKey(c => c.Customer_id) // Specify the foreign key property
                  .OnDelete(DeleteBehavior.Restrict); // or other desired behavior
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("category"); // Define the table name
            entity.HasKey(e => e.Id).HasName("PRIMARY"); // Define the primary key
            entity.Property(e => e.Name).IsRequired();

        });

        modelBuilder.Entity<SubCategories>(entity =>
        {
            entity.ToTable("sub_categories"); 
            entity.HasKey(e => e.Id).HasName("PRIMARY"); // Define the primary key
            entity.Property(e => e.Name).IsRequired();
            entity.HasOne(c => c.Category)
                  .WithMany() // Assuming a cart can be associated with multiple customers
                  .HasForeignKey(c => c.Category_id) // Specify the foreign key property
                  .OnDelete(DeleteBehavior.Restrict); // or other desired behavior

        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("product");
            entity.HasKey(e => e.Id).HasName("PRIMARY"); // Define the primary key
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.Description);
            entity.Property(e => e.Image_url);
            entity.Property(e => e.Quantity);
            entity.Property(e => e.Price);
            entity.Property(e => e.Rating);
            entity.HasOne(c => c.SubCategories)
                  .WithMany() // Assuming a cart can be associated with multiple customers
                  .HasForeignKey(c => c.Sub_categories_id) // Specify the foreign key property
                  .OnDelete(DeleteBehavior.Restrict); // or other desired behavior

        });

        modelBuilder.Entity<Admin>(entity =>
        {
            entity.ToTable("admin"); // Define the table name
            entity.HasKey(e => e.Id).HasName("PRIMARY"); // Define the primary key
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.Password).IsRequired();
            entity.Property(e => e.Email).IsRequired();

        });

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.ToTable("cart_items"); // Define the table name
            entity.HasKey(e => e.Id).HasName("PRIMARY"); // Define the primary key
            entity.Property(e => e.Total);
            entity.Property(e => e.Quantity);
            entity.HasOne(c => c.Product)
                  .WithMany() // Assuming a cart can be associated with multiple customers
                  .HasForeignKey(c => c.Product_id) // Specify the foreign key property
                  .OnDelete(DeleteBehavior.Restrict); // or other desired behavior
            entity.HasOne(c => c.Cart)
                  .WithMany() // Assuming a cart can be associated with multiple customers
                  .HasForeignKey(c => c.Cart_id) // Specify the foreign key property
                  .OnDelete(DeleteBehavior.Restrict); // or other desired behavior

        });
        modelBuilder.Entity<OrderStatus>(entity =>
        {
            entity.ToTable("order_status"); // Define the table name
            entity.HasKey(e => e.Id).HasName("PRIMARY"); // Define the primary key
            entity.Property(e => e.Status).IsRequired();

        });
        modelBuilder.Entity<PaymnetMethods>(entity =>
        {
            entity.ToTable("payment_methods"); // Define the table name
            entity.HasKey(e => e.Id).HasName("PRIMARY"); // Define the primary key
            entity.Property(e => e.Type).IsRequired();

        });

        modelBuilder.Entity<ShopOrder>(entity =>
        {
            entity.ToTable("shop_order"); // Define the table name
            entity.HasKey(e => e.Id).HasName("PRIMARY"); // Define the primary key
            entity.Property(e => e.Order_Date);
            entity.Property(e => e.Order_Total);
            entity.HasOne(c => c.Customer)
                  .WithMany() // Assuming a cart can be associated with multiple customers
                  .HasForeignKey(c => c.Customer_id) // Specify the foreign key property
                  .OnDelete(DeleteBehavior.Restrict); // or other desired behavior
            entity.HasOne(c => c.Address)
                  .WithMany() // Assuming a cart can be associated with multiple customers
                  .HasForeignKey(c => c.Address_id) // Specify the foreign key property
                  .OnDelete(DeleteBehavior.Restrict); // or other desired behavior
            entity.HasOne(c => c.OrderStatus)
                  .WithMany() // Assuming a cart can be associated with multiple customers
                  .HasForeignKey(c => c.Order_Status_id) // Specify the foreign key property
                  .OnDelete(DeleteBehavior.Restrict); // or other desired behavior
            entity.HasOne(c => c.PaymnetMethods)
                  .WithMany() // Assuming a cart can be associated with multiple customers
                  .HasForeignKey(c => c.Payment_Methods_id) // Specify the foreign key property
                  .OnDelete(DeleteBehavior.Restrict); // or other desired behavior

        });
        modelBuilder.Entity<OrderItems>(entity =>
        {
            entity.ToTable("order_items"); // Define the table name
            entity.HasKey(e => e.Id).HasName("PRIMARY"); // Define the primary key
            entity.Property(e => e.Price);
            entity.Property(e => e.Quantity);
            entity.HasOne(c => c.ShopOrder)
                  .WithMany() // Assuming a cart can be associated with multiple customers
                  .HasForeignKey(c => c.Shop_Order_id) // Specify the foreign key property
                  .OnDelete(DeleteBehavior.Restrict); // or other desired behavior
            entity.HasOne(c => c.Product)
                  .WithMany() // Assuming a cart can be associated with multiple customers
                  .HasForeignKey(c => c.Product_id) // Specify the foreign key property
                  .OnDelete(DeleteBehavior.Restrict); // or other desired behavior

        });
        modelBuilder.Entity<Wishlist>(entity =>
        {
            entity.ToTable("wishlist"); // Define the table name
            entity.HasKey(e => e.Id).HasName("PRIMARY"); // Define the primary key
            entity.Property(e => e.Price);
            entity.Property(e => e.Quantity);
            entity.HasOne(c => c.Product)
                  .WithMany() // Assuming a cart can be associated with multiple customers
                  .HasForeignKey(c => c.Product_id) // Specify the foreign key property
                  .OnDelete(DeleteBehavior.Restrict); // or other desired behavior
            entity.HasOne(c => c.Customer)
                  .WithMany() // Assuming a cart can be associated with multiple customers
                  .HasForeignKey(c => c.Customer_id) // Specify the foreign key property
                  .OnDelete(DeleteBehavior.Restrict); // or other desired behavior

        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

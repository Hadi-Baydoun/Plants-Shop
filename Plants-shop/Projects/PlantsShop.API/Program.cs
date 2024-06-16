using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PlantsShop.API.Models;
using PlantsShop.API.Utilities; // Import the namespace for the KeyGenerator class
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Generate a new encryption key
var key = KeyGenerator.GenerateEncryptionKey();

// Add the new encryption key to the configuration
builder.Configuration["Jwt:Key"] = key;

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<PlantsshopdbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"), new MySqlServerVersion(new Version(8, 0, 28))));
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policyBuilder =>
    {
        policyBuilder.AllowAnyOrigin()
                     .AllowAnyMethod()
                     .AllowAnyHeader();
    });
});

// JWT Authentication Configuration
var jwtKey = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"]);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options => // Add JWT bearer token authentication
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;  // Save the token in the AuthenticationProperties after a successful authentication
    options.TokenValidationParameters = new TokenValidationParameters // Set the token validation parameters
    {
        ValidateIssuerSigningKey = true, // Validate the signing key to ensure the token's integrity
        IssuerSigningKey = new SymmetricSecurityKey(jwtKey), // Set the signing key used to validate the token
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication(); // Add authentication middleware
app.UseAuthorization();

app.MapControllers();
app.Run();

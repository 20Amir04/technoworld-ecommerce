using Microsoft.EntityFrameworkCore;
using E_commerce_backend.Models;
using System.Collections.Generic;

namespace E_commerce_backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<CartItem> Carts { get; set; } = null!;
        public DbSet<WishlistItem> Wishlists { get; set; } = null!;
    }
}
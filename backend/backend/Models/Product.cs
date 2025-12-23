using System.ComponentModel.DataAnnotations.Schema;

namespace E_commerce_backend.Models
{
    public class Product
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public string Subcategory {  get; set; } = string.Empty;

        public string? About { get; set; }

        public string? Highlights { get; set; }
    }
}
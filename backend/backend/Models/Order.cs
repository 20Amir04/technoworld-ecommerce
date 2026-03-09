using System.ComponentModel.DataAnnotations;

namespace E_commerce_backend.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [MaxLength(32)]
        public string Status { get; set; } = "Placed";

        public decimal Subtotal { get; set; }
        public decimal Delivery { get; set; }
        public decimal Tax { get; set; }
        public decimal Total { get; set; }

        [MaxLength(100)] public string FullName { get; set; } = "";
        [MaxLength(120)] public string Email { get; set; } = "";
        [MaxLength(30)] public string Phone { get; set; } = "";

        [MaxLength(120)] public string Address1 { get; set; } = "";
        [MaxLength(120)] public string? Address2 { get; set; } = "";
        [MaxLength(60)] public string City { get; set; } = "";
        [MaxLength(60)] public string Province { get; set; } = "";
        [MaxLength(20)] public string PostalCode { get; set; } = "";
        [MaxLength(60)] public string Country { get; set; } = "";

        [MaxLength(20)] public string PaymentMethod { get; set; } = "Card";
        [MaxLength(4)] public string CardLast4 { get; set; } = "";
        [MaxLength(20)] public string? CardBand { get; set; }

        public List<OrderItem> Items { get; set; } = new();


    }
}

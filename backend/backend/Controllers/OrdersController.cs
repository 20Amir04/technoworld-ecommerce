using E_commerce_backend.Data;
using E_commerce_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;
using System.Security.Claims;

namespace E_commerce_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context) 
        {
            _context = context;
        }

        private int GetUserId()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userIdStr)) 
            {
                throw new UnauthorizedAccessException("Missing user id claim");
            }
            return int.Parse(userIdStr);
        }
        
        public record CheckoutRequest(
            [Required(AllowEmptyStrings = false)]
            string FullName,
            [Required(AllowEmptyStrings = false)]
            string Email,
            [Required(AllowEmptyStrings = false)]
            string Phone,
            [Required(AllowEmptyStrings = false)]
            string Address1,
            [Optional]
            string? Address2,
            [Required(AllowEmptyStrings = false)]
            string City,
            [Required(AllowEmptyStrings = false)]
            string Province,
            [Required(AllowEmptyStrings = false)]
            string PostalCode,
            [Required(AllowEmptyStrings = false)]
            string Country,
            [Required(AllowEmptyStrings = false)]
            string CardNumber,
            [Required(AllowEmptyStrings = false)]
            string Exp,
            [Required(AllowEmptyStrings = false)]
            string Cvc
            );

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest req)
        {
            var userId = GetUserId();

           var cart = await _context.Carts
                .Where(c => c.UserId == userId)
                .Include(c => c.Product)
                .ToListAsync();

            if (cart.Count == 0)
                return BadRequest("Cart is Empty");

            var subtotal = cart.Sum(x => x.Product!.Price * x.Quantity);
            var delivery = subtotal > 1000 ? 0m : 9.99m;
            var tax = subtotal * 0.13m;
            var total = subtotal + delivery + tax;

            var last4 = req.CardNumber.Length >= 4 ? req.CardNumber[^4..] : "";

            var order = new Order
            {
                UserId = userId,
                Status = "Placed",
                Subtotal = subtotal,
                Delivery = delivery,
                Tax = tax,
                Total = total,

                FullName = req.FullName,
                Email = req.Email,
                Phone = req.Phone,
                Address1 = req.Address1,
                Address2 = req.Address2,
                City = req.City,
                Province = req.Province,
                PostalCode = req.PostalCode,
                Country = string.IsNullOrWhiteSpace(req.Country) ? "Canada" : req.Country,

                PaymentMethod = "Card",
                CardLast4 = last4,
                CardBand = null,
            };

            foreach (var line in cart)
            {
                var p = line.Product!;
                order.Items.Add(new OrderItem
                {
                    ProductId = p.Id,
                    NameSnapshot = p.Name,
                    UnitPriceSnapshot = p.Price,
                    Quantity = line.Quantity,
                    LineTotal = p.Price * line.Quantity
                });
            }

            _context.Orders.Add(order);

            _context.Carts.RemoveRange(cart);

            await _context.SaveChangesAsync();

            return Ok(new { orderId = order.Id });
        }

        [HttpGet]
        public async Task<IActionResult> MyOrders()
        {
            var userId = GetUserId();

            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    o.Id,
                    o.CreatedAt,
                    o.Status,
                    o.Total,
                    o.Subtotal,
                    o.Delivery,
                    o.Tax,
                    itemsCount = o.Items.Count
                })
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> OrderDetails(int id)
        {
            var userId = GetUserId();

            var order = await _context.Orders
                .Where(o => o.Id == id && o.UserId == userId)
                .Include(o => o.Items)
                .FirstOrDefaultAsync();

            if (order == null) return NotFound();

            return Ok(new
            {
                order.Id,
                order.CreatedAt,
                order.Status,
                order.Subtotal,
                order.Delivery,
                order.Tax,
                order.Total,
                order.FullName,
                order.Email,
                order.Phone,
                order.Address1,
                order.Address2,
                order.City,
                order.Province,
                order.PostalCode,
                order.Country,
                order.PaymentMethod,
                order.CardLast4,
                items = order.Items.Select(i => new
                {
                    i.ProductId,
                    i.NameSnapshot,
                    i.UnitPriceSnapshot,
                    i.Quantity,
                    i.LineTotal
                })
            });
        }
    }
}

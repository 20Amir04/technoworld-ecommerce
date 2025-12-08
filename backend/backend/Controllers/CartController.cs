using E_commerce_backend.Data;
using E_commerce_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_commerce_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        public class CartItemRequest
        {
            public int UserId { get; set; }
            public int ProductId { get; set; }
            public int Quantity { get; set; }
        }

        [HttpGet]
        public async Task<IActionResult> GetCart([FromQuery] int userId)
        {
            var items = await _context.Carts
                .Include(c => c.Product)
                .Where(c => c.UserId == userId)
                .ToListAsync();

            var result = items.Select(c => new
            {
                c.Id,
                c.UserId,
                c.ProductId,
                c.Quantity,
                Product = c.Product == null ? null : new
                {
                    c.Product.Name,
                    c.Product.Price,
                    c.Product.ImageUrl,
                    c.Product.Category
                }
            });

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] CartItemRequest request)
        {
            var existing = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserId == request.UserId && c.ProductId == request.ProductId);

            if (existing != null)
            {
                existing.Quantity += request.Quantity;
            }
            else
            {
                var item = new CartItem
                {
                    UserId = request.UserId,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity
                };
                _context.Carts.Add(item);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuantity(int id, [FromBody] CartItemRequest request)
        {
            var item = await _context.Carts.FindAsync(id);
            if (item == null) return NotFound();

            item.Quantity = request.Quantity;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var item = await _context.Carts.FindAsync(id);
            if (item == null) return NotFound();

            _context.Carts.Remove(item);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}

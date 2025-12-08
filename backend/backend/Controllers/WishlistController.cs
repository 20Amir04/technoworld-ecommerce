using E_commerce_backend.Data;
using E_commerce_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_commerce_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WishlistController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WishlistController(AppDbContext context)
        {
            _context = context;
        }

        public class WishlistRequest
        {
            public int UserId { get; set; }
            public int ProductId { get; set; }
        }

        [HttpGet]
        public async Task<IActionResult> GetWishlist([FromQuery] int userId)
        {
            var items = await _context.Wishlists
                .Include(w => w.Product)
                .Where(w => w.UserId == userId)
                .ToListAsync();

            var result = items.Select(w => new
            {
                w.Id,
                w.UserId,
                w.ProductId,
                Product = w.Product == null ? null : new
                {
                    w.Product.Name,
                    w.Product.Price,
                    w.Product.ImageUrl,
                    w.Product.Category
                }
            });

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddToWishlist([FromBody] WishlistRequest request)
        {
            var existing = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == request.UserId && w.ProductId == request.ProductId);

            if (existing != null)
                return BadRequest("Product is already in wishlist.");

            var item = new WishlistItem
            {
                UserId = request.UserId,
                ProductId = request.ProductId
            };

            _context.Wishlists.Add(item);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromWishlist(int id)
        {
            var item = await _context.Wishlists.FindAsync(id);
            if (item == null) return NotFound();

            _context.Wishlists.Remove(item);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}

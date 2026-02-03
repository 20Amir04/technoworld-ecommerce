using E_commerce_backend.Data;
using E_commerce_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace E_commerce_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userIdStr))
                throw new UnauthorizedAccessException("Missing user id claim");

            return int.Parse(userIdStr);
        }

        public record AddCartRequest(int ProductId, int Quantity);

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = GetUserId();

            var items = await _context.Carts
                .Where(c => c.UserId == userId)
                .Include(c => c.Product)
                .ToListAsync();

            var result = items.Select(c => new
            {
                c.ProductId,
                c.Quantity,
                Product = c.Product
            });

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] AddCartRequest req)
        {
            var userId = GetUserId();

            if (req.ProductId <= 0) return BadRequest("Invalid productId");
            if (req.Quantity <= 0) return BadRequest("Quantity must be >= 1");

            var productExists = await _context.Products.AnyAsync(p => p.Id == req.ProductId);
            if (!productExists) return NotFound("Product not found");

            var existing = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == req.ProductId);

            if (existing != null)
            {
                existing.Quantity += req.Quantity;
            }
            else
            {
                _context.Carts.Add(new CartItem
                {
                    UserId = userId,
                    ProductId = req.ProductId,
                    Quantity = req.Quantity
                });
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        public record UpdateQtyRequest(int Quantity);

        [HttpPatch("{productId:int}")]
        public async Task<IActionResult> UpdateQuantity(int productId, [FromBody] UpdateQtyRequest req)
        {
            var userId = GetUserId();
            if (req.Quantity <= 0) return BadRequest("Quantity must be >= 1");

            var item = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

            if (item == null) return NotFound();

            item.Quantity = req.Quantity;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{productId:int}")]
        public async Task<IActionResult> RemoveItem(int productId)
        {
            var userId = GetUserId();

            var item = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

            if (item == null) return NotFound();

            _context.Carts.Remove(item);

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Clear()
        {
            var userId = GetUserId();

            var items = await _context.Carts.Where(c => c.UserId == userId).ToListAsync();

            _context.Carts.RemoveRange(items);

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}

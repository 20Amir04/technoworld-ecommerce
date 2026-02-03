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
    public class WishlistController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WishlistController(AppDbContext context)
        {
            _context = context;
        }
    
        [HttpGet]
        public async Task<IActionResult> GetWishlist()
        {
            var userId = GetUserId();

            var products = await _context.Wishlists
                .Where(w => w.UserId == userId)
                .Include(w => w.Product)
                .Select(w => w.Product!)
                .ToListAsync();
           

            return Ok(products);
        }

        [HttpPost("{productId:int}")]
        public async Task<IActionResult> AddToWishlist(int productId)
        {
            var userId = GetUserId();

            var exists = await _context.Wishlists
                .AnyAsync(w => w.UserId == userId && w.ProductId == productId);

            if (exists)
                return Conflict("Product is already in wishlist.");

            var productExists = await _context.Products.AnyAsync(p => p.Id == productId);
            if (!productExists) return NotFound("Product not found!");

            _context.Wishlists.Add(new WishlistItem
            {
                UserId = userId,
                ProductId = productId
            });

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{productId:int}")]
        public async Task<IActionResult> RemoveFromWishlist(int productId)
        {
            var userId = GetUserId();

            var item = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

            if (item == null) return NotFound();

            _context.Wishlists.Remove(item);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Clear()
        {
            var userId = GetUserId();
            
            var items = await _context.Wishlists.Where(w  => w.UserId == userId).ToListAsync();

            if (items.Count == 0)
                return Ok();

            _context.Wishlists.RemoveRange(items);

            await _context.SaveChangesAsync();
            return Ok();
        }

        private int GetUserId()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userIdStr))
                throw new UnauthorizedAccessException("Missing user id claim.");

            return int.Parse(userIdStr);
        }
    }
}

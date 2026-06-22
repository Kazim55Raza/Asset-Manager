using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AssetManager.API.Data;
using AssetManager.API.Models;
using AssetManager.API.DTOs;

namespace AssetsManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssetsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AssetsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Asset>>> GetAssets( 
            [FromQuery] string? search, 
            [FromQuery] string? filterBy, 
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10    )
        {
           var query = _context.Assets.Include(a => a.Employee).AsQueryable();

           if(!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(a=> (a.Name != null && a.Name.Contains(search)) || 
                                 (a.SerialNumber != null && a.SerialNumber.Contains(search)));

            }
            if (!string.IsNullOrWhiteSpace(filterBy))
            {
                 query = query.Where(a=> a.Name.StartsWith(filterBy));  
            }
            if(pageNumber<1) pageNumber= 1;
            if (pageSize<1 || pageSize >50)
            {
                pageSize = 10;
            }

            var recordsToSkip =(pageNumber -1)* pageSize;
            var assets = await query.Skip(recordsToSkip).Take(pageSize).ToListAsync();

            var assetsDTOs = assets.Select(a=> new AssetDTO
            {
                Id = a.Id,
                Name = a.Name,
                SerialNumber = a.SerialNumber,
                Price = a.Price,
                EmployeeId = a.EmployeeId,
                AssignedToEmployee = a.Employee != null ? 
                $"{a.Employee.FirstName} {a.Employee.LastName}" : "Unassigned"
            }).ToList();
            return Ok(assetsDTOs);
           
            // return await _context.Assets.ToListAsync();

        }
        [HttpGet("summary")]
        public async Task<ActionResult<AssetSummaryDTO>> GetSummary()
        {

            var totalAssetsCount =await _context.Assets.CountAsync();
            var totalAssetsValue = await _context.Assets.SumAsync(a=> a.Price);
            var unAssignedCount =await _context.Assets.CountAsync(a=> a.EmployeeId == null || a.EmployeeId == 0);
            // var assignedCount =await _context.Assets.CountAsync(a=> a.EmployeeId != null && a.EmployeeId != 0);
            var assignedCount = totalAssetsCount - unAssignedCount;
            
            var summary = new AssetSummaryDTO
            {
                TotalAssetsCount = totalAssetsCount,
                TotalAssetsValue = totalAssetsValue,
                UnassignedAssetCount = unAssignedCount,
                AssignedAssetCount = assignedCount
                
            };
            Console.WriteLine($"Assigned Assets Count: {summary.AssignedAssetCount}");


            return Ok(summary);

        }

        [HttpPost]
        public async Task<ActionResult<Asset>> CreateAsset(Asset asset)
        {
           _context.Assets.Add(asset);
           await _context.SaveChangesAsync();   
            return Ok(asset);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Asset>> UpdateAsset(int id, Asset asset)
        {
            if(id != asset.Id) 
            return BadRequest("Id Mismatch");
        
        _context.Entry(asset).State = EntityState.Modified;
            try
            {
           await _context.SaveChangesAsync();

            }
            catch(DbUpdateConcurrencyException)
            {
                if(!_context.Assets.Any(e => e.Id ==id)) return NotFound();
                else throw; 
            }


           return NoContent();

        //    _context.Assets.Add(asset);
        //     return Ok(asset);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAsset(int id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if(asset == null)
            {
                return NotFound();
            }

            _context.Assets.Remove(asset);
            await _context.SaveChangesAsync();


            return NoContent();

        }


    }
}
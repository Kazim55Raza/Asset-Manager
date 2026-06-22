using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AssetManager.API.Data;
using AssetManager.API.Models;
using AssetManager.API.DTOs;

namespace AssetManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public EmployeesController(AppDbContext context)
        {
            _context = context;
        }
        // GET: api/employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees(
            [FromQuery] string? search,
            [FromQuery] int pageNumber=1,
            [FromQuery] int pageSize=10

        )
        {
        var query = _context.Employees.AsQueryable();


            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(e=> (e.FirstName != null && e.FirstName.Contains(search))||
                                        (e.LastName != null && e.LastName.Contains(search))||
                                        (e.Email != null && e.Email.Contains(search)));

            }
            if(pageNumber<1) pageNumber=1;
            if(pageSize<1 || pageSize>50) pageSize=10;

            var recordsToSkip = (pageNumber -1)*pageSize;
            var employees = await query.Skip(recordsToSkip).Take(pageSize).ToListAsync();
            // var totalEmployees = await _context.Employees.CountAsync();
            var employeDTOs = employees.Select(e => new EmployeeDTO
            {
                Id = e.Id,
                // TotalEmployee = totalEmployees,

                FullName = $"{e.FirstName} {e.LastName}",
                Email =e.Email
            }).ToList();
            return Ok(employeDTOs);


            // return await _context.Employees.ToListAsync();
        }

        [HttpGet("summary")]
    public async Task<ActionResult<EmployeeSummaryDTO>> GetEmployeeSummary()
    {
        var totalCount = await _context.Employees.CountAsync();

        var summaryDto = new EmployeeSummaryDTO
        {
            TotalEmployees = totalCount
        };

        return Ok(summaryDto);
    }

        // GET: api/employees/{id}
        [HttpPost]
        public async Task<ActionResult<Employee>> CreateEmployee([FromBody]Employee employee){
            if(employee == null) return BadRequest("Employee data is null");
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEmployees), new{id= employee.Id},employee);
            // return Ok(employee);

        }

         [HttpPut("{id}")]
        public async Task<ActionResult<Asset>> UpdateEmployee(int id,[FromBody] Employee employee)
        {
            if(id != employee.Id) 
            return BadRequest("Id Mismatch");
        
        _context.Entry(employee).State = EntityState.Modified;
            try
            {
           await _context.SaveChangesAsync();

            }
            catch(DbUpdateConcurrencyException)
            {
                if(!_context.Employees.Any(e => e.Id ==id)) return NotFound();
                else throw; 
            }


           return NoContent();

        //    _context.Employees.Add(employee);
        //     return Ok(employee);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult>  DeleteEmployee(int id)
        {
            var employe = await _context.Employees.FindAsync(id);
            if(employe == null)
            {
                return NotFound();

            }
          
          _context.Employees.Remove(employe);
          await _context.SaveChangesAsync();
          return NoContent();


        }
    }


}
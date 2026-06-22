using Microsoft.EntityFrameworkCore;
using AssetManager.API.Models;

namespace AssetManager.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Asset> Assets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1. Seed Fake Employees
        modelBuilder.Entity<Employee>().HasData(
            new Employee { Id = 1, FirstName = "Kazim", LastName = "Raza", Email = "kazim@csnainc.com" },
            new Employee { Id = 2, FirstName = "Ali", LastName = "Haider", Email = "ali.haider@gmail.com" },
            new Employee { Id = 3, FirstName = "Zainab", LastName = "Khan", Email = "zainab@company.com" }
        );

        // 2. Seed Fake Assets (Link them to EmployeeIds that exist above!)
        modelBuilder.Entity<Asset>().HasData(
            new Asset { Id = 1, Name = "Hp Core i5 8Gen", SerialNumber = "HP12345", Price = 45999.00m, EmployeeId = 1 },
            new Asset { Id = 2, Name = "MacBook Pro M2", SerialNumber = "MAC9988", Price = 185000.00m, EmployeeId = 2 },
            new Asset { Id = 3, Name = "Dell Latitude", SerialNumber = "DEL7766", Price = 65000.00m, EmployeeId = 1 },
            new Asset { Id = 4, Name = "ThinkPad E14", SerialNumber = "THINK44", Price = 89000.00m, EmployeeId = 3 },
            new Asset { Id = 5, Name = "Linux Desktop", SerialNumber = "LNX890", Price = 99000.00m, EmployeeId = 2 }
        );
    }
    }
}
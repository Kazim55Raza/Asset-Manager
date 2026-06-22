using System.ComponentModel.DataAnnotations;

namespace AssetManager.API.Models
{
    public class Asset
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Name is mandatory.")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 50 characters.")]
        public string Name { get; set; } = string.Empty;
        [Required(ErrorMessage = "Serial number is mandatory.")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Serial number must be between 2 and 50 characters.")]
        public string SerialNumber { get; set; } = string.Empty;
        [Required(ErrorMessage = "Price is mandatory.")]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be a positive number.")]
        public decimal Price { get; set; }
        public int? EmployeeId { get; set; }
        public Employee? Employee { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;
namespace AssetManager.API.Models
{
    public class Employee
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "First name is mandatory.")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "First name must be between 2 and 50 characters.")]
        public string FirstName { get; set; } = string.Empty;
        [Required(ErrorMessage = "Last name is mandatory.")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Last name must be between 2 and 50 characters.")]
        public string LastName { get; set; } = string.Empty;
        [Required(ErrorMessage = "Email is mandatory.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string Email { get; set; } = string.Empty;
        public List<Asset> Assets { get; set; } = new List<Asset>();
    }
}
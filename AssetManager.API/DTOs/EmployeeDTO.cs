namespace AssetManager.API.DTOs
{
    public class EmployeeDTO
    {
        public int Id { get; set; }
        public int TotalEmployee { get; set; }
        public string? FullName { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
    }
}
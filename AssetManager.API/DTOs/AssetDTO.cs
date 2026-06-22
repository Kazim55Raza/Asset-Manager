namespace AssetManager.API.DTOs;
public class AssetDTO
{
    public int Id { get; set; }
    public string? Name { get; set; } = string.Empty;
    public string? SerialNumber { get; set; } = string.Empty;   
    public decimal Price {get; set;}
    public int? EmployeeId {get; set;}
    public string AssignedToEmployee {get; set;} = string.Empty;

}
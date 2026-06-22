namespace AssetManager.API.DTOs;
public class AssetSummaryDTO
{
    public  int TotalAssetsCount { get; set; }
    public decimal TotalAssetsValue { get; set; }
    public int UnassignedAssetCount { get; set; }
    public int AssignedAssetCount { get; set; }
}
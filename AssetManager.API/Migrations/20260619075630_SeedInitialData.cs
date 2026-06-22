using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AssetManager.API.Migrations
{
    /// <inheritdoc />
    public partial class SeedInitialData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Employees",
                columns: new[] { "Id", "Email", "FirstName", "LastName" },
                values: new object[,]
                {
                    { 1, "kazim@csnainc.com", "Kazim", "Raza" },
                    { 2, "ali.haider@gmail.com", "Ali", "Haider" },
                    { 3, "zainab@company.com", "Zainab", "Khan" }
                });

            migrationBuilder.InsertData(
                table: "Assets",
                columns: new[] { "Id", "EmployeeId", "Name", "Price", "SerialNumber" },
                values: new object[,]
                {
                    { 1, 1, "Hp Core i5 8Gen", 45999.00m, "HP12345" },
                    { 2, 2, "MacBook Pro M2", 185000.00m, "MAC9988" },
                    { 3, 1, "Dell Latitude", 65000.00m, "DEL7766" },
                    { 4, 3, "ThinkPad E14", 89000.00m, "THINK44" },
                    { 5, 2, "Linux Desktop", 99000.00m, "LNX890" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Assets",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Assets",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Assets",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Assets",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Assets",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Employees",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Employees",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Employees",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}

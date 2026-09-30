using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JewerlyApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class added_sales_date_indexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Sales_CustomerId",
                table: "Sales");

            migrationBuilder.CreateIndex(
                name: "IX_Sales_CreatedDate",
                table: "Sales",
                column: "CreatedDate");

            migrationBuilder.CreateIndex(
                name: "IX_Sales_CustomerId_CreatedDate",
                table: "Sales",
                columns: new[] { "CustomerId", "CreatedDate" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Sales_CreatedDate",
                table: "Sales");

            migrationBuilder.DropIndex(
                name: "IX_Sales_CustomerId_CreatedDate",
                table: "Sales");

            migrationBuilder.CreateIndex(
                name: "IX_Sales_CustomerId",
                table: "Sales",
                column: "CustomerId");
        }
    }
}

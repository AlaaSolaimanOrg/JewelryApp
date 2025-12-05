using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JewerlyApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class added_repaircode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RepairCode",
                table: "Repairs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RepairCode",
                table: "Repairs");
        }
    }
}

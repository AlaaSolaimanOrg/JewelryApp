using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JewerlyApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class added_deposit_paid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "DepositPaid",
                table: "RepairItems",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DepositPaid",
                table: "RepairItems");
        }
    }
}

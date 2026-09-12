using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JewerlyApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addedRepairPickup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "CancelledDate",
                table: "Repairs",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Notified",
                table: "Repairs",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateOnly>(
                name: "NotifiedDate",
                table: "Repairs",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PayMethod",
                table: "Repairs",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CancelledDate",
                table: "Repairs");

            migrationBuilder.DropColumn(
                name: "Notified",
                table: "Repairs");

            migrationBuilder.DropColumn(
                name: "NotifiedDate",
                table: "Repairs");

            migrationBuilder.DropColumn(
                name: "PayMethod",
                table: "Repairs");
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JewerlyApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addedpickupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "PickedUpDate",
                table: "Repairs",
                type: "date",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PickedUpDate",
                table: "Repairs");
        }
    }
}

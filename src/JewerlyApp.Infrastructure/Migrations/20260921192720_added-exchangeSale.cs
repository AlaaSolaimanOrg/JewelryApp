using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JewerlyApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addedexchangeSale : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ExchangeSaleId",
                table: "Returns",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Returns_ExchangeSaleId",
                table: "Returns",
                column: "ExchangeSaleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Returns_Sales_ExchangeSaleId",
                table: "Returns",
                column: "ExchangeSaleId",
                principalTable: "Sales",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Returns_Sales_ExchangeSaleId",
                table: "Returns");

            migrationBuilder.DropIndex(
                name: "IX_Returns_ExchangeSaleId",
                table: "Returns");

            migrationBuilder.DropColumn(
                name: "ExchangeSaleId",
                table: "Returns");
        }
    }
}

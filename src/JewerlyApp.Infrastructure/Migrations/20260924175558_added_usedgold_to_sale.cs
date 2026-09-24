using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JewerlyApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class added_usedgold_to_sale : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SaleId",
                table: "UsedGoldPurchases",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UsedGoldPurchases_SaleId",
                table: "UsedGoldPurchases",
                column: "SaleId");

            migrationBuilder.AddForeignKey(
                name: "FK_UsedGoldPurchases_Sales_SaleId",
                table: "UsedGoldPurchases",
                column: "SaleId",
                principalTable: "Sales",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UsedGoldPurchases_Sales_SaleId",
                table: "UsedGoldPurchases");

            migrationBuilder.DropIndex(
                name: "IX_UsedGoldPurchases_SaleId",
                table: "UsedGoldPurchases");

            migrationBuilder.DropColumn(
                name: "SaleId",
                table: "UsedGoldPurchases");
        }
    }
}

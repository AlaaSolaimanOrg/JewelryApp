using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JewerlyApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updatetoreturnItemstablename : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReturnItem_Returns_ReturnId",
                table: "ReturnItem");

            migrationBuilder.DropForeignKey(
                name: "FK_ReturnItem_SaleItems_SaleItemId",
                table: "ReturnItem");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ReturnItem",
                table: "ReturnItem");

            migrationBuilder.RenameTable(
                name: "ReturnItem",
                newName: "ReturnItems");

            migrationBuilder.RenameIndex(
                name: "IX_ReturnItem_SaleItemId",
                table: "ReturnItems",
                newName: "IX_ReturnItems_SaleItemId");

            migrationBuilder.RenameIndex(
                name: "IX_ReturnItem_ReturnId",
                table: "ReturnItems",
                newName: "IX_ReturnItems_ReturnId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ReturnItems",
                table: "ReturnItems",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ReturnItems_Returns_ReturnId",
                table: "ReturnItems",
                column: "ReturnId",
                principalTable: "Returns",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ReturnItems_SaleItems_SaleItemId",
                table: "ReturnItems",
                column: "SaleItemId",
                principalTable: "SaleItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReturnItems_Returns_ReturnId",
                table: "ReturnItems");

            migrationBuilder.DropForeignKey(
                name: "FK_ReturnItems_SaleItems_SaleItemId",
                table: "ReturnItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ReturnItems",
                table: "ReturnItems");

            migrationBuilder.RenameTable(
                name: "ReturnItems",
                newName: "ReturnItem");

            migrationBuilder.RenameIndex(
                name: "IX_ReturnItems_SaleItemId",
                table: "ReturnItem",
                newName: "IX_ReturnItem_SaleItemId");

            migrationBuilder.RenameIndex(
                name: "IX_ReturnItems_ReturnId",
                table: "ReturnItem",
                newName: "IX_ReturnItem_ReturnId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ReturnItem",
                table: "ReturnItem",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ReturnItem_Returns_ReturnId",
                table: "ReturnItem",
                column: "ReturnId",
                principalTable: "Returns",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ReturnItem_SaleItems_SaleItemId",
                table: "ReturnItem",
                column: "SaleItemId",
                principalTable: "SaleItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

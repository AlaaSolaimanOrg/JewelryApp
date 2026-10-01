using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JewerlyApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addusedgold : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UsedGoldPurchaseId",
                table: "CashTransactions",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "UsedGoldPurchases",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SerialNumber = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    CustomerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CustomerName = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    CustomerPhone = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    PayMethod = table.Column<int>(type: "int", nullable: false),
                    TotalWeight = table.Column<decimal>(type: "decimal(18,3)", precision: 18, scale: 3, nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    LastUpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastUpdatedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsedGoldPurchases", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UsedGoldPurchases_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UsedGoldPurchaseItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PurchaseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Karat = table.Column<int>(type: "int", nullable: false),
                    Weight = table.Column<decimal>(type: "decimal(18,3)", precision: 18, scale: 3, nullable: false),
                    PricePerGram = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Subtotal = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    LastUpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastUpdatedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsedGoldPurchaseItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UsedGoldPurchaseItems_UsedGoldPurchases_PurchaseId",
                        column: x => x.PurchaseId,
                        principalTable: "UsedGoldPurchases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CashTransactions_UsedGoldPurchaseId",
                table: "CashTransactions",
                column: "UsedGoldPurchaseId");

            migrationBuilder.CreateIndex(
                name: "IX_UsedGoldPurchaseItems_PurchaseId",
                table: "UsedGoldPurchaseItems",
                column: "PurchaseId");

            migrationBuilder.CreateIndex(
                name: "IX_UsedGoldPurchases_CustomerId",
                table: "UsedGoldPurchases",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_UsedGoldPurchases_SerialNumber",
                table: "UsedGoldPurchases",
                column: "SerialNumber",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_CashTransactions_UsedGoldPurchases_UsedGoldPurchaseId",
                table: "CashTransactions",
                column: "UsedGoldPurchaseId",
                principalTable: "UsedGoldPurchases",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CashTransactions_UsedGoldPurchases_UsedGoldPurchaseId",
                table: "CashTransactions");

            migrationBuilder.DropTable(
                name: "UsedGoldPurchaseItems");

            migrationBuilder.DropTable(
                name: "UsedGoldPurchases");

            migrationBuilder.DropIndex(
                name: "IX_CashTransactions_UsedGoldPurchaseId",
                table: "CashTransactions");

            migrationBuilder.DropColumn(
                name: "UsedGoldPurchaseId",
                table: "CashTransactions");
        }
    }
}

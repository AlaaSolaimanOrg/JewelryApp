using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JewerlyApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class added_repair_to_cashtransaction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "RepairId",
                table: "CashTransactions",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CashTransactions_RepairId",
                table: "CashTransactions",
                column: "RepairId");

            migrationBuilder.AddForeignKey(
                name: "FK_CashTransactions_Repairs_RepairId",
                table: "CashTransactions",
                column: "RepairId",
                principalTable: "Repairs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CashTransactions_Repairs_RepairId",
                table: "CashTransactions");

            migrationBuilder.DropIndex(
                name: "IX_CashTransactions_RepairId",
                table: "CashTransactions");

            migrationBuilder.DropColumn(
                name: "RepairId",
                table: "CashTransactions");
        }
    }
}

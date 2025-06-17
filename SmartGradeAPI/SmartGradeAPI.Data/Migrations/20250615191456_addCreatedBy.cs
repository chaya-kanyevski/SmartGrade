using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartGradeAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class addCreatedBy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "ChatTopics");

            migrationBuilder.AddColumn<int>(
                name: "CreatedById",
                table: "ChatTopics",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChatTopics_CreatedById",
                table: "ChatTopics",
                column: "CreatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatTopics_Users_CreatedById",
                table: "ChatTopics",
                column: "CreatedById",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatTopics_Users_CreatedById",
                table: "ChatTopics");

            migrationBuilder.DropIndex(
                name: "IX_ChatTopics_CreatedById",
                table: "ChatTopics");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "ChatTopics");

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "ChatTopics",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}

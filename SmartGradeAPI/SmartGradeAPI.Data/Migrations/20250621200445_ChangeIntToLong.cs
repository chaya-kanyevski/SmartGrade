using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartGradeAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeIntToLong : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
    name: "Size",
    table: "Files",
    type: "bigint",
    nullable: false,
    oldClrType: typeof(int),
    oldType: "int");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
    name: "Size",
    table: "Files",
    type: "int",
    nullable: false,
    oldClrType: typeof(long),
    oldType: "bigint");
        }
    }
}

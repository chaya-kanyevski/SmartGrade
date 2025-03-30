using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartGradeAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class deleteAnswerAndChangeOthers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Answers");

            migrationBuilder.RenameColumn(
                name: "Created_at",
                table: "Exam",
                newName: "CreatedAt");

            migrationBuilder.AddColumn<string>(
                name: "Answer",
                table: "Questions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "QuestionNumber",
                table: "Questions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Value",
                table: "Questions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "StudentEmail",
                table: "ExamsUploads",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StudentName",
                table: "ExamsUploads",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SubmissionNumber",
                table: "ExamsUploads",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "ExamDto",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ExampleExamPath",
                table: "Exam",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Answer",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "QuestionNumber",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "Value",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "StudentEmail",
                table: "ExamsUploads");

            migrationBuilder.DropColumn(
                name: "StudentName",
                table: "ExamsUploads");

            migrationBuilder.DropColumn(
                name: "SubmissionNumber",
                table: "ExamsUploads");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "ExamDto");

            migrationBuilder.DropColumn(
                name: "ExampleExamPath",
                table: "Exam");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Exam",
                newName: "Created_at");

            migrationBuilder.CreateTable(
                name: "Answers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ExamId = table.Column<int>(type: "int", nullable: false),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false),
                    QuestionNumber = table.Column<int>(type: "int", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Value = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Answers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Answers_Exam_ExamId",
                        column: x => x.ExamId,
                        principalTable: "Exam",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Answers_ExamId",
                table: "Answers",
                column: "ExamId");
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace EmojiExtensionBackend.Migrations
{
    public partial class InitDatabase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "marker",
                columns: table => new
                {
                    ID = table.Column<Guid>(nullable: false),
                    DOCUMENT_URI = table.Column<string>(nullable: true),
                    LINE = table.Column<int>(nullable: false),
                    CONTENT = table.Column<string>(nullable: true),
                    IS_DELETED = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_marker", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "score",
                columns: table => new
                {
                    ID = table.Column<Guid>(nullable: false),
                    Score = table.Column<float>(nullable: false),
                    USER = table.Column<string>(nullable: true),
                    markerId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_score", x => x.ID);
                    table.ForeignKey(
                        name: "FK_score_marker_markerId",
                        column: x => x.markerId,
                        principalTable: "marker",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_score_markerId",
                table: "score",
                column: "markerId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "score");

            migrationBuilder.DropTable(
                name: "marker");
        }
    }
}

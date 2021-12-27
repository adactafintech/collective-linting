using Microsoft.EntityFrameworkCore.Migrations;

namespace EmojiExtensionBackend.Migrations
{
    public partial class AddedOriginToLocation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "REPOSITORY",
                table: "marker",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "REPOSITORY",
                table: "marker");
        }
    }
}

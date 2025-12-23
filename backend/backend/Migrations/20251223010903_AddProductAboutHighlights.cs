using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_commerce_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddProductAboutHighlights : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "About",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Highlights",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "About",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Highlights",
                table: "Products");

        }
    }
}

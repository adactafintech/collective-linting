﻿// <auto-generated />
using System;
using EmojiExtensionBackend.DAL;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace EmojiExtensionBackend.Migrations
{
    [DbContext(typeof(EmojiContext))]
    [Migration("20211203120222_AddedOriginToLocation")]
    partial class AddedOriginToLocation
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.20")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("EmojiExtensionBackend.DTO.DTO_EmojiMarker", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("ID")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Content")
                        .HasColumnName("CONTENT")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DocumentURI")
                        .HasColumnName("DOCUMENT_URI")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Line")
                        .HasColumnName("LINE")
                        .HasColumnType("int");

                    b.Property<string>("Repository")
                        .HasColumnName("REPOSITORY")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("SoftDelete")
                        .HasColumnName("IS_DELETED")
                        .HasColumnType("bit");

                    b.HasKey("Id");

                    b.ToTable("marker");
                });

            modelBuilder.Entity("EmojiExtensionBackend.DTO.DTO_EmojiScore", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("ID")
                        .HasColumnType("uniqueidentifier");

                    b.Property<float>("Score")
                        .HasColumnType("real");

                    b.Property<string>("User")
                        .HasColumnName("USER")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid?>("markerId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("markerId");

                    b.ToTable("score");
                });

            modelBuilder.Entity("EmojiExtensionBackend.DTO.DTO_EmojiScore", b =>
                {
                    b.HasOne("EmojiExtensionBackend.DTO.DTO_EmojiMarker", "Marker")
                        .WithMany()
                        .HasForeignKey("markerId");
                });
#pragma warning restore 612, 618
        }
    }
}

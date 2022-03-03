using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace EmojiExtensionBackend.DTO
{
    public class DTO_EmojiMarker
    {
        [Column("ID")]
        public Guid Id { get; set; }

        //TODO: add unique identifier for documentUri and Line
        [JsonProperty("documentUri")]
        [Column("DOCUMENT_URI")]
        public string DocumentURI { get; set; }

        [JsonProperty("repository")]
        [Column("REPOSITORY")]
        public string Repository { get; set; }

        [JsonProperty("Line")]
        [Column("LINE")]
        public int Line { get; set; }

        [JsonProperty("content")]
        [Column("CONTENT")]
        public string Content { get; set; }

        [JsonProperty("softDelete")]
        [Column("IS_DELETED")]
        public bool SoftDelete { get; set; }

        [JsonProperty("resolved")]
        [Column("RESOLVED")]
        public bool Resolved = true;

        [JsonProperty("isSupressed")]
        [Column("IS_SUPRESSED")]
        public bool IsSupressed = false;

        [NotMapped]
        public DTO_ScoreOccurence[] scores;

        public DTO_EmojiMarker() { }

        public DTO_EmojiMarker(string URI, string repository, int row, string content, bool deleted)
        {
            DocumentURI = URI;
            Line        = row;
            Content     = content;
            SoftDelete  = deleted;
            Resolved    = false;
            IsSupressed = false;
            Repository  = repository;
        }

        public DTO_MarkerPosition Position() => new(this.DocumentURI, this.Repository, this.Line);
    }
}

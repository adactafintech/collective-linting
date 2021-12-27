using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace EmojiExtensionBackend.DTO
{
    public class DTO_EmojiScore
    {
        [Column("ID")]
        public Guid Id { get; set; }

        [JsonProperty("score")]
        public float Score { get; set; }
        [JsonProperty("user")]
        [Column("USER")]
        public string User { get; set; }

        [ForeignKey("markerId")]
        [Column("MARKER")]
        [JsonProperty("positionMarker")]
        public DTO_EmojiMarker Marker { get; set;}

        public DTO_EmojiScore() { }

        public DTO_EmojiScore(float score, string user, DTO_EmojiMarker marker) {
            this.Score  = score;
            this.User   = user;
            this.Marker = marker;
        }
    }
}

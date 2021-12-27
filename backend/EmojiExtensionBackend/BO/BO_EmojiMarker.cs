using Newtonsoft.Json;

namespace EmojiExtensionBackend.BO
{
    public class BO_EmojiMarker
    {
        [JsonProperty("documentUri")]
        public string DocumentUri;

        [JsonProperty("repository")]
        public string Repository;

        [JsonProperty("line")]
        public int Line;

        [JsonProperty("content")]
        public string Content;

        [JsonProperty("isDeleted")]
        public bool isDeleted   = false;

        [JsonProperty("isSupressed")]
        public bool isSupressed = false;

        [JsonProperty("isResolved")]
        public bool isResolved  = true;

        [JsonProperty("scores")]
        public BO_EmojiScore[] Scores;
    }
}

using Newtonsoft.Json;

namespace EmojiExtensionBackend.DTO
{
    public class CreateOrAddScoreRequest
    {
        [JsonProperty("documentUri")]
        public string documentUri { get; set; }

        [JsonProperty("repository")]
        public string repository { get; set; }

        [JsonProperty("content")]
        public string content { get; set; }

        [JsonProperty("line")]
        public int lineNumber { get; set; }

        [JsonProperty("score")]
        public int score { get; set; }

        [JsonProperty("user")]
        public string user { get; set; }

        public CreateOrAddScoreRequest(string document, string repository, string content, int line, int score, string user) 
        {
            this.documentUri    = document;
            this.repository     = repository;
            this.content        = content;
            this.lineNumber     = line;
            this.score          = score;
            this.user           = user;
        }
    }
}

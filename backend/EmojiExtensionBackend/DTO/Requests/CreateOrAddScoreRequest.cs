using Newtonsoft.Json;

namespace EmojiExtensionBackend.DTO
{
    public class CreateOrAddScoreRequest
    {
        [JsonProperty("documentUri")]
        public string DocumentUri { get; set; }

        [JsonProperty("repository")]
        public string Repository { get; set; }

        [JsonProperty("content")]
        public string Content { get; set; }

        [JsonProperty("line")]
        public int LineNumber { get; set; }

        [JsonProperty("score")]
        public int Score { get; set; }

        [JsonProperty("user")]
        public string User { get; set; }

        public CreateOrAddScoreRequest(string document, string repository, string content, int line, int score, string user) 
        {
            this.DocumentUri    = document;
            this.Repository     = repository;
            this.Content        = content;
            this.LineNumber     = line;
            this.Score          = score;
            this.User           = user;
        }
    }
}

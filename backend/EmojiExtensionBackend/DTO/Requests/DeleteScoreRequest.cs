using Newtonsoft.Json;

namespace EmojiExtensionBackend.DTO
{
    public class DeleteScoreRequest
    {
        [JsonProperty("documentUri")]
        public string documentUri { get; set; }

        [JsonProperty("repository")]
        public string repository { get; set; }

        [JsonProperty("line")]
        public int lineNumber { get; set; }

        [JsonProperty("user")]
        public string user { get; set; }

        public DeleteScoreRequest() { }

        public DeleteScoreRequest(string document, string repository, int line, string user)
        {
            this.documentUri    = document;
            this.repository     = repository;
            this.lineNumber     = line;
            this.user           = user;
        }
    }
}

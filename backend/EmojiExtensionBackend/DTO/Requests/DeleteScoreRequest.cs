using Newtonsoft.Json;

namespace EmojiExtensionBackend.DTO
{
    public class DeleteScoreRequest
    {
        [JsonProperty("documentUri")]
        public string DocumentUri { get; set; }

        [JsonProperty("repository")]
        public string Repository { get; set; }

        [JsonProperty("line")]
        public int LineNumber { get; set; }

        [JsonProperty("user")]
        public string User { get; set; }

        public DeleteScoreRequest() { }

        public DeleteScoreRequest(string document, string repository, int line, string user)
        {
            this.DocumentUri    = document;
            this.Repository     = repository;
            this.LineNumber     = line;
            this.User           = user;
        }
    }
}

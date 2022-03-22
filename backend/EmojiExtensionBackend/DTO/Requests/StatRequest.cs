using Newtonsoft.Json;

namespace EmojiExtensionBackend.DTO.Requests
{
    public class StatRequest
    {
        [JsonProperty("repository")]
        public string Repository { get; set; }

        [JsonProperty("numberOfResults")]
        public int NumberOfResults { get; set; }
    }
}

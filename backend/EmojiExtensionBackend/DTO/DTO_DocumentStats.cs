using Newtonsoft.Json;

namespace EmojiExtensionBackend.DTO
{
    public class DTO_DocumentStats
    {
        [JsonProperty("documentURI")]
        public string documentURI;

        [JsonProperty("averageScore")]
        public float averageScore;

        [JsonProperty("numberofScores")]
        public int numberOfScores;

        public DTO_DocumentStats(string documentURI, float averageScore, int numberOfScores)
        {
            this.documentURI = documentURI;
            this.averageScore = averageScore;
            this.numberOfScores = numberOfScores;
        }
    }
}
using Newtonsoft.Json;
namespace EmojiExtensionBackend.DTO
{
    public class DTO_RepoStats
    {

        [JsonProperty("highQualityDocuments")]
        public readonly DTO_DocumentStats[] highQualityDocuments;

        [JsonProperty("lowQualityDocuments")]
        public readonly DTO_DocumentStats[] lowQualityDocuments;

        public DTO_RepoStats(DTO_DocumentStats[] highQualityDocuments, DTO_DocumentStats[] lowQualityDocuments)
        { 
            this.highQualityDocuments = highQualityDocuments;
            this.lowQualityDocuments = lowQualityDocuments;
        }
    }
}

using EmojiExtensionBackend.DTO;
using Newtonsoft.Json;

namespace EmojiExtensionBackend.BO
{
    public class BO_EmojiScore
    {

        [JsonProperty("score")]
        public DTO_ScoreOccurence score;

        public BO_EmojiScore(DTO_ScoreOccurence occurence) 
        {
            this.score = occurence;
        }
    }
}
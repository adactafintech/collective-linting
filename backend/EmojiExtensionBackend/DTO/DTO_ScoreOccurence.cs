using Newtonsoft.Json;

namespace EmojiExtensionBackend.DTO
{
    public class DTO_ScoreOccurence
    {
        [JsonProperty("value")]
        public float value;

        [JsonProperty("frequency")]
        public int freq;

        public DTO_ScoreOccurence(float value) 
        {
            this.value = value;
            this.freq = 0;
        }

        public DTO_ScoreOccurence(float value, int freq) 
        {
            this.value = value;
            this.freq = freq;
         }
    }
}

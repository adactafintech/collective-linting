using EmojiExtensionBackend.BO;
using EmojiExtensionBackend.DTO;

namespace EmojiExtensionBackend.Services
{
    class ConverterService
    {
        public BO_EmojiMarker[] MarkerDTOArrayToBOArray(DTO_EmojiMarker[] DTOArray) 
        {
            BO_EmojiMarker[] BOArray = new BO_EmojiMarker[DTOArray.Length];
            for (int i = 0; i < DTOArray.Length; i++) {
                BOArray[i] = MarkerDTOToBO(DTOArray[i]);
                BOArray[i].Scores = ScoreDTOArrayToBOArray(DTOArray[i].scores);
            }

            return BOArray;
        }

        public BO_EmojiScore[] ScoreDTOArrayToBOArray(DTO_ScoreOccurence[] DTOArray) 
        {
            BO_EmojiScore[] BOArray = new BO_EmojiScore[DTOArray.Length];
            for (int i = 0; i < DTOArray.Length; i++) {
                BOArray[i] = ScoreDTOToBO(DTOArray[i]);
            }

            return BOArray;
        }

        public BO_EmojiMarker MarkerDTOToBO(DTO_EmojiMarker marker) 
        {
            BO_EmojiMarker MarkerBO = new BO_EmojiMarker();
            MarkerBO.Content        = marker.Content;
            MarkerBO.DocumentUri    = marker.DocumentURI;
            MarkerBO.Repository     = marker.Repository;
            MarkerBO.Line           = marker.Line;
            MarkerBO.isDeleted      = marker.SoftDelete;
            MarkerBO.isResolved     = marker.Resolved;
            MarkerBO.isSupressed    = marker.IsSupressed;
            return MarkerBO;
        }

        public BO_EmojiScore ScoreDTOToBO(DTO_ScoreOccurence score) 
        {
            BO_EmojiScore ScoreBO = new BO_EmojiScore(score);
            return ScoreBO;
        }
    }
}

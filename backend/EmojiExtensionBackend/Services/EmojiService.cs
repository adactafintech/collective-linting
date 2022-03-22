using EmojiExtensionBackend.BO;
using EmojiExtensionBackend.DAL;
using EmojiExtensionBackend.DTO;
using EmojiExtensionBackend.DTO.Requests;

namespace EmojiExtensionBackend.Services
{
    public class EmojiService
    {
        private readonly EmojiContext dal;

        public EmojiService(EmojiContext emojiContext)
        {
            dal = emojiContext;
        }

        public BO_EmojiMarker[] GetAllMarkers() 
        {
            DTO_EmojiMarker[] markers = dal.GetAllMarkers();

            foreach (DTO_EmojiMarker marker in markers)
            {
                marker.scores = dal.GetScores(marker);
            }

            return ConverterService.MarkerDTOArrayToBOArray(markers);
        }

        public BO_EmojiMarker[] GetMarkersForDocument(string document, string repository) 
        {
            DTO_EmojiMarker[] markers = dal.GetMarkersByDocument(document, repository);

            foreach (DTO_EmojiMarker marker in markers)
            {
                marker.scores = dal.GetScores(marker);
            }

            return ConverterService.MarkerDTOArrayToBOArray(markers);
        }

        public BO_EmojiMarker CreateOrUpdateScore(CreateOrAddScoreRequest req)
        {
            var Marker = dal.GetMarkerByPosition(req.DocumentUri, req.Repository, req.LineNumber);

            if (Marker == null) {
                Marker = CreateMarker(req.DocumentUri, req.Repository, req.LineNumber, req.Content);
            }

            CreateOrUpdateScore(Marker, req);

            Marker = UpdateMarkerDeleteStatus(Marker);

            // return GetMarkerByPosition(Marker.DocumentURI, Marker.Repository, Marker.Line);

            return this.Convert(Marker);
        }

        private BO_EmojiMarker Convert(DTO_EmojiMarker Marker) {
            BO_EmojiScore[] Scores  = ConverterService.ScoreDTOArrayToBOArray(dal.GetScores(Marker));
            BO_EmojiMarker BOMarker = ConverterService.MarkerDTOToBO(Marker);
            BOMarker.Scores = Scores;
            return BOMarker;
        }
           
        private DTO_EmojiScore CreateOrUpdateScore(DTO_EmojiMarker Marker, CreateOrAddScoreRequest Req)
        {
            var Score = dal.GetScoreByMarkerAndUser(Marker, Req.User);

            if (Score == null)
            {
                Score = CreateScore(Req.Score, Req.User, Marker);
            }
            else
            {
               Score = UpdateScore(Req.Score, Req.User, Marker);
            }
            UpdateMarkerDeleteStatus(Marker);

            return Score;
        }

        public bool DeleteScoreFromMarker(DeleteScoreRequest req) 
        {
            var Marker = dal.GetMarkerByPosition(req.DocumentUri, req.Repository, req.LineNumber);

            if(Marker == null) {
                return false;
            }
            
            dal.DeleteScoreByUserAndMarker(req.User, Marker);
            UpdateMarkerDeleteStatus(Marker);
            return true;
        }

        private DTO_EmojiMarker UpdateMarkerDeleteStatus(DTO_EmojiMarker marker) 
        {
           return dal.UpdateMarkerDeleteStatus(marker);
        }

        private DTO_EmojiMarker CreateMarker(string document, string repository, int line, string content)
        {
            return dal.CreateMarker(document, repository, line, content);
        }

        private DTO_EmojiScore CreateScore(float score, string user, DTO_EmojiMarker marker)
        {
           return dal.CreateScore(score, user, marker);
        }

        public DTO_EmojiScore UpdateScore(float score, string user, DTO_EmojiMarker marker)
        {
            return dal.UpdateScore(score, user, marker);
        }

        public DTO_ScoreOccurence[] GetScoreOccurences(string document, string repository, int line) 
        {
            DTO_ScoreOccurence[] occ = dal.GetScores(dal.GetMarkerByPosition(document, repository, line));
            return occ;
        }

        public DTO_RepoStats GetStatistics(StatRequest req)
        {
            return new DTO_RepoStats(
                dal.GetStatistics(req.Repository, req.NumberOfResults, true),
                dal.GetStatistics(req.Repository, req.NumberOfResults, false)
            );
        }
    }
}

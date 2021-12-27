using EmojiExtensionBackend.BO;
using EmojiExtensionBackend.DAL;
using EmojiExtensionBackend.DTO;

namespace EmojiExtensionBackend.Services
{
    public class EmojiService
    {
        private readonly EmojiContext dal;
        private ConverterService converter;

        public EmojiService(EmojiContext emojiContext)
        {
            dal = emojiContext;
            converter = new ConverterService();

        }

        public BO_EmojiMarker[] GetAllMarkers() 
        {
            DTO_EmojiMarker[] markers = dal.GetAllMarkers();

            foreach (DTO_EmojiMarker marker in markers)
            {
                marker.scores = dal.GetScores(marker);
            }

            return converter.MarkerDTOArrayToBOArray(markers);
        }

        public BO_EmojiMarker[] GetMarkersForDocument(string document, string repository) 
        {
            DTO_EmojiMarker[] markers = dal.GetMarkersByDocument(document, repository);

            foreach (DTO_EmojiMarker marker in markers)
            {
                marker.scores = dal.GetScores(marker);
            }

            return converter.MarkerDTOArrayToBOArray(markers);
        }

        public BO_EmojiMarker CreateOrUpdateScore(CreateOrAddScoreRequest req)
        {
            var Marker = dal.GetMarkerByPosition(req.documentUri, req.repository, req.lineNumber);

            if (Marker == null) {
                Marker = CreateMarker(req.documentUri, req.repository, req.lineNumber, req.content);
            }

            CreateOrUpdateScore(Marker, req);

            Marker = UpdateMarkerDeleteStatus(Marker);

            // return GetMarkerByPosition(Marker.DocumentURI, Marker.Repository, Marker.Line);

            return this.Convert(Marker);
        }

        private BO_EmojiMarker GetMarkerByPosition(string document, string repository, int line)
        {
            DTO_EmojiMarker Marker = dal.GetMarkerByPosition(document, repository, line);

            if (Marker != null)
            {
                return this.Convert(Marker);
            }

            return null;
        }

        private BO_EmojiMarker Convert(DTO_EmojiMarker Marker) {
            BO_EmojiScore[] Scores = this.converter.ScoreDTOArrayToBOArray(dal.GetScores(Marker));
            BO_EmojiMarker BOMarker = this.converter.MarkerDTOToBO(Marker);
            BOMarker.Scores = Scores;
            return BOMarker;
        }
           
        private DTO_EmojiScore CreateOrUpdateScore(DTO_EmojiMarker Marker, CreateOrAddScoreRequest Req)
        {
            var Score = dal.GetScoreByMarkerAndUser(Marker, Req.user);

            if (Score == null)
            {
                Score = CreateScore(Req.score, Req.user, Marker);
            }
            else
            {
               Score = UpdateScore(Req.score, Req.user, Marker);
            }
            UpdateMarkerDeleteStatus(Marker);

            return Score;
        }

        public bool DeleteScoreFromMarker(DeleteScoreRequest req) 
        {
            var Marker = dal.GetMarkerByPosition(req.documentUri, req.repository, req.lineNumber);

            if(Marker != null) {
                dal.DeleteScoreByUserAndMarker(req.user, Marker);
            } else {
                return false;
            }

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
    }
}

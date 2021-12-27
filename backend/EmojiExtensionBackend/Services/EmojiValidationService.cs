using EmojiExtensionBackend.DTO;
using System.Linq;

namespace EmojiExtensionBackend.Services
{
    public class EmojiValidationService
    {

        public bool ValidateCreateOrAddScoreRequest(CreateOrAddScoreRequest req) 
        {
            if (req.documentUri.Length == 0 || req.user.Length == 0 || req.content.Length == 0) {
                return false;
            }

            if (req.lineNumber < 0) {
                return false;
            }

            // validate score
            return ValidateScore(req.score);
        }

        public bool ValidateDeleteScoreRequest(DeleteScoreRequest req) 
        {
            if (req.documentUri.Length == 0 || req.user.Length == 0) {
                return false;
            }

            if (req.lineNumber < 0) {
                return false;
            }

            return true;
        }

        public bool ValidateUpdateMarkerRequest(UpdateMarkerRequest req) 
        {
            return true;
        }

        private bool ValidateScore(int score) 
        {
            return GetAvailableScores().Contains(score);
        }

        private int[] GetAvailableScores() 
        {
            return new int[] { 2, 0, -2 };
        }
    }
}

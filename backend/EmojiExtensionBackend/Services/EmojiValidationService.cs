using EmojiExtensionBackend.DTO;
using System.Linq;

namespace EmojiExtensionBackend.Services
{
    public class EmojiValidationService
    {
        public static bool ValidateCreateOrAddScoreRequest(CreateOrAddScoreRequest req) 
        {
            if (req.DocumentUri.Length == 0 || req.User.Length == 0 || req.Content.Length == 0) {
                return false;
            }

            if (req.LineNumber < 0) {
                return false;
            }

            // validate score
            return ValidateScore(req.Score);
        }

        public static bool ValidateDeleteScoreRequest(DeleteScoreRequest req) 
        {
            if (req.DocumentUri.Length == 0 || req.User.Length == 0) {
                return false;
            }

            if (req.LineNumber < 0) {
                return false;
            }

            return true;
        }

        private static bool ValidateScore(int score) 
        {
            return GetAvailableScores().Contains(score);
        }

        private static int[] GetAvailableScores() 
        {
            return new int[] { 2, 0, -2 };
        }
    }
}

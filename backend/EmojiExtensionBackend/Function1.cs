using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using EmojiExtensionBackend.DTO;
using EmojiExtensionBackend.DAL;
using EmojiExtensionBackend.Services;
using EmojiExtensionBackend.BO;

namespace EmojiExtensionBackend.v1
{
    public class MarkerStorageFunction
    {

        private EmojiService emojiService;
        private readonly string APIVersion = "v1";

        public MarkerStorageFunction(EmojiContext emojiContext)
        {
            emojiService = new EmojiService(emojiContext);
        }

        [FunctionName("FindMarkerByDocumentFunction")]
        public IActionResult FindByDocument(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/markerService/{documentURI}/{repository}/find")] HttpRequest req,
            string documentURI,
            string repository,
            ILogger log)
        {
            documentURI = documentURI.Replace("--", "/");
            repository = repository.Replace("--", "/");

            BO_EmojiMarker[] markers = emojiService.GetMarkersForDocument(documentURI, repository);
            return new OkObjectResult(JsonConvert.SerializeObject(markers));
        }

        [FunctionName("GetAllMarkersFunction")]
        public IActionResult FindAll(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/markerService/all")] HttpRequest req,
            ILogger log)
        {
            BO_EmojiMarker[] markers = emojiService.GetAllMarkers();
            return new OkObjectResult(JsonConvert.SerializeObject(markers));
        }

        [FunctionName("DeleteMarkerFunction")]
        public IActionResult DeleteMarker(
            [HttpTrigger(AuthorizationLevel.Anonymous, "DELETE", Route = "v1/markerService/disable")] DTO_EmojiMarker marker,
            ILogger log) {

            if (marker != null) {
                marker.SoftDelete = true;
                return new OkObjectResult("Marker on location .... deleted");
            } else {
                return new BadRequestObjectResult("Invalid marker....");
            }
        }

        [FunctionName("NewScore")]
        public async Task<IActionResult> NewScore(
            //TODO: req -> Score
            [HttpTrigger(AuthorizationLevel.Anonymous, "POST", Route = "v1/markerService/newScore")] HttpRequest req,
            ILogger log) {
            try {
                var content = await new StreamReader(req.Body).ReadToEndAsync();
                CreateOrAddScoreRequest score = JsonConvert.DeserializeObject<CreateOrAddScoreRequest>(content);

                BO_EmojiMarker Marker = emojiService.CreateOrUpdateScore(score);
                if (Marker != null) {
                    return new OkObjectResult(JsonConvert.SerializeObject(Marker));
                }
                else {
                    return new BadRequestObjectResult("Could not save new score");
                }
            } catch(Exception e) {
                return new BadRequestObjectResult("Invalid format.... " + e.Message);
            }
        }

        [FunctionName("RemoveScore")]
        public IActionResult RemoveScore(
            //TODO: req -> Score
            [HttpTrigger(AuthorizationLevel.Anonymous, "DELETE", Route = "v1/markerService/removeScore")] DeleteScoreRequest score,
            ILogger log) {
            try {
                if (emojiService.DeleteScoreFromMarker(score)) {
                    return new OkObjectResult("Removed score");
                } else {
                    return new BadRequestObjectResult("Could not remove score from marker");
                }
            } catch (Exception e) {
                return new BadRequestObjectResult("Invalid format.... " + e.Message);
            }
        }

        [FunctionName("GetOccurences")]
        public IActionResult GetOccurence(
        [HttpTrigger(AuthorizationLevel.Anonymous, "GET", Route = "v1/markerService/score/occurence")] HttpRequest req,
        ILogger log)
        {
            try
            {
                DTO_ScoreOccurence[] occ = emojiService.GetScoreOccurences("L2M6L1VzZXJzL05lamMgTWxha2FyL0Rlc2t0b3AvdW5pdHlQcm9qZWN0cy9kb2RnZWJhbGwvQXNzZXRzL1NjcmlwdHMvUGxheWVyL0xlYW5QbGF5ZXIuY3M=", "dsadsa", 6);
                return new OkObjectResult(JsonConvert.SerializeObject(occ));
            }
            catch (Exception e)
            {
                return new BadRequestObjectResult("Invalid format.... " + e.Message);
            }
        }
    }
}

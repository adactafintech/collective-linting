using EmojiExtensionBackend.BO;
using EmojiExtensionBackend.DAL;
using EmojiExtensionBackend.DTO;
using EmojiExtensionBackend.Services;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace EmojiBackendTests
{
    [TestClass]
    public class EmojiServiceTest
    {
        static readonly DTO_ScoreOccurence[] populatedScores = new DTO_ScoreOccurence[] { new(2, 17), new(0, 6), new(-2, 57) };

        static readonly string notFoundDocumentPath  = "not-existing-document";
        static readonly string validDocumentPath     = "path-to-some-document";

        static readonly string validRemote       = "validRemote@github.com";

        static readonly string user = "test-user";

        static readonly DTO_EmojiMarker marker1 = new("path-to-some-document", "validRemote@github.com", 17, "test content in document", true);
        static readonly DTO_EmojiMarker marker2 = new("path-to-some-document", "validRemote@github.com", 743, "test content in document somewhere else", false);

        static readonly Mock<EmojiContext> dalContext = new();

        [AssemblyInitialize]
        public static void AssemblyInit(TestContext context)
        {
            dalContext.Setup(x => x.GetMarkersByDocument(validDocumentPath, validRemote)).Returns(new DTO_EmojiMarker[] { marker2, marker1 });

            dalContext.Setup(x => x.GetScores(marker1)).Returns(populatedScores);
            dalContext.Setup(x => x.GetMarkersByDocument(notFoundDocumentPath, validRemote)).Returns(System.Array.Empty<DTO_EmojiMarker>());
            dalContext.Setup(x => x.GetAllMarkers()).Returns(new DTO_EmojiMarker[] { marker1, marker2 });

            dalContext.Setup(x => x.GetMarkerByPosition(marker1.DocumentURI, validRemote, marker1.Line)).Returns(marker1);
            dalContext.Setup(x => x.GetMarkerByPosition(marker2.DocumentURI, validRemote, marker2.Line)).Returns(marker2);

            dalContext.Setup(x => x.MarkerExistsOnPosition(marker1.DocumentURI, validRemote, marker1.Line)).Returns(true);
            dalContext.Setup(x => x.MarkerExistsOnPosition(marker2.DocumentURI, validRemote, marker2.Line)).Returns(true);
        }

        [TestMethod]
        public void TestGetAllMarkersSingle()
        {
            Mock<EmojiContext> context = new();
            context.Setup(x => x.GetAllMarkers()).Returns(new DTO_EmojiMarker[] { marker1 });
            EmojiService service = new(context.Object);

            BO_EmojiMarker[] BO_Markers = service.GetAllMarkers();

            Assert.AreEqual(1, BO_Markers.Length);
            Assert.AreEqual("test content in document", BO_Markers[0].Content);
            Assert.IsFalse(BO_Markers[0].isSupressed);
            Assert.AreEqual(0, BO_Markers[0].Scores.Length);
        }

        [TestMethod]
        public void TestGetAllMarkersMultiple()
        {
            EmojiService service = new(dalContext.Object);
            BO_EmojiMarker[] BO_Markers = service.GetAllMarkers();

            Assert.AreEqual(2, BO_Markers.Length);
            Assert.AreEqual("test content in document", BO_Markers[0].Content);
            Assert.AreEqual(743, BO_Markers[1].Line);
            Assert.AreEqual(3, BO_Markers[0].Scores.Length);
            Assert.AreEqual(0, BO_Markers[1].Scores.Length);
        }

        [TestMethod]
        public void TestGetAllMarkersEmpty()
        {
            Mock<EmojiContext> context = new();
            context.Setup(x => x.GetAllMarkers()).Returns(System.Array.Empty<DTO_EmojiMarker>());

            EmojiService service = new(context.Object);

            BO_EmojiMarker[] BO_Markers = service.GetAllMarkers();

            Assert.AreEqual(0, BO_Markers.Length);
        }

        [TestMethod]
        public void TestGetMarkersForDocumentNoDocument()
        {
            EmojiService service = new(dalContext.Object);

            BO_EmojiMarker[] BO_Markers = service.GetMarkersForDocument(notFoundDocumentPath, validRemote);

            Assert.AreEqual(0, BO_Markers.Length);
        }

        [TestMethod]
        public void TestGetMarkersForDocumentMultipleMarkers()
        {
            EmojiService service = new(dalContext.Object);

            BO_EmojiMarker[] BO_Markers = service.GetMarkersForDocument(validDocumentPath, validRemote);

            Assert.AreEqual(2, BO_Markers.Length);
            Assert.AreEqual("test content in document somewhere else", BO_Markers[0].Content);
            Assert.AreEqual(17, BO_Markers[1].Line);
            Assert.AreEqual(743, BO_Markers[0].Line);
        }

        [TestMethod]
        public void TestAddNewScoreToNonExistingMarker() 
        {
            DTO_EmojiScore testScore = new(-2, user, marker1);
            DTO_ScoreOccurence occurence = new(-2, 1);

            Mock<EmojiContext> context = new();
            context.Setup(x => x.CreateMarker(validDocumentPath, validRemote, marker1.Line, marker1.Content)).Returns(marker1);
            context.Setup(x => x.GetMarkersByDocument(validDocumentPath, validRemote)).Returns(System.Array.Empty<DTO_EmojiMarker>());
            context.Setup(x => x.MarkerExistsOnPosition(validDocumentPath, validRemote, 12)).Returns(false);
            context.Setup(x => x.CreateScore(-2, user, marker1)).Returns(testScore);
            context.Setup(x => x.ScoresForMarker(marker1)).Returns(true);
            context.Setup(x => x.UpdateMarkerDeleteStatus(marker1)).Returns(marker1);
            context.Setup(x => x.GetScores(marker1)).Returns(new[] { occurence });

            EmojiService service = new(context.Object);
            CreateOrAddScoreRequest req = new(validDocumentPath, validRemote, marker1.Content, marker1.Line, -2, user);
            
            BO_EmojiMarker returnedMarker = service.CreateOrUpdateScore(req);

            Assert.AreEqual(validRemote, returnedMarker.Repository);
            Assert.AreEqual(marker1.Content, returnedMarker.Content);
            Assert.AreEqual(-2, returnedMarker.Scores[0].score.value);
            Assert.AreEqual(1, returnedMarker.Scores[0].score.freq);
        }

        [TestMethod]
        public void TestAddNewScoreToExistingScores() 
        {
            DTO_EmojiScore testScore        = new(-2, user, marker1);
            DTO_ScoreOccurence occurence1   = new(-2, 1);
            DTO_ScoreOccurence occurence2   = new(2, 2);
            DTO_ScoreOccurence occurence3   = new(0, 1);
            BO_EmojiScore[] scores = new BO_EmojiScore[] { new BO_EmojiScore(occurence1), new BO_EmojiScore(occurence3), new BO_EmojiScore(occurence2) };

            Mock<EmojiContext> context = new();
            context.Setup(x => x.GetMarkersByDocument(validDocumentPath, validRemote)).Returns(new DTO_EmojiMarker[] { marker1 });
            context.Setup(x => x.MarkerExistsOnPosition(validDocumentPath, validRemote, marker1.Line)).Returns(true);
            context.Setup(x => x.GetMarkerByPosition(marker1.DocumentURI, marker1.Repository, marker1.Line)).Returns(marker1);
            context.Setup(x => x.CreateScore(0, user, marker1)).Returns(testScore);
            context.Setup(x => x.ScoresForMarker(marker1)).Returns(true);
            context.Setup(x => x.UpdateMarkerDeleteStatus(marker1)).Returns(marker1);
            context.Setup(x => x.GetScores(marker1)).Returns(new[] { occurence1, occurence3, occurence2 });

            EmojiService service = new(context.Object);
            CreateOrAddScoreRequest req = new(marker1.DocumentURI, marker1.Repository, marker1.Content, marker1.Line, 0, user);
            
            BO_EmojiMarker returnedMarker = service.CreateOrUpdateScore(req);

            Assert.AreEqual(validRemote, returnedMarker.Repository);
            Assert.AreEqual(marker1.Content, returnedMarker.Content);
            Assert.AreEqual(scores[0].score.value, returnedMarker.Scores[0].score.value);
            Assert.AreEqual(scores[0].score.freq, returnedMarker.Scores[0].score.freq);
            Assert.AreEqual(scores[1].score.value, returnedMarker.Scores[1].score.value);
            Assert.AreEqual(scores[1].score.freq, returnedMarker.Scores[1].score.freq);
            Assert.AreEqual(scores[2].score.value, returnedMarker.Scores[2].score.value);
            Assert.AreEqual(scores[2].score.freq, returnedMarker.Scores[2].score.freq);
        }

        [TestMethod]
        public void TestUpdateExistingScore() 
        {
            DTO_EmojiScore testScore = new(-2, user, marker1);
            DTO_ScoreOccurence occurence1 = new(-2, 0);
            DTO_ScoreOccurence occurence2 = new(2, 2);
            DTO_ScoreOccurence occurence3 = new(0, 1);
            BO_EmojiScore[] scores = new BO_EmojiScore[] { new BO_EmojiScore(occurence1), new BO_EmojiScore(occurence3), new BO_EmojiScore(occurence2) };

            Mock<EmojiContext> context = new();
            context.Setup(x => x.GetMarkersByDocument(validDocumentPath, validRemote)).Returns(new DTO_EmojiMarker[] { marker1 });
            context.Setup(x => x.GetScoreByMarkerAndUser(marker1, user)).Returns(testScore);
            context.Setup(x => x.MarkerExistsOnPosition(validDocumentPath, validRemote, marker1.Line)).Returns(true);
            context.Setup(x => x.GetMarkerByPosition(marker1.DocumentURI, marker1.Repository, marker1.Line)).Returns(marker1);
            context.Setup(x => x.CreateScore(0, user, marker1)).Returns(testScore);
            context.Setup(x => x.ScoresForMarker(marker1)).Returns(true);
            context.Setup(x => x.UpdateMarkerDeleteStatus(marker1)).Returns(marker1);
            context.Setup(x => x.GetScores(marker1)).Returns(new[] { occurence1, occurence3, occurence2 });

            EmojiService service = new(context.Object);
            CreateOrAddScoreRequest req = new(marker1.DocumentURI, marker1.Repository, marker1.Content, marker1.Line, 0, user);

            BO_EmojiMarker returnedMarker = service.CreateOrUpdateScore(req);
            Assert.AreEqual(validRemote, returnedMarker.Repository);
            Assert.AreEqual(marker1.Content, returnedMarker.Content);
            Assert.AreEqual(scores[0].score.value, returnedMarker.Scores[0].score.value);
            Assert.AreEqual(scores[0].score.freq, returnedMarker.Scores[0].score.freq);
            Assert.AreEqual(scores[1].score.value, returnedMarker.Scores[1].score.value);
            Assert.AreEqual(scores[1].score.freq, returnedMarker.Scores[1].score.freq);
            Assert.AreEqual(scores[2].score.value, returnedMarker.Scores[2].score.value);
            Assert.AreEqual(scores[2].score.freq, returnedMarker.Scores[2].score.freq);
        }

        [TestMethod]
        public void TestRemoveExistingScore() 
        {
            DTO_EmojiScore testScore = new(-2, user, marker1);
            DTO_ScoreOccurence occurence1 = new(-2, 0);
            DTO_ScoreOccurence occurence2 = new(2, 2);
            DTO_ScoreOccurence occurence3 = new(0, 0);
            BO_EmojiScore[] scores = new BO_EmojiScore[] { new BO_EmojiScore(occurence1), new BO_EmojiScore(occurence3), new BO_EmojiScore(occurence2) };

            Mock<EmojiContext> context = new();
            context.Setup(x => x.GetMarkersByDocument(validDocumentPath, validRemote)).Returns(new DTO_EmojiMarker[] { marker1 });
            context.Setup(x => x.GetScoreByMarkerAndUser(marker1, user)).Returns(testScore);
            context.Setup(x => x.MarkerExistsOnPosition(validDocumentPath, validRemote, marker1.Line)).Returns(true);
            context.Setup(x => x.GetMarkerByPosition(marker1.DocumentURI, marker1.Repository, marker1.Line)).Returns(marker1);
            context.Setup(x => x.ScoreExistsByMarkerAndUser(marker1, user)).Returns(true);
            context.Setup(x => x.ScoresForMarker(marker1)).Returns(true);
            context.Setup(x => x.UpdateMarkerDeleteStatus(marker1)).Returns(marker1);
            context.Setup(x => x.GetScores(marker1)).Returns(new[] { occurence1, occurence3, occurence2 });
            context.Setup(x => x.DeleteScoreByUserAndMarker(user, marker1));

            EmojiService service    = new(context.Object);
            DeleteScoreRequest req  = new(marker1.DocumentURI, marker1.Repository, marker1.Line, user);

            service.DeleteScoreFromMarker(req);

            BO_EmojiMarker returnedMarker = service.GetMarkersForDocument(marker1.DocumentURI, marker1.Repository)[0];
            Assert.AreEqual(validRemote, returnedMarker.Repository);
            Assert.AreEqual(marker1.Content, returnedMarker.Content);
            Assert.AreEqual(scores[0].score.value, returnedMarker.Scores[0].score.value);
            Assert.AreEqual(scores[0].score.freq, returnedMarker.Scores[0].score.freq);
            Assert.AreEqual(scores[1].score.value, returnedMarker.Scores[1].score.value);
            Assert.AreEqual(scores[1].score.freq, returnedMarker.Scores[1].score.freq);
            Assert.AreEqual(scores[2].score.value, returnedMarker.Scores[2].score.value);
            Assert.AreEqual(scores[2].score.freq, returnedMarker.Scores[2].score.freq);
        }

        [TestMethod]
        public void TestRemoveUnexistingScore() 
        {
            DTO_ScoreOccurence occurence1 = new(-2, 1);
            DTO_ScoreOccurence occurence2 = new(2, 2);
            DTO_ScoreOccurence occurence3 = new(0, 1);
            BO_EmojiScore[] scores = new BO_EmojiScore[] { new BO_EmojiScore(occurence1), new BO_EmojiScore(occurence3), new BO_EmojiScore(occurence2) };

            Mock<EmojiContext> context = new();
            context.Setup(x => x.GetMarkersByDocument(validDocumentPath, validRemote)).Returns(new DTO_EmojiMarker[] { marker1 });
            context.Setup(x => x.GetScoreByMarkerAndUser(marker1, user)).Returns((DTO_EmojiScore)null);
            context.Setup(x => x.MarkerExistsOnPosition(validDocumentPath, validRemote, marker1.Line)).Returns(true);
            context.Setup(x => x.GetMarkerByPosition(marker1.DocumentURI, marker1.Repository, marker1.Line)).Returns(marker1);
            context.Setup(x => x.ScoreExistsByMarkerAndUser(marker1, user)).Returns(true);
            context.Setup(x => x.ScoresForMarker(marker1)).Returns(true);
            context.Setup(x => x.UpdateMarkerDeleteStatus(marker1)).Returns(marker1);
            context.Setup(x => x.GetScores(marker1)).Returns(new[] { occurence1, occurence3, occurence2 });
            context.Setup(x => x.DeleteScoreByUserAndMarker(user, marker1));

            EmojiService service    = new(context.Object);
            DeleteScoreRequest req  = new(marker1.DocumentURI, marker1.Repository, marker1.Line, user);

            service.DeleteScoreFromMarker(req);

            BO_EmojiMarker returnedMarker = service.GetMarkersForDocument(marker1.DocumentURI, marker1.Repository)[0];
            Assert.AreEqual(validRemote, returnedMarker.Repository);
            Assert.AreEqual(marker1.Content, returnedMarker.Content);
            Assert.AreEqual(scores[0].score.value, returnedMarker.Scores[0].score.value);
            Assert.AreEqual(scores[0].score.freq, returnedMarker.Scores[0].score.freq);
            Assert.AreEqual(scores[1].score.value, returnedMarker.Scores[1].score.value);
            Assert.AreEqual(scores[1].score.freq, returnedMarker.Scores[1].score.freq);
            Assert.AreEqual(scores[2].score.value, returnedMarker.Scores[2].score.value);
            Assert.AreEqual(scores[2].score.freq, returnedMarker.Scores[2].score.freq);
        }
    }
}


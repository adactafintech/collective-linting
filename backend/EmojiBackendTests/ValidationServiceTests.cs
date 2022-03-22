using EmojiExtensionBackend.DTO;
using EmojiExtensionBackend.Services;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace EmojiBackendTests
{
    [TestClass]
    class ValidationServiceTests
    {
        [TestMethod]
        public void TestOkDeleteRequest()
        {
            DeleteScoreRequest okReq = new();
            okReq.DocumentUri = "this/is/valid/document/path";
            okReq.LineNumber = 12;
            okReq.User = "test-user";

            Assert.IsTrue(EmojiValidationService.ValidateDeleteScoreRequest(okReq));
        }

        [TestMethod]
        public void TestEmptyUserDeleteRequest() 
        {
            DeleteScoreRequest okReq = new();
            okReq.DocumentUri = "this/is/valid/document/path";
            okReq.LineNumber = 12;
            okReq.User = "";

            Assert.IsFalse(EmojiValidationService.ValidateDeleteScoreRequest(okReq));
        }

        [TestMethod]
        public void TestEmptyDocumentPathDeleteRequest()
        {
            DeleteScoreRequest okReq = new();
            okReq.DocumentUri = "";
            okReq.LineNumber = 12;
            okReq.User = "test-user";

            Assert.IsFalse(EmojiValidationService.ValidateDeleteScoreRequest(okReq));
        }

        [TestMethod]
        public void TestEmptyUserAndDocumentDeleteRequest()
        {
            DeleteScoreRequest okReq = new();
            okReq.DocumentUri = "";
            okReq.LineNumber = 12;
            okReq.User = "";

            Assert.IsFalse(EmojiValidationService.ValidateDeleteScoreRequest(okReq));
        }

        [TestMethod]
        public void TestNegativeLineNumberDeleteRequest()
        {
            DeleteScoreRequest okReq = new();
            okReq.DocumentUri = "this/is/valid/document/path";
            okReq.LineNumber = -12;
            okReq.User = "test-user";
            
            Assert.IsFalse(EmojiValidationService.ValidateDeleteScoreRequest(okReq));
        }

        [TestMethod]
        public void TestOkCreateRequest()
        {
            CreateOrAddScoreRequest okReq = new("this/is/valid/document/path", "valid-remote-path", "this is line content", 17, -2, "test-user");
            Assert.IsTrue(EmojiValidationService.ValidateCreateOrAddScoreRequest(okReq));
        }

        [TestMethod]
        public void TestEmptyDocumentPathCreateRequest()
        {
            CreateOrAddScoreRequest okReq = new("", "valid-remote-path", "this is line content", 17, -2, "test-user");
            Assert.IsFalse(EmojiValidationService.ValidateCreateOrAddScoreRequest(okReq));
        }

        [TestMethod]
        public void TestEmptyUserCreateRequest()
        {
            CreateOrAddScoreRequest okReq = new("this/is/valid/document/path", "valid-remote-path", "this is line content", 17, -2, "");
            Assert.IsFalse(EmojiValidationService.ValidateCreateOrAddScoreRequest(okReq));
        }

        [TestMethod]
        public void TestEmptyContentCreateRequest()
        {
            CreateOrAddScoreRequest okReq = new("this/is/valid/document/path", "valid-remote-path", "", 17, -2, "test-user");
            Assert.IsFalse(EmojiValidationService.ValidateCreateOrAddScoreRequest(okReq));
        }

        [TestMethod]
        public void TestEmptyMultipleFieldsCreateRequest()
        {
            CreateOrAddScoreRequest okReq = new("", "this is line content", "valid-remote-path", 17, -2, "");
            Assert.IsFalse(EmojiValidationService.ValidateCreateOrAddScoreRequest(okReq));
        }

        [TestMethod]
        public void TestNegativeLineNumberCreateRequest()
        {
            CreateOrAddScoreRequest okReq = new("this/is/valid/document/path", "valid-remote-path", "this is line content", -317, -2, "test-user");
            Assert.IsFalse(EmojiValidationService.ValidateCreateOrAddScoreRequest(okReq));
        }

        [TestMethod]
        public void TestInvalidScoreCreateRequest()
        {
            CreateOrAddScoreRequest okReq = new("this/is/valid/document/path", "valid-remote-path", "this is line content", 17, 657, "test-user");
            Assert.IsFalse(EmojiValidationService.ValidateCreateOrAddScoreRequest(okReq));
        }
    }
}

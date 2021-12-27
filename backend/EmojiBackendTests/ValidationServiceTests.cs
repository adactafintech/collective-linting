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
            DeleteScoreRequest okReq = new DeleteScoreRequest();
            okReq.documentUri = "this/is/valid/document/path";
            okReq.lineNumber = 12;
            okReq.user = "test-user";

            EmojiValidationService service = new EmojiValidationService();

            Assert.IsTrue(service.ValidateDeleteScoreRequest(okReq));
        }

        [TestMethod]
        public void TestEmptyUserDeleteRequest() 
        {
            DeleteScoreRequest okReq = new DeleteScoreRequest();
            okReq.documentUri = "this/is/valid/document/path";
            okReq.lineNumber = 12;
            okReq.user = "";

            EmojiValidationService service = new EmojiValidationService();

            Assert.IsFalse(service.ValidateDeleteScoreRequest(okReq));
        }

        [TestMethod]
        public void TestEmptyDocumentPathDeleteRequest()
        {
            DeleteScoreRequest okReq = new DeleteScoreRequest();
            okReq.documentUri = "";
            okReq.lineNumber = 12;
            okReq.user = "test-user";

            EmojiValidationService service = new EmojiValidationService();

            Assert.IsFalse(service.ValidateDeleteScoreRequest(okReq));
        }

        [TestMethod]
        public void TestEmptyUserAndDocumentDeleteRequest()
        {
            DeleteScoreRequest okReq = new DeleteScoreRequest();
            okReq.documentUri = "";
            okReq.lineNumber = 12;
            okReq.user = "";

            EmojiValidationService service = new EmojiValidationService();

            Assert.IsFalse(service.ValidateDeleteScoreRequest(okReq));
        }

        [TestMethod]
        public void TestNegativeLineNumberDeleteRequest()
        {
            DeleteScoreRequest okReq = new DeleteScoreRequest();
            okReq.documentUri = "this/is/valid/document/path";
            okReq.lineNumber = -12;
            okReq.user = "test-user";

            EmojiValidationService service = new EmojiValidationService();

            Assert.IsFalse(service.ValidateDeleteScoreRequest(okReq));
        }

        [TestMethod]
        public void TestOkCreateRequest()
        {
            CreateOrAddScoreRequest okReq = new CreateOrAddScoreRequest("this/is/valid/document/path", "valid-remote-path", "this is line content", 17, -2, "test-user");
            EmojiValidationService service = new EmojiValidationService();

            Assert.IsTrue(service.ValidateCreateOrAddScoreRequest(okReq));
        }

        [TestMethod]
        public void TestEmptyDocumentPathCreateRequest()
        {
            CreateOrAddScoreRequest okReq = new CreateOrAddScoreRequest("", "valid-remote-path", "this is line content", 17, -2, "test-user");
            EmojiValidationService service = new EmojiValidationService();

            Assert.IsFalse(service.ValidateCreateOrAddScoreRequest(okReq));
        }

        [TestMethod]
        public void TestEmptyUserCreateRequest()
        {
            CreateOrAddScoreRequest okReq = new CreateOrAddScoreRequest("this/is/valid/document/path", "valid-remote-path", "this is line content", 17, -2, "");
            EmojiValidationService service = new EmojiValidationService();

            Assert.IsFalse(service.ValidateCreateOrAddScoreRequest(okReq));
        }

        [TestMethod]
        public void TestEmptyContentCreateRequest()
        {
            CreateOrAddScoreRequest okReq = new CreateOrAddScoreRequest("this/is/valid/document/path", "valid-remote-path", "", 17, -2, "test-user");
            EmojiValidationService service = new EmojiValidationService();

            Assert.IsFalse(service.ValidateCreateOrAddScoreRequest(okReq));
        }

        [TestMethod]
        public void TestEmptyMultipleFieldsCreateRequest()
        {
            CreateOrAddScoreRequest okReq = new CreateOrAddScoreRequest("", "this is line content", "valid-remote-path", 17, -2, "");
            EmojiValidationService service = new EmojiValidationService();

            Assert.IsFalse(service.ValidateCreateOrAddScoreRequest(okReq));
        }

        [TestMethod]
        public void TestNegativeLineNumberCreateRequest()
        {
            CreateOrAddScoreRequest okReq = new CreateOrAddScoreRequest("this/is/valid/document/path", "valid-remote-path", "this is line content", -317, -2, "test-user");
            EmojiValidationService service = new EmojiValidationService();

            Assert.IsFalse(service.ValidateCreateOrAddScoreRequest(okReq));
        }

        [TestMethod]
        public void TestInvalidScoreCreateRequest()
        {
            CreateOrAddScoreRequest okReq = new CreateOrAddScoreRequest("this/is/valid/document/path", "valid-remote-path", "this is line content", 17, 657, "test-user");
            EmojiValidationService service = new EmojiValidationService();

            Assert.IsFalse(service.ValidateCreateOrAddScoreRequest(okReq));
        }

    }
}

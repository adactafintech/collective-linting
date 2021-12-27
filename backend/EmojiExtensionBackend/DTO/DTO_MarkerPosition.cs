using System;
using System.Collections.Generic;
using System.Text;

namespace EmojiExtensionBackend.DTO
{
    public class DTO_MarkerPosition
    {
        public string DocumentURI { get; set; }

        public string Repository { get; set; }
        public int Line { get; set; }

        public DTO_MarkerPosition() { }

        public DTO_MarkerPosition(string documentUri, string repository, int line) {
            this.Line           = line;
            this.DocumentURI    = documentUri;
            this.Repository     = repository;
        }
    }
}

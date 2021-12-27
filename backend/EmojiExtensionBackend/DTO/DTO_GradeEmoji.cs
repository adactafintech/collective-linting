using System;
using System.Collections.Generic;
using System.Text;

namespace EmojiExtensionBackend.DTO
{
    public class DTO_GradeEmoji
    {
        public float value;

        //TODO: add emoji and other settings

        public DTO_GradeEmoji(float value) 
        {
            this.value = value;
        }
    }
}

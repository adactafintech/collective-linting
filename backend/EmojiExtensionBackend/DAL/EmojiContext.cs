using Microsoft.EntityFrameworkCore;
using EmojiExtensionBackend.DTO;
using System.Threading.Tasks;
using System.Linq;

namespace EmojiExtensionBackend.DAL
{
    public class EmojiContext : DbContext
    {

        public EmojiContext(DbContextOptions<EmojiContext> options) : base(options) { }

        public DbSet<DTO_EmojiScore> Score { get; set; }

        public DbSet<DTO_EmojiMarker> Marker { get; set; }

        public virtual DTO_EmojiMarker CreateMarker(string document, string repository, int line, string content) 
        {
            DTO_EmojiMarker NewMarker = new(document, repository, line, content, false);
            this.Marker.Add(NewMarker);
            SaveChanges();
            return NewMarker;
        }

        public virtual DTO_EmojiMarker GetMarkerByPosition(string document, string repository, int line) 
        {
            if(MarkerExistsOnPosition(document, repository, line)) {
                return this.Marker.First(a => a.DocumentURI == document && a.Line == line && a.Repository == repository);
            }

            return null;
        }

        public virtual DTO_EmojiMarker[] GetMarkersByDocument(string document, string repository) 
        {
            DTO_EmojiMarker[] markers = this.Marker.Where(o => o.DocumentURI == document && o.Repository == repository).ToArray();
            return markers;
        }
        public virtual DTO_EmojiMarker[] GetAllMarkers()
        {
            DTO_EmojiMarker[] markers = this.Marker.ToArray();
            return markers;
        }

        public virtual bool MarkerExistsOnPosition(string document, string repository, int line) 
        {
            return this.Marker.Any(o => o.DocumentURI == document && o.Repository == repository && o.Line == line);
        }

        public virtual DTO_EmojiScore CreateScore(float score, string user, DTO_EmojiMarker marker) 
        {
            DTO_EmojiScore Score = new(score, user, marker);
            this.Score.Add(Score);
            SaveChanges();
            return Score;
        }

        public DTO_EmojiScore UpdateScore(float score, string user, DTO_EmojiMarker marker) 
        {
            //Find score 
            var Score =  GetScoreByMarkerAndUser(marker, user);
            Score.Score = score;
            SaveChanges();
            return Score;
        }

        public virtual DTO_EmojiScore GetScoreByMarkerAndUser(DTO_EmojiMarker marker, string user) 
        {
            if (ScoreExistsByMarkerAndUser(marker, user)) {
                return this.Score.First(o => o.User == user && o.Marker == marker);
            }

            return null;
        }

        public DTO_EmojiScore[] GetScoresForMarker(DTO_EmojiMarker marker) 
        {
            return this.Score.Where(o => o.Marker == marker).ToArray();
        }

        public virtual bool ScoreExistsByMarkerAndUser(DTO_EmojiMarker marker, string user) 
        {
            return this.Score.Any(o => o.Marker == marker && o.User == user);
        }

        public virtual bool ScoresForMarker(DTO_EmojiMarker marker) 
        {
            return this.Score.Any(o => o.Marker == marker);    
        }

        public virtual void DeleteScoreByUserAndMarker(string user, DTO_EmojiMarker marker) 
        {
            if (ScoreExistsByMarkerAndUser(marker, user)) {
                var ExistingScore = GetScoreByMarkerAndUser(marker, user);
                this.Score.Remove(ExistingScore);
                SaveChanges();
            }
        }

        public virtual DTO_EmojiMarker UpdateMarkerDeleteStatus(DTO_EmojiMarker marker) 
        {
            if (ScoresForMarker(marker)) {
                return EnableMarkerDeleteStatus(marker);
            } else {
                return DisableMarkerOnPosition(marker.DocumentURI, marker.Repository, marker.Line);
            }
        }
        private DTO_EmojiMarker EnableMarkerDeleteStatus(DTO_EmojiMarker marker) 
        {
            if (MarkerExistsOnPosition(marker.DocumentURI, marker.Repository, marker.Line)) {
                var ExistingMarker = GetMarkerByPosition(marker.DocumentURI, marker.Repository, marker.Line);
                ExistingMarker.SoftDelete = false;
                SaveChanges();
                return ExistingMarker;
            }

            return null;
        }

        public DTO_EmojiMarker DisableMarkerOnPosition(string document, string repository, int line) 
        {
            if (MarkerExistsOnPosition(document, repository, line)) {
                var ExistingMarker = GetMarkerByPosition(document, repository, line);
                ExistingMarker.SoftDelete = true;
                SaveChanges();
                return ExistingMarker;
            }

            return null;
        }

        public virtual DTO_ScoreOccurence[] GetScores(DTO_EmojiMarker marker) 
        {
            DTO_GradeEmoji[] gradeEmojis = GetGradeEmojis();
            DTO_ScoreOccurence[] occurences = new DTO_ScoreOccurence[gradeEmojis.Length];
            for(int i = 0; i < gradeEmojis.Length; i++) {
                occurences[i] = new DTO_ScoreOccurence(gradeEmojis[i].value, this.Score.Count(o => o.Score == gradeEmojis[i].value && o.Marker == marker));
            }

            return occurences;
        }

        public virtual DTO_GradeEmoji[] GetGradeEmojis() 
        {
            DTO_GradeEmoji[] gradeEmojis = new DTO_GradeEmoji[3];
            gradeEmojis[0] = new DTO_GradeEmoji(2);
            gradeEmojis[1] = new DTO_GradeEmoji(0);
            gradeEmojis[2] = new DTO_GradeEmoji(-2);

            return gradeEmojis;
        }

        // Just so migrations work.........
        public EmojiContext() {}
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Data Source=WISH\\SQLEXPRESS;Initial Catalog=emojiExtension;Integrated Security=True");
        }
    }
}

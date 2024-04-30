using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplicationTemplate.Server.Entities
{
    [Table("Topics")]
    public class UserTopic
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int Id { get; set; }

        [ForeignKey("TopicId")]
        public int TopicId { get; set; }
        public Topic Topic { get; set; } = default!;

        [ForeignKey("UserId")]
        public int UserId { get; set; }
        public User User { get; set; } = default!;
    }

    public class UserTopicEntityConfiguration : IEntityTypeConfiguration<UserTopic>
    {
        public void Configure(EntityTypeBuilder<UserTopic> builder)
        {
            builder.ToTable("UserTopics");

        }
    }
}

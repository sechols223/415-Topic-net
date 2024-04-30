using System.ComponentModel.DataAnnotations;

namespace WebApplicationTemplate.Server.Dtos
{
    public class PostDto
    {
        [Range(1, int.MaxValue)]
        public int AuthorId { get; set; }

        [Range(1, int.MaxValue)]
        public int TopicId { get; set; }

        [MinLength(2)]
        public required string Content { get; set; }

    }

    public class PostGetDto : PostDto 
    {
        public int Id { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public UserDto Author { get; set; } = default!;
    }

    public class PostCreateDto : PostDto
    {
        
    }

}

using System.ComponentModel.DataAnnotations;

namespace WebApplicationTemplate.Server.Dtos
{
    public class TopicDto
    {
        [MinLength(2)]
        public required string Title { get; set; }
        [MinLength(2)]
        public required string Description { get; set; }
    }

    public class TopicGetDto : TopicDto
    {
        public int Id { get; set; }

    }

    public class TopicCreateDto : TopicDto
    {

    }
}

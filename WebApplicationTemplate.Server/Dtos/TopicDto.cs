namespace WebApplicationTemplate.Server.Dtos
{
    public class TopicDto
    {
        public required string Title { get; set; }
    }

    public class TopicGetDto : TopicDto
    {
        public int Id { get; set; }

    }

    public class TopicCreateDto : TopicDto
    {

    }
}

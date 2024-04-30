namespace WebApplicationTemplate.Server.Dtos
{
    public class UserTopicDto
    {
        public int UserId { get; set; }
        public int PostId { get; set; }
    }

    public class UserTopicGetDto 
    {
        public int Id { get; set; }
        public TopicGetDto Topic { get; set; } = default!;
    }

    public class UserTopicCreateDto
    {
        public int UserId { get; set; }
        public int TopicId { get; set; }
    }

}

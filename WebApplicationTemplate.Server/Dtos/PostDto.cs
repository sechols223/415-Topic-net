namespace WebApplicationTemplate.Server.Dtos
{
    public class PostDto
    {
        public int Id { get; set; }
    }

    public class PostGetDto : PostDto 
    {
        public int TopicId { get;set; }
        public required string Content { get; set; }
    }

    public class PostCreateDto
    {
        public int TopicId { get; set; }
        public required string Content { get; set; }
    }

}

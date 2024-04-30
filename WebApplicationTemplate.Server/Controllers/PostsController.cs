using Microsoft.AspNetCore.Mvc;
using WebApplicationTemplate.Server.Data;
using WebApplicationTemplate.Server.Dtos;
using WebApplicationTemplate.Server.Entities;

namespace WebApplicationTemplate.Server.Controllers
{
    [ApiController]
    [Route("/api/posts")]
    public class PostsController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public PostsController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpGet]
        public ActionResult<List<PostGetDto>> GetAll()
        {
            var data = _dataContext.Set<Post>().Select(ToDto).ToList();
            return Ok(data);
        }

        [HttpGet("{topicId}")]
        public ActionResult<List<PostGetDto>> GetByTopicId(int topicId)
        {
            var data = _dataContext.Set<Post>()
                .Where(x => x.TopicId == topicId)
                .OrderByDescending(x => x.CreatedOn)
                .Take(2)
                .Select(ToDto)
                .ToList();

            return data;
        }

        [HttpPost]
        public async Task<ActionResult<PostGetDto>> CreatePost(PostCreateDto dto)
        {
            var topic = await _dataContext.Set<Topic>().FindAsync(dto.TopicId);
            if (topic == null)
                return NotFound("Topic not found");
            var post = new Post
            {
                CreatedOn = DateTimeOffset.Now,
                Content = dto.Content,
                Topic = topic
            };

            _dataContext.Set<Post>().Add(post);
            await _dataContext.SaveChangesAsync();

            var result = ToDto(post);

            return Ok(result);
        }

        private PostGetDto ToDto(Post post)
        {
            var dto = new PostGetDto() 
            {
                Id = post.Id,
                Content = post.Content
            };

            return dto;
        }


    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplicationTemplate.Server.Data;
using WebApplicationTemplate.Server.Dtos;
using WebApplicationTemplate.Server.Entities;
using WebApplicationTemplate.Server.Extensions;

namespace WebApplicationTemplate.Server.Controllers
{
    [ApiController]
    [Route("/api/posts")]
    public class PostsController(DataContext dataContext, UserManager<User> userManager) : ControllerBase
    {
        private readonly DataContext _dataContext = dataContext;
        private readonly UserManager<User> _userManager = userManager;

        [HttpGet]
        public ActionResult<List<PostGetDto>> GetAll()
        {
            var data = _dataContext.Set<Post>().Select(ToDto).ToList();
            return Ok(data);
        }

        [HttpGet("{topicId}")]
        public ActionResult<List<PostGetDto>> GetByTopicId(int topicId)
        {
            var data = _dataContext
                .Set<Post>()
                .Include(x => x.Author)
                .Where(x => x.TopicId == topicId)
                .OrderByDescending(x => x.CreatedOn)
                .Take(2)
                .Select(ToDto)
                .ToList();

            return data;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<PostGetDto>> CreatePost(PostCreateDto dto)
        {
            
            var user = await HttpContext.GetCurrentUser(_userManager);
            if (user == null)
                return Unauthorized();

            var topic = await _dataContext.Set<Topic>().FindAsync(dto.TopicId);

            if (topic == null)
                return NotFound("Topic not found");

            var post = new Post
            {
                CreatedOn = DateTimeOffset.Now,
                Content = dto.Content,
                Topic = topic,
                Author = user
               
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
                Content = post.Content,
                CreatedOn = post.CreatedOn,
                Author = post.Author.ToDto(),
                AuthorId = post.AuthorId
            };

            return dto;
        }


    }
}

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
            dataContext = _dataContext;
        }
        [HttpGet]
        public ActionResult<List<PostGetDto>> GetAll()
        {
            var data = _dataContext.Set<Post>().Select(ToDto).ToList();
            return Ok(data);
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

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
    [Route("/api/topics")]
    public class TopicsController : ControllerBase
    {

        private readonly DataContext _dataContext;
        private readonly UserManager<User> _userManager;

        public TopicsController(DataContext dataContext, UserManager<User> userManager)
        {
            _dataContext = dataContext;
            _userManager = userManager;
        }

        [HttpGet]
        public ActionResult<List<TopicGetDto>> GetAll()
        {
            var data = _dataContext
                .Set<Topic>()
                .Select(ToDto)
                .ToList();

            return data;

        }

        [HttpPost]
        public async Task<ActionResult<TopicGetDto>> CreateTask([FromBody] TopicCreateDto dto)
        {
            var topic = new Topic
            {
                Title = dto.Title,
                Description = dto.Description
            };

            _dataContext.Set<Topic>().Add(topic);
            await _dataContext.SaveChangesAsync();
            var user = await HttpContext.GetCurrentUser(_userManager);
            if (user != null)
            {
                var userTopic = new UserTopic
                {
                    User = user,
                    Topic = topic
                };

                _dataContext.Set<UserTopic>().Add(userTopic);
                await _dataContext.SaveChangesAsync();
            }
            

            var result = ToDto(topic);
            return Ok(result);

        }

        [HttpPost("/subscribe")]

        private TopicGetDto ToDto(Topic topic)
        {
            var dto = new TopicGetDto
            {
                Id = topic.Id,
                Title = topic.Title,
                Description = topic.Description
            };
            return dto;
        }
    }
}

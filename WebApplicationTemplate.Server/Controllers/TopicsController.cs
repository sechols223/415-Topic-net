using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplicationTemplate.Server.Data;
using WebApplicationTemplate.Server.Dtos;
using WebApplicationTemplate.Server.Entities;

namespace WebApplicationTemplate.Server.Controllers
{
    [ApiController]
    [Route("/api/topics")]
    public class TopicsController : ControllerBase
    {

        private readonly DataContext _dataContext;
        public TopicsController(DataContext dataContext)
        {
            _dataContext = dataContext;
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
            };

            _dataContext.Set<Topic>().Add(topic);
            await _dataContext.SaveChangesAsync();

            var result = ToDto(topic);
            return Ok(result);

        }

        [HttpPost("/subscribe")]

        private TopicGetDto ToDto(Topic topic)
        {
            var dto = new TopicGetDto
            {
                Id = topic.Id,
                Title = topic.Title
            };
            return dto;
        }
    }
}

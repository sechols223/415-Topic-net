using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplicationTemplate.Server.Data;
using WebApplicationTemplate.Server.Dtos;
using WebApplicationTemplate.Server.Entities;

namespace WebApplicationTemplate.Server.Controllers
{
    [ApiController]

    [Route("/api/usertopics")]
    public class UserTopicsController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public UserTopicsController(DataContext dataContext)
        {
            _dataContext = dataContext;         
        }

        [HttpGet("test")]
        public ActionResult<int[]> GetTest()
        {
            int[] data = [1, 2, 34];
            return Ok(data);
        }

        [HttpGet("all")]
        public ActionResult<List<UserTopicGetDto>> GetAll()
        {
            var data = _dataContext.Set<UserTopic>()
                .Include(x => x.Topic)
                .Select(ToDto)
                .ToList();

            return Ok(data);
        }

        [HttpPost("subscribe")]
        public async Task<ActionResult<UserTopicGetDto>> Subscribe([FromBody] UserTopicCreateDto dto)
        {
            var topic = await _dataContext.Set<Topic>().FindAsync(dto.TopicId);
            if (topic == null)
                return NotFound("Topic not found");

            var user = await _dataContext.Set<User>().FindAsync(dto.UserId);
            if (user == null)
                return NotFound("User not found");

            var newTopic = new UserTopic
            {
                Topic = topic,
                User = user
            };

            _dataContext.Set<UserTopic>().Add(newTopic);
            await _dataContext.SaveChangesAsync();

            var result = ToDto(newTopic);
            return Ok(result);

        }

        [HttpDelete("{userId}/{topicId}")]
        public async Task<ActionResult> Unsubscribe(int userId, int topicId)
        {
            return NoContent();
        }


        private UserTopicGetDto ToDto(UserTopic userTopic)
        {
            return new UserTopicGetDto
            {
                Id = userTopic.Id,
                Topic = new TopicGetDto
                {
                    Id = userTopic.TopicId,
                    Title = userTopic.Topic.Title,
                    Description = userTopic.Topic.Description
                }
            };
        }

    }
}

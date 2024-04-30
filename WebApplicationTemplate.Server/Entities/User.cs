using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApplicationTemplate.Server.Dtos;

namespace WebApplicationTemplate.Server.Entities;

// Add profile data for application users by adding properties to the User class
public class User : IdentityUser<int>
{
    public required string Firstname { get; set; }
    public required string Lastname { get; set; }

    public ICollection<UserRole> Roles { get; set; } = new List<UserRole>();

    public UserDto ToDto()
    {
        return new UserDto
        {
            Id = Id,
            Email = Email ?? string.Empty,
            Username = UserName ?? string.Empty,
            Firstname = Firstname ?? string.Empty,
            Lastname = Lastname ?? string.Empty,
        };
    }
}

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {

    }
}
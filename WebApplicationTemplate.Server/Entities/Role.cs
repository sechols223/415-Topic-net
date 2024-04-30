using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace WebApplicationTemplate.Server.Entities;

public class Role : IdentityRole<int>
{
    public ICollection<UserRole> Users { get; set; } = new List<UserRole>();
}

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {

    }
}
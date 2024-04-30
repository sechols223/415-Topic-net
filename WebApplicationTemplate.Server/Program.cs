using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebApplicationTemplate.Server.Data;
using WebApplicationTemplate.Server.Entities;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DataContextConnection") ?? throw new InvalidOperationException("Connection string 'DataContextConnection' not found.");

builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlite("db.dat");
    options.LogTo(Console.WriteLine, new[] { DbLoggerCategory.Query.Name, DbLoggerCategory.Migrations.Name });
    options.EnableDetailedErrors();
    
});
builder.Services.AddDefaultIdentity<User>(options =>
{
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<DataContext>();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateAsyncScope())
{
    var context = scope.ServiceProvider.GetRequiredService<DataContext>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
    //var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<Role>>();

    await context.Database.EnsureDeletedAsync();
    await context.Database.EnsureCreatedAsync();

    var role = new Role
    {
        Name = "User"
    };
    var user = new User 
    {
        UserName = "billnye123",
        Firstname = "Bill",
        Lastname = "Nye",
        PhoneNumber = "1234567890",
        Email = "email@email.com"
    };

    //await roleManager.CreateAsync(role);
    await userManager.CreateAsync(user);
    await userManager.AddPasswordAsync(user, "Password123!");
    //await userManager.AddToRoleAsync(user, "User");

    await context.SaveChangesAsync();
}

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();

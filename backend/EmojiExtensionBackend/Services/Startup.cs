using System;
using System.Collections.Generic;
using System.Text;
using EmojiExtensionBackend.DAL;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.EntityFrameworkCore;

[assembly: FunctionsStartup(typeof(EmojiExtensionBackend.Services.Startup))]

namespace EmojiExtensionBackend.Services
{
    class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            string connectionString = Environment.GetEnvironmentVariable("EmojiContext");
            builder.Services.AddDbContext<EmojiContext>(
              options => options.UseSqlServer(connectionString));
        }
    }
}

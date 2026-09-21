using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.FileProviders;

// To run this:
// 1. Install .NET SDK
// 2. Create a new minimal web API: dotnet new web -n BeatsVibeServer
// 3. Replace Program.cs with this content
// 4. Run with: dotnet run

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var port = 5000;
var razorpayKeyId = "rzp_test_TU6zzd7qlXCLZs";
var razorpayKeySecret = "UPYyQwzaQrNEixYnB1xS0yc4";

var rootDir = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), ".."));

// Enable static files from root dir
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(rootDir),
    RequestPath = ""
});

// Route Map
var routes = new Dictionary<string, string>
{
    { "/", "index.html" },
    { "/index.html", "index.html" },
    { "/dashboard", "dashboard.html" },
    { "/dashboard.html", "dashboard.html" },
    { "/course-details", "course-details.html" },
    { "/course-details.html", "course-details.html" },
    { "/login", "login.html" },
    { "/login.html", "login.html" },
    { "/register", "register.html" },
    { "/register.html", "register.html" },
    { "/programs", "programs.html" },
    { "/programs.html", "programs.html" },
    { "/admin", "admin.html" },
    { "/admin.html", "admin.html" }
};

foreach (var route in routes)
{
    app.MapGet(route.Key, async context =>
    {
        var filePath = Path.Combine(rootDir, route.Value);
        await context.Response.SendFileAsync(filePath);
    });
}

// Order API
app.MapPost("/api/payment/create-order", async context =>
{
    try
    {
        using var reader = new StreamReader(context.Request.Body);
        var body = await reader.ReadToEndAsync();
        var data = JsonSerializer.Deserialize<JsonElement>(body);

        int amount = 0;
        if (data.TryGetProperty("amount", out var amountProp)) {
            if (amountProp.ValueKind == JsonValueKind.Number) amount = amountProp.GetInt32();
            if (amountProp.ValueKind == JsonValueKind.String) int.TryParse(amountProp.GetString(), out amount);
        }
        amount *= 100;

        string studentId = "unknown";
        if (data.TryGetProperty("studentId", out var studentProp)) {
            studentId = studentProp.GetString() ?? "unknown";
        }

        var payload = new
        {
            amount = amount,
            currency = "INR",
            receipt = $"rcpt_{studentId}_{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}"
        };

        var client = new HttpClient();
        var authString = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{razorpayKeyId}:{razorpayKeySecret}"));
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authString);

        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
        var response = await client.PostAsync("https://api.razorpay.com/v1/orders", content);
        
        var responseString = await response.Content.ReadAsStringAsync();
        var orderData = JsonSerializer.Deserialize<JsonElement>(responseString);

        await context.Response.WriteAsJsonAsync(new { success = true, order = orderData });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Order Creation Error: {ex.Message}");
        context.Response.StatusCode = 500;
        await context.Response.WriteAsJsonAsync(new { success = false, message = "Something went wrong with Razorpay!" });
    }
});

app.Run($"http://localhost:{port}");

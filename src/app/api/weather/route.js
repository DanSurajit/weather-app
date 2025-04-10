export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return Response.json(
      { message: "City parameter is required" },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch weather data");
    }

    const weather = {
      city: data.name,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      description: data.weather[0].description,
    };

    return Response.json(weather);
  } catch (error) {
    console.error("Weather API error:", error);
    return Response.json(
      { message: error.message || "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}

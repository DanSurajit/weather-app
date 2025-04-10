const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "wft-geo-db.p.rapidapi.com";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";

  if (!query || query.length < 2) {
    return Response.json([]);
  }

  try {
    const response = await fetch(
      `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(
        query
      )}&limit=5&sort=-population`,
      {
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch city suggestions");
    }

    const data = await response.json();
    const suggestions = data.data.map((city) => {
      const name = city.name;
      const country = city.countryCode;
      return `${name}, ${country}`;
    });

    return Response.json(suggestions);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return Response.json([], { status: 500 });
  }
}

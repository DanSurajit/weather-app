"use client";

import { useState, useEffect, useRef } from "react";
import WeatherBackground from "./WeatherBackground";

const getWeatherIcon = (condition) => {
  const icons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "🌨️",
    Mist: "🌫️",
    Haze: "🌫️",
    Fog: "🌫️",
  };
  return icons[condition] || "🌡️";
};

export default function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `/api/suggestions?q=${encodeURIComponent(city)}`
        );
        if (!response.ok) throw new Error("Failed to fetch suggestions");
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
        setSuggestions([]);
      }
    };

    if (city.trim().length >= 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [city]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const cityName = city.split(",")[0].trim();
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(cityName)}`
      );
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to fetch weather data");

      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : prev));
        break;
      case "Enter":
        if (selectedIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="min-h-screen w-full py-8 px-4 relative">
      <WeatherBackground condition={weather?.condition} />
      <div className="max-w-md mx-auto relative z-10">
        <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/10">
          <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
            Weather Forecast
          </h1>

          <form onSubmit={handleSubmit} className="mb-6 relative">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() =>
                    city.trim().length >= 2 && setShowSuggestions(true)
                  }
                  placeholder="Enter city name..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                           placeholder:text-white/50 text-white"
                  required
                />

                {showSuggestions && suggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute w-full mt-2 py-2 bg-gray-900/95 backdrop-blur-lg rounded-xl border border-white/10 shadow-xl z-20"
                  >
                    {suggestions.map((suggestion, index) => {
                      const [city, country] = suggestion
                        .split(",")
                        .map((s) => s.trim());
                      return (
                        <div
                          key={suggestion}
                          className={`px-4 py-2 cursor-pointer transition-colors
                            ${
                              index === selectedIndex
                                ? "bg-blue-500/20 text-white"
                                : "text-white/80 hover:bg-white/10"
                            }`}
                          onClick={() => handleSuggestionClick(suggestion)}
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          <span className="font-medium">{city}</span>
                          <span className="text-white/60 text-sm ml-2">
                            {country}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold 
                         rounded-xl transition-all duration-200 disabled:opacity-50 
                         disabled:cursor-not-allowed shadow-lg shadow-blue-500/30
                         hover:shadow-blue-500/50 active:scale-95 min-w-[100px]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⌛</span>
                    Loading...
                  </span>
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200">
              <p className="flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </p>
            </div>
          )}

          {weather && (
            <div className="rounded-xl overflow-hidden">
              <div className="p-6 backdrop-blur-sm bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {weather.city}
                  </h2>
                  <span
                    className="text-5xl"
                    role="img"
                    aria-label={weather.condition}
                  >
                    {getWeatherIcon(weather.condition)}
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-bold text-white">
                      {weather.temperature}°
                    </span>
                    <span className="text-2xl text-white/80">C</span>
                  </div>

                  <div className="space-y-3 text-white/80">
                    <p className="flex items-center gap-2">
                      <span className="font-medium text-white">Condition:</span>
                      {weather.condition}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium text-white">
                        Description:
                      </span>
                      {weather.description}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium text-white">Humidity:</span>
                      {weather.humidity}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

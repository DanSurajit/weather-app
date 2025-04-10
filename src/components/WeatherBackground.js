"use client";

import { useEffect, useState } from "react";

const WeatherBackground = ({ condition }) => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const createElements = () => {
      switch (condition?.toLowerCase()) {
        case "clear":
          return <div className="sun" />;
        case "clouds":
          return Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="cloud"
              style={{
                top: `${Math.random() * 40}%`,
                left: `-150px`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
              }}
            />
          ));
        case "rain":
        case "drizzle":
          return Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="raindrop"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ));

        case "snow":
          return Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="snowflake"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 2}s`,
              }}
            >
              ❄
            </div>
          ));

        case "thunderstorm":
          return Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="lightning"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${Math.random() * 40}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ));

        default:
          return null;
      }
    };

    setElements(createElements());
  }, [condition]);

  return (
    <div
      className={`weather-bg ${
        condition ? `weather-${condition.toLowerCase()}` : ""
      }`}
      style={{ overflow: "hidden" }}
    >
      {elements}
    </div>
  );
};

export default WeatherBackground;

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { SearchPage } from "./pages/SearchPage";

const globalStyles = `
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden; /* Bloqueia completamente o scroll da tela */
    background-color: whitesmoke;
    background-image: url("./assets/images/clouds.png");
    background-position: center;
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-size: cover;
    font-family: "Montserrat", system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
`;

const extractCity = (address) => {
  if (!address) return "Unknown City";
  return (
    address.city ||
    address.town ||
    address.village ||
    address.hamlet ||
    address.municipality ||
    address.county ||
    address.state ||
    address.country ||
    "Unknown City"
  );
};

export default function App() {
  const [locationData, setLocationData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherForCity = useCallback(async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      let latitude, longitude;

      if (query.includes(",")) {
        [latitude, longitude] = query.split(",").map((coord) => coord.trim());
      } else {
        const geocodeURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
        const geocodeRes = await axios.get(geocodeURL);
        const result = geocodeRes.data[0];

        if (!result) throw new Error("City not found");

        latitude = result.lat;
        longitude = result.lon;
      }

      const [locationRes, weatherRes] = await Promise.all([
        axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`),
        axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_min,temperature_2m_max&timezone=auto&forecast_days=8`)
      ]);

      setLocationData(locationRes.data);
      setWeatherData(weatherRes.data);
    } catch (err) {
      setError(err.message || "Failed to fetch weather data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeatherForCity(`${position.coords.latitude},${position.coords.longitude}`),
        () => fetchWeatherForCity("London")
      );
    } else {
      fetchWeatherForCity("London");
    }
  }, [fetchWeatherForCity]);

  const city = extractCity(locationData?.address);
  const country = locationData?.address?.country ?? "";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <style>{globalStyles}</style>
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <SearchPage
          country={country}
          city={city}
          currentTemperature={Math.floor(weatherData?.current?.temperature_2m ?? 0)}
          weatherCode={weatherData?.current?.weather_code ?? -1}
          minTemperature={Math.floor(weatherData?.daily?.temperature_2m_min[0] ?? 0)}
          maxTemperature={Math.floor(weatherData?.daily?.temperature_2m_max[0] ?? 0)}
          daily={weatherData?.daily}
          onSearch={fetchWeatherForCity}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
}
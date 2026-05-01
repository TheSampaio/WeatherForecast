import { Footer } from "../components/Footer";
import { TopSearchBar } from "../components/TopSearchBar";
import { WeatherCard } from "../components/WeatherCard";

const unknownCityTranslations = {
  en: "Unknown City",
  es: "Ciudad Desconocida",
  pt: "Cidade Desconhecida",
};

export function SearchPage({
  country,
  city,
  currentTemperature,
  minTemperature,
  maxTemperature,
  weatherCode,
  daily,
  onSearch,
  isLoading,
  error
}) {
  const lang = (navigator.language || "en").split("-")[0];
  
  const translatedCity = city === "Unknown City"
    ? unknownCityTranslations[lang] || unknownCityTranslations["en"]
    : city;

  return (
    <>
      <TopSearchBar onSearch={onSearch} isLoading={isLoading} />
      <WeatherCard
        country={country}
        city={translatedCity}
        currentTemperature={currentTemperature}
        minTemperature={minTemperature}
        maxTemperature={maxTemperature}
        weatherCode={weatherCode}
        daily={daily}
        language={lang}
        isLoading={isLoading}
        error={error}
      />
      <Footer />
    </>
  );
}
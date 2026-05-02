import clearIcon from "../assets/icons/clear.svg";
import cloudsIcon from "../assets/icons/clouds.svg";
import mistIcon from "../assets/icons/mist.svg";
import moderateHeavyRainIcon from "../assets/icons/moderate_heavy_rain.svg";
import noResultIcon from "../assets/icons/no-result.svg";
import rainIcon from "../assets/icons/rain.svg";
import snowIcon from "../assets/icons/snow.svg";
import thunderRainIcon from "../assets/icons/thunder_rain.svg";
import thunderIcon from "../assets/icons/thunder.svg";

const weatherCodeIcons = {
  0: clearIcon, 1: clearIcon,
  2: cloudsIcon, 3: cloudsIcon,
  45: mistIcon, 48: mistIcon,
  51: rainIcon, 53: rainIcon, 55: rainIcon, 56: rainIcon, 57: rainIcon,
  61: rainIcon, 63: moderateHeavyRainIcon, 65: moderateHeavyRainIcon,
  66: moderateHeavyRainIcon, 67: moderateHeavyRainIcon,
  71: snowIcon, 73: snowIcon, 75: snowIcon, 77: snowIcon,
  80: rainIcon, 81: moderateHeavyRainIcon, 82: moderateHeavyRainIcon,
  85: snowIcon, 86: snowIcon,
  95: thunderIcon, 96: thunderRainIcon, 99: thunderRainIcon,
};

const weatherDescriptions = {
  en: {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle",
    53: "Moderate drizzle", 55: "Dense drizzle", 56: "Light freezing drizzle",
    57: "Dense freezing drizzle", 61: "Slight rain", 63: "Moderate rain",
    65: "Heavy rain", 66: "Light freezing rain", 67: "Heavy freezing rain",
    71: "Slight snow fall", 73: "Moderate snow fall", 75: "Heavy snow fall",
    77: "Snow grains", 80: "Slight rain showers", 81: "Moderate rain showers",
    82: "Violent rain showers", 85: "Slight snow showers", 86: "Heavy snow showers",
    95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail",
  },
  es: {
    0: "Cielo despejado", 1: "Mayormente despejado", 2: "Parcialmente nublado", 3: "Nublado",
    45: "Niebla", 48: "Niebla con escarcha", 51: "Llovizna ligera",
    53: "Llovizna moderada", 55: "Llovizna densa", 56: "Llovizna helada ligera",
    57: "Llovizna helada intensa", 61: "Lluvia ligera", 63: "Lluvia moderada",
    65: "Lluvia intensa", 66: "Lluvia helada ligera", 67: "Lluvia helada intensa",
    71: "Nevada ligera", 73: "Nevada moderada", 75: "Nevada fuerte",
    77: "Granos de nieve", 80: "Chubascos ligeros", 81: "Chubascos moderados",
    82: "Chubascos violentos", 85: "Chubascos de nieve ligeros", 86: "Chubascos de nieve fuertes",
    95: "Tormenta", 96: "Tormenta con granizo leve", 99: "Tormenta con granizo fuerte",
  },
  pt: {
    0: "Céu limpo", 1: "Predominantemente limpo", 2: "Parcialmente nublado", 3: "Encoberto",
    45: "Névoa", 48: "Névoa com geada", 51: "Garoa leve",
    53: "Garoa moderada", 55: "Garoa intensa", 56: "Garoa congelante leve",
    57: "Garoa congelante intensa", 61: "Chuva fraca", 63: "Chuva moderada",
    65: "Chuva forte", 66: "Chuva congelante leve", 67: "Chuva congelante forte",
    71: "Neve fraca", 73: "Neve moderada", 75: "Neve forte",
    77: "Grãos de neve", 80: "Pancadas de chuva fracas", 81: "Pancadas de chuva moderadas",
    82: "Pancadas de chuva intensas", 85: "Pancadas de neve fracas", 86: "Pancadas de neve fortes",
    95: "Tempestade", 96: "Tempestade com granizo leve", 99: "Tempestade com granizo forte",
  },
};

const unknownDescriptions = { en: "Unknown", es: "Desconocido", pt: "Desconhecido" };

const getDayName = (dateStr, lang) => {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString(lang, { weekday: "short" }).substring(0, 3).toUpperCase();
};

export function WeatherCard({
  country,
  city,
  currentTemperature,
  minTemperature,
  maxTemperature,
  weatherCode,
  daily,
  language,
  isLoading,
  error
}) {
  const styles = {
    container: {
      width: "100%",
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      overflow: "hidden",
    },
    card: {
      width: "100%",
      maxHeight: "100%",
      padding: "24px",
      borderRadius: "12px",
      backgroundColor: "#200b64",
      backgroundImage: "url('../assets/images/clouds.png')",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundBlendMode: "soft-light",
      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.25)",
      color: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      overflowY: "auto",
      msOverflowStyle: "none", 
      scrollbarWidth: "none",
    },
    status: {
      padding: "40px",
      fontSize: "1.2rem",
      color: "#d1d1f0",
      textAlign: "center"
    },
    error: { color: "#ff6b6b", fontWeight: 500 },
    city: { margin: "0", fontSize: "1.8rem", fontWeight: "bold", textAlign: "center" },
    country: { margin: "4px 0 16px", fontSize: "1rem", fontWeight: 500, color: "#d1d1f0" },
    figure: { margin: "0 0 12px", display: "flex", flexDirection: "column", alignItems: "center" },
    image: { width: "110px", height: "110px", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" },
    description: { marginTop: "8px", fontSize: "1.1rem", fontStyle: "italic", color: "#eee" },
    degrees: { margin: "0 0 20px", fontSize: "3rem", fontWeight: "bold" },
    minmaxContainer: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      gap: "24px",
      marginBottom: "20px",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      paddingBottom: "20px"
    },
    minmaxBox: { display: "flex", flexDirection: "column", alignItems: "center" },
    minmaxTitle: { margin: 0, fontSize: "0.9rem", color: "#d1d1f0" },
    minmaxValue: { margin: "4px 0 0", fontSize: "1.2rem", fontWeight: "bold" },
    separator: { width: "2px", backgroundColor: "rgba(255,255,255,0.2)" },
    
    forecastGrid: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      gap: "16px",
      background: "rgba(0, 0, 0, 0.25)",
      borderRadius: "12px",
      padding: "16px",
      scrollbarWidth: "none", 
      msOverflowStyle: "none", 
    },
    forecastCol: { 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      gap: "8px",
      minWidth: "72px", 
      flexShrink: 0 
    },
    forecastDay: { fontSize: "0.85rem", fontWeight: "bold", color: "#d1d1f0", letterSpacing: "0.5px" },
    forecastIcon: { width: "38px", height: "38px" },
    forecastTempMax: { fontSize: "1rem", fontWeight: "bold" },
    forecastTempMin: { fontSize: "0.9rem", color: "#a0a0c0" }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <section className="responsive-card" style={{ ...styles.card, ...styles.status }}>Loading weather data...</section>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <section className="responsive-card" style={{ ...styles.card, ...styles.status, ...styles.error }}>{error}</section>
      </div>
    );
  }

  const descriptions = weatherDescriptions[language] || weatherDescriptions["en"];
  const fallbackText = unknownDescriptions[language] || unknownDescriptions["en"];
  const description = descriptions[weatherCode] || fallbackText;
  const iconSrc = weatherCodeIcons[weatherCode] || noResultIcon;

  return (
    <div style={styles.container}>
      <style>
        {`
          .responsive-card {
            max-width: 380px;
            transition: max-width 0.3s ease;
          }
          .responsive-card::-webkit-scrollbar {
            display: none;
          }
          
          .forecast-scroll-container {
            overflow-x: auto;
          }
          
          .forecast-scroll-container::-webkit-scrollbar {
            display: none;
          }

          @media (min-width: 768px) {
            .responsive-card {
              max-width: 600px;
            }
          }
        `}
      </style>

      <section className="responsive-card" style={styles.card} aria-label="Weather Information">
        <header style={{ textAlign: "center" }}>
          <h2 style={styles.city}>{city}</h2>
          {country && <p style={styles.country}>{country}</p>}
        </header>

        <figure style={styles.figure}>
          <img style={styles.image} src={iconSrc} alt={description} />
          <figcaption style={styles.description}>{description}</figcaption>
        </figure>

        <h1 style={styles.degrees}>{currentTemperature} °C</h1>

        <div style={styles.minmaxContainer}>
          <div style={styles.minmaxBox}>
            <h3 style={styles.minmaxTitle}>Min</h3>
            <span style={styles.minmaxValue}>{minTemperature} °C</span>
          </div>
          <div style={styles.separator}></div>
          <div style={styles.minmaxBox}>
            <h3 style={styles.minmaxTitle}>Max</h3>
            <span style={styles.minmaxValue}>{maxTemperature} °C</span>
          </div>
        </div>

        {daily && daily.time && (
          <div style={styles.forecastGrid} className="forecast-scroll-container">
            {daily.time.slice(0, 8).map((dateStr, index) => (
              <div key={dateStr} style={styles.forecastCol}>
                <span style={styles.forecastDay}>
                  {getDayName(dateStr, language)}
                </span>
                <img 
                  src={weatherCodeIcons[daily.weather_code[index]] || noResultIcon} 
                  style={styles.forecastIcon} 
                  alt="Daily Icon" 
                />
                <span style={styles.forecastTempMax}>{Math.floor(daily.temperature_2m_max[index])}°</span>
                <span style={styles.forecastTempMin}>{Math.floor(daily.temperature_2m_min[index])}°</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
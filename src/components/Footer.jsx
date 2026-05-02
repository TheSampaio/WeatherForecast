const footers = {
  en: "Weather Forecast",
  es: "Pronóstico del tiempo",
  pt: "Previsão do Tempo",
};

export function Footer() {
  const lang = (navigator.language || "en").split("-")[0];

  const styles = {
    container: {
      width: "100%",
      backgroundColor: "#200b64",
      padding: "16px",
      display: "flex",
      justifyContent: "flex-end",
      boxSizing: "border-box",
      position: "fixed",
      bottom: 0,
      left: 0,
      zIndex: 10
    },
    link: {
      color: "white",
      fontSize: "14px",
      textDecoration: "none",
    }
  };

  return (
    <footer style={styles.container}>
      <a 
        style={styles.link} 
        href="https://github.com/TheSampaio/weather-forecast-spa"
        target="_blank"
        rel="noopener noreferrer"
      >
        {footers[lang] || footers["en"]} © {new Date().getFullYear()} Cairox
      </a>
    </footer>
  );
}
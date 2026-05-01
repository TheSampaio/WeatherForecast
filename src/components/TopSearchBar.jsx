import { useState } from "react";

const placeholders = {
  en: "Search for a city...",
  es: "Busca una ciudad...",
  pt: "Busque por uma cidade...",
};

export function TopSearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState("");
  const lang = (navigator.language || "en").split("-")[0];
  const placeholderText = placeholders[lang] || placeholders["en"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery("");
    }
  };

  const styles = {
    container: {
      width: "100%",
      backgroundColor: "#200b64",
      padding: "16px",
      display: "flex",
      justifyContent: "center",
      flexShrink: 0,
      zIndex: 10,
    },
    form: {
      position: "relative",
      width: "100%",
      maxWidth: "360px",
    },
    icon: {
      position: "absolute",
      left: "16px",
      top: "50%",
      transform: "translateY(-50%)",
      width: "20px",
      height: "20px",
      color: "#888",
      pointerEvents: "none",
    },
    input: {
      backgroundColor: "whitesmoke",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      padding: "12px 16px 12px 48px",
      width: "100%",
      outline: "none",
      color: "#333",
      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)"
    }
  };

  return (
    <header style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={styles.icon}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
            clipRule="evenodd"
          />
        </svg>

        <input
          style={{ ...styles.input, opacity: isLoading ? 0.7 : 1 }}
          placeholder={placeholderText}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
          aria-label={placeholderText}
        />
      </form>
    </header>
  );
}
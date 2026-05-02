import { useState, useEffect } from "react";
import axios from "axios";

const placeholders = {
  en: "Search for a city...",
  es: "Busca una ciudad...",
  pt: "Busque por uma cidade...",
};

export function TopSearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const lang = (navigator.language || "en").split("-")[0];
  const placeholderText = placeholders[lang] || placeholders["en"];

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim() || query.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=${lang}&format=json`);
        // Adicionada filtragem para remover eventuais duplicatas exatas da API
        const uniqueResults = [];
        const seenIds = new Set();
        (res.data.results || []).forEach(item => {
          if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            uniqueResults.push(item);
          }
        });
        setSuggestions(uniqueResults);
      } catch {
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query, lang]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowDropdown(false);
      setQuery("");
    }
  };

  const handleSelect = (suggestion) => {
    onSearch(suggestion);
    setShowDropdown(false);
    setQuery("");
  };

  const styles = {
    container: {
      width: "100%",
      backgroundColor: "#200b64",
      padding: "16px",
      display: "flex",
      justifyContent: "center",
      flexShrink: 0,
      zIndex: 20,
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
    },
    dropdown: {
      position: "absolute",
      top: "100%",
      left: 0,
      width: "100%",
      backgroundColor: "whitesmoke",
      borderRadius: "8px",
      marginTop: "4px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      overflow: "hidden",
      listStyle: "none",
      padding: 0,
      margin: 0,
      zIndex: 30
    },
    item: {
      padding: "12px 16px",
      cursor: "pointer",
      borderBottom: "1px solid #ddd",
      color: "#333",
      display: "flex",
      flexDirection: "column",
      textAlign: "left"
    },
    itemTitle: {
      fontWeight: "bold",
      fontSize: "0.95rem",
      marginBottom: "2px"
    },
    itemSub: {
      fontSize: "0.8rem",
      color: "#666"
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
          onChange={(event) => {
            setQuery(event.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          disabled={isLoading}
          aria-label={placeholderText}
        />

        {showDropdown && suggestions.length > 0 && (
          <ul style={styles.dropdown}>
            {suggestions.map((s) => (
              <li
                key={s.id}
                style={styles.item}
                onMouseDown={() => handleSelect(s)}
              >
                <span style={styles.itemTitle}>{s.name}</span>
                <span style={styles.itemSub}>
                  {[s.admin1, s.country].filter(Boolean).join(", ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </form>
    </header>
  );
}
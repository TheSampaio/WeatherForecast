export function DebugConsole({ children, title }) {
  return (
    <div
      className="dev-console"
      style={{
        margin: "80px auto",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          overflowX: "auto",
          background: "#151b23",
          color: "whitesmoke",
          padding: "20px",
          borderRadius: "8px",
          boxSizing: "border-box",
          maxWidth: "100%",
        }}
      >
        <h2
          style={{
            margin: "0 0 16px 0",
          }}
        >
          {title}
        </h2>
        <pre style={{ margin: 0 }}>{children}</pre>
      </div>
    </div>
  );
}
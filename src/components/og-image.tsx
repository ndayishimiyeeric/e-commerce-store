import React from "react";

interface Props {
  title: string;
  url?: string;
  icon?: React.ReactNode;
  description?: string;
}

export const OpenGraphImage = ({ title, description, icon, url }: Props) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          height: "100%",
          width: "100%",
          backgroundImage:
            "linear-gradient(to right, #80808012 1px, transparent 1px), linear-gradient(to bottom, #80808012 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          fontSize: "2.5rem",
          lineHeight: 1,
          background: "#80808012",
          color: "#fff",
          padding: "1rem 1.75rem",
          borderRadius: 9999,
        }}
      >
        {`estore.nderic.com${url ? `/${url}` : ""}`}
      </div>
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          position: "absolute",
          bottom: 100,
          left: 60,
          width: "80%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "nowrap",
              borderRadius: "0.375rem",
              fontSize: "32px",
              lineHeight: "20px",
              fontWeight: "500",
              transitionProperty:
                "color, background-color, border-color, text-decoration-color, fill, stroke",
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              transitionDuration: "150ms",
              borderWidth: "1px",
              borderColor: "hsl(240 5.9% 90%)",
              backgroundColor: "hsl(0 0% 100%)",
              width: "3rem",
              height: "3rem",
            }}
          >
            {icon}
          </div>
          <span
            style={{
              fontSize: "5.25rem",
              lineHeight: 1,
              fontWeight: 600,
            }}
          >
            {title}
          </span>
        </div>
        {description && (
          <span style={{ fontSize: "2.5rem", lineHeight: "2.75rem" }}>
            {description}
          </span>
        )}
      </span>
    </div>
  );
};

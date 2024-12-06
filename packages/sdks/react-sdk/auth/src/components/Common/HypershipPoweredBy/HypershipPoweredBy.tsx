import React from "react";

export const HypershipPoweredBy: React.FC = () => {
  return (
    <div className="hypership-powered-by">
      Powered by
      <a
        href="https://hypership.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="hypership-link"
      >
        <img
          src="https://hypership.dev/logo.svg"
          alt="Hypership Logo"
          className="hypership-logo"
        />
        Hypership
      </a>
    </div>
  );
};

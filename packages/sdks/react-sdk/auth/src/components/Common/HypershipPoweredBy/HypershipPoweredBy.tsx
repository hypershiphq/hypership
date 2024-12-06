import React from "react";
import sharedStyles from "../../AuthComponents.module.css";

export const HypershipPoweredBy: React.FC = () => {
  return (
    <div className={sharedStyles["hypership-powered-by"]}>
      Powered by
      <a
        href="https://hypership.dev"
        target="_blank"
        rel="noopener noreferrer"
        className={sharedStyles["hypership-link"]}
      >
        <img
          src="https://hypership.dev/logo.svg"
          alt="Hypership Logo"
          className={sharedStyles["hypership-logo"]}
        />
        Hypership
      </a>
    </div>
  );
};

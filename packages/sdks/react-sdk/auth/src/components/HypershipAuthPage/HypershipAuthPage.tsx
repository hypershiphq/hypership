import React from "react";
import HypershipAuth from "../HypershipAuth/HypershipAuth";

interface HypershipAuthPageProps {
  onAuthSuccess: () => void;
  title?: string;
  backgroundImage?: string;
  rightComponent?: React.ReactNode;
}

export const HypershipAuthPage: React.FC<HypershipAuthPageProps> = ({
  onAuthSuccess,
  title = "Welcome to My App",
  backgroundImage,
  rightComponent,
}) => {
  const showRightSide = backgroundImage || rightComponent;

  return (
    <div
      className="auth-page-container"
      style={!showRightSide ? { justifyContent: "center" } : undefined}
    >
      {/* Left Side: HypershipAuth Component */}
      <div
        className="auth-page-left"
        style={!showRightSide ? { flex: "unset", width: "600px" } : undefined}
      >
        <h1 className="auth-page-title">{title}</h1>
        <div className="auth-form-container">
          <HypershipAuth onAuthSuccess={onAuthSuccess} />
        </div>
      </div>

      {/* Right Side: Background Image or Custom Component */}
      {showRightSide && (
        <div
          className="auth-page-right"
          style={
            backgroundImage
              ? {
                  backgroundImage: `url('${backgroundImage}')`,
                }
              : undefined
          }
        >
          {rightComponent}
        </div>
      )}
    </div>
  );
};

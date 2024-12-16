import React from "react";
import AuthFlow from "../AuthFlow/AuthFlow";

interface AuthFlowPageProps {
  onAuthSuccess: () => void;
  title?: string;
  /**
   * URL or path to background image. For local images, import them first:
   * import bgImage from './background.jpg';
   * Then pass the imported value: backgroundImage={bgImage}
   */
  backgroundImage?: string;
  rightComponent?: React.ReactNode;
}

export const AuthFlowPage: React.FC<AuthFlowPageProps> = ({
  onAuthSuccess,
  title = "",
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
          <AuthFlow onAuthSuccess={onAuthSuccess} />
        </div>
      </div>

      {/* Right Side: Background Image or Custom Component */}
      {showRightSide && (
        <div
          className="auth-page-right"
          style={
            backgroundImage
              ? {
                  backgroundImage: `url(${backgroundImage})`,
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

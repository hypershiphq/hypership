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
      className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900"
      style={!showRightSide ? { justifyContent: "center" } : undefined}
    >
      {/* Left Side: HypershipAuth Component */}
      <div
        className="flex flex-col justify-center items-center py-8 px-6 sm:px-10 md:px-16 flex-1 max-w-2xl transition-all duration-300 ease-in-out"
        style={!showRightSide ? { flex: "unset", width: "600px" } : undefined}
      >
        {title && (
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
            {title}
          </h1>
        )}
        <div className="w-full max-w-md mx-auto">
          <AuthFlow onAuthSuccess={onAuthSuccess} />
        </div>
      </div>

      {/* Right Side: Background Image or Custom Component */}
      {showRightSide && (
        <div
          className="hidden md:block flex-1 relative bg-cover bg-center"
          style={
            backgroundImage
              ? {
                  backgroundImage: `url(${backgroundImage})`,
                }
              : undefined
          }
        >
          {/* Add overlay gradient for better readability with background images */}
          {backgroundImage && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          )}

          {/* Container for right side content with proper z-index */}
          <div className="relative z-10 h-full flex items-center justify-center p-8">
            {rightComponent}
          </div>
        </div>
      )}
    </div>
  );
};

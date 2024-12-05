import React from "react";
import HypershipAuth from "../HypershipAuth/HypershipAuth";
import sharedStyles from "../AuthComponents.module.css";

interface HypershipAuthPageProps {
  onAuthSuccess: () => void;
  unstyled?: boolean;
  title?: string;
  backgroundImage?: string;
  rightComponent?: React.ReactNode;
}

const HypershipAuthPage: React.FC<HypershipAuthPageProps> = ({
  onAuthSuccess,
  unstyled = false,
  title = "Welcome to My App",
  backgroundImage,
  rightComponent,
}) => {
  const showRightSide = backgroundImage || rightComponent;

  return (
    <div
      className={unstyled ? "" : sharedStyles["auth-page-container"]}
      style={!showRightSide ? { justifyContent: "center" } : undefined}
    >
      {/* Left Side: HypershipAuth Component */}
      <div
        className={unstyled ? "" : sharedStyles["auth-page-left"]}
        style={!showRightSide ? { flex: "unset", width: "600px" } : undefined}
      >
        <h1 className={unstyled ? "" : sharedStyles["auth-page-title"]}>
          {title}
        </h1>
        <div className={unstyled ? "" : sharedStyles["auth-form-container"]}>
          <HypershipAuth onAuthSuccess={onAuthSuccess} unstyled={unstyled} />
        </div>
      </div>

      {/* Right Side: Background Image or Custom Component */}
      {showRightSide && (
        <div
          className={unstyled ? "" : sharedStyles["auth-page-right"]}
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

export default HypershipAuthPage;

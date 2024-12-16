import React from "react";
import { useHypershipAuth } from "../../packages/sdks/react-sdk/auth/src/index";

const Dashboard: React.FC = () => {
  // const { trackEvent } = useHypershipEvents();
  const { isAuthenticated, currentUser, signOut } = useHypershipAuth();

  // const handleButtonClick = () => {
  //   // Tracking the event with a lot of contextual information
  //   trackEvent("button-click", {
  //     plan: "Pro",
  //     userId: currentUser?.id || "anonymous",
  //     sessionId: "abcdef-123456",
  //     feature: "onboarding",
  //     isPremiumUser: true,
  //     location: "UK",
  //     platform: "web",
  //     browser: "Chrome",
  //     version: "1.0.0",
  //     page: "Dashboard",
  //     clickCount: 5,
  //     buttonColor: "blue",
  //     referral: "email_campaign",
  //     environment: "production",
  //   });
  // };

  return (
    <div>
      <h1>My Awesome App Dashboard</h1>

      {/* Display authentication status */}
      <div className="dashboard-container">
        {isAuthenticated && currentUser ? (
          <>
            <div className="user-profile">
              <div className="profile-header">
                <h2>Welcome back, {currentUser.username}</h2>
                <h3>{currentUser.id}</h3>
              </div>
            </div>
          </>
        ) : (
          <div className="auth-message">
            <h2>Please sign in to view your dashboard</h2>
            <p>Authentication Status: Not Authenticated</p>
          </div>
        )}
      </div>

      {/* Button to track events */}
      {/* <button onClick={handleButtonClick}>Track Event</button> */}
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

export default Dashboard;

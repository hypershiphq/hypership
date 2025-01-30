export interface CookieCategories {
  Analytics: boolean;
  Social: boolean;
  Advertising: boolean;
}

export interface ConsentStatus {
  consented: boolean;
  timestamp: string;
}

export interface DetailedCookieConsent {
  Analytics: ConsentStatus;
  Social: ConsentStatus;
  Advertising: ConsentStatus;
}

export interface CookieConsenterProps {
  /**
   * Text for the accept button
   * @default 'Accept'
   */
  buttonText?: string;

  /**
   * Text for the decline button
   * @default 'Decline'
   */
  declineButtonText?: string;

  /**
   * Text for the manage cookies button
   * @default 'Manage Cookies'
   */
  manageButtonText?: string;

  /**
   * Whether to show the manage cookies button
   * @default false
   */
  showManageButton?: boolean;

  /**
   * Text for the privacy policy link
   * @default 'Privacy Policy'
   */
  privacyPolicyText?: string;

  /**
   * URL for the privacy policy
   * If not provided, privacy policy link won't be shown
   */
  privacyPolicyUrl?: string;

  /**
   * Optional title for the cookie consent
   * @default ''
   */
  title?: string;

  /**
   * The message to display in the cookie consent banner
   * @default 'This website uses cookies to enhance your experience.'
   */
  message?: string;

  /**
   * Name of the cookie to store the consent
   * @default 'cookie-consent'
   */
  cookieName?: string;

  /**
   * Number of days until the cookie expires
   * @default 365
   */
  cookieExpiration?: number;

  /**
   * Display type of the consent UI
   * @default 'banner'
   */
  displayType?: "banner" | "popup" | "modal";

  /**
   * Position of the banner
   * @default 'bottom'
   */
  position?: "top" | "bottom";

  /**
   * Theme of the banner
   * @default 'light'
   */
  theme?: "light" | "dark";

  /**
   * Initial cookie category preferences
   * @default { Analytics: false, Social: false, Advertising: false }
   */
  initialPreferences?: CookieCategories;

  /**
   * Detailed consent information including timestamps
   */
  detailedConsent?: DetailedCookieConsent | null;

  /**
   * Callback function when cookies are accepted
   */
  onAccept?: () => void;

  /**
   * Callback function when cookies are declined
   */
  onDecline?: () => void;

  /**
   * Callback function when manage cookies is clicked or preferences are saved
   * If categories are provided, it means preferences were saved
   */
  onManage?: (categories?: CookieCategories) => void;

  /**
   * Whether the manage cookies view is currently shown
   * @default false
   */
  isManaging?: boolean;

  /**
   * Whether the consent UI is exiting
   */
  isExiting?: boolean;

  /**
   * Whether the consent UI is entering
   */
  isEntering?: boolean;

  /**
   * Whether to disable automatic blocking of common analytics and tracking scripts
   * When false (default), this will block common third-party tracking scripts and requests until consent is given
   * @default false
   */
  disableAutomaticBlocking?: boolean;

  /**
   * Custom domains to block in addition to the default list
   * Only applies when automatic blocking is enabled
   */
  blockedDomains?: string[];

  /**
   * Whether to force show the cookie consent banner
   * @default false
   */
  forceShow?: boolean;
}

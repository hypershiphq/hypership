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
   * Callback function when cookies are accepted
   */
  onAccept?: () => void;

  /**
   * Callback function when cookies are declined
   */
  onDecline?: () => void;

  /**
   * Callback function when manage cookies is clicked
   */
  onManage?: () => void;

  /**
   * Whether the consent UI is exiting
   */
  isExiting?: boolean;

  /**
   * Whether the consent UI is entering
   */
  isEntering?: boolean;
}

import "./styles/tailwind.css";
export { default as CookieConsenter } from "./components/CookieConsenter";
export type { CookieConsenterProps } from "./types/types";
export {
  CookieConsentProvider,
  useCookieConsent,
} from "./context/CookieConsentContext";
export type { CookieConsentProviderProps } from "./context/CookieConsentContext";

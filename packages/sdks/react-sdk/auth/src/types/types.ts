export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  metadata: Record<string, any>;
}

export interface AuthContextProps {
  user: User | null;
  theme: "light" | "dark";
  toggleTheme: () => void;
  signingIn: boolean; // Loading state while signing in
  signingUp: boolean; // Loading state while signing up
  authenticating: boolean; // Loading state while authenticating (initial auth)
  passwordResetting: boolean; // Loading state while resetting password
  passwordChanging: boolean; // Loading state while changing password
  confirmingAccount: boolean; // Loading state while confirming account
  confirmAccountCodeResending: boolean; // Loading state while resending confirmation code
  error: string | null;

  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  confirmAccount: (email: string, code: string) => Promise<void>;
  confirmAccountCodeResend: (email: string) => Promise<void>;
  passwordReset: (email: string) => Promise<void>;
  confirmPasswordResetCode: (email: string, code: string) => Promise<string>;
  passwordChange: (
    email: string,
    newPassword: string,
    changePasswordToken: string
  ) => Promise<void>;

  // SSO
  signInWithGithub: () => Promise<void>;
}

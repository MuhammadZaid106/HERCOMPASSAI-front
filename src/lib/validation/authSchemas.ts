import * as Yup from "yup";

/**
 * Persona / Role types aligned with HerCompassAI DNA
 */
export type UserPersona = "member" | "partner";

/**
 * Login Form Values & Schema
 */
export interface LoginFormValues {
  email: string;
  password: string;
  persona: UserPersona;
  rememberMe: boolean;
}

export const loginInitialValues: LoginFormValues = {
  email: "",
  password: "",
  persona: "member",
  rememberMe: true,
};

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  persona: Yup.mixed<UserPersona>()
    .oneOf(["member", "partner"])
    .required("Please select account type"),
  rememberMe: Yup.boolean().default(true),
});

/**
 * Register Form Values & Schema
 */
export interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserPersona;
  agreeToTerms: boolean;
}

export const registerInitialValues: RegisterFormValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "member",
  agreeToTerms: false,
};

export const registerValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  role: Yup.mixed<UserPersona>()
    .oneOf(["member", "partner"])
    .required("Please select your role"),
  agreeToTerms: Yup.boolean()
    .oneOf([true], "You must accept the terms & privacy policy to continue")
    .required("Consent is required"),
});

/**
 * Forgot Password Form Values & Schema
 */
export interface ForgotPasswordFormValues {
  email: string;
}

export const forgotPasswordInitialValues: ForgotPasswordFormValues = {
  email: "",
};

export const forgotPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
});

/**
 * Deterministic Password Strength Calculator
 */
export interface PasswordStrength {
  score: number; // 0 to 4
  label: "Weak" | "Fair" | "Good" | "Strong";
  colorClass: string;
  widthClass: string;
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: "Weak", colorClass: "bg-slate-200", widthClass: "w-0" };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  switch (score) {
    case 0:
    case 1:
      return { score: 1, label: "Weak", colorClass: "bg-rose-500", widthClass: "w-1/4" };
    case 2:
      return { score: 2, label: "Fair", colorClass: "bg-amber-500", widthClass: "w-2/4" };
    case 3:
      return { score: 3, label: "Good", colorClass: "bg-indigo-500", widthClass: "w-3/4" };
    case 4:
    default:
      return { score: 4, label: "Strong", colorClass: "bg-emerald-500", widthClass: "w-full" };
  }
}

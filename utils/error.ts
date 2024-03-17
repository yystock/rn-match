export const authError = {
  invalidEmail: "Invalid email",
  incorrectPassword: "Incorrect password",
  invalidPassword: "Invalid password",
} as const;

export type authErrorType = (typeof authError)[keyof typeof authError];

export type passwordCheck = {
  length: boolean;
  letter: boolean;
  number: boolean;
  equal: boolean;
};

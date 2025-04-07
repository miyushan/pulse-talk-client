import { isApolloError } from "./isApolloError";

export const handleLoginError = (error: unknown) => {
  console.error("Login error:", error);

  // Handle Apollo/GraphQL errors
  if (isApolloError(error)) {
    const graphQLError = error.graphQLErrors[0];
    if (graphQLError?.extensions?.code === "UNAUTHENTICATED") {
      return "Invalid email or password";
    }
    return graphQLError?.message || "Login failed";
  }

  if (error instanceof Error) {
    return error.message || "Network error";
  }

  return "An unexpected error occurred";
};

export const handleRegisterError = (error: unknown): string => {
  console.error("Registration error:", error);

  // Handle Apollo/GraphQL errors
  if (isApolloError(error)) {
    const message = error.graphQLErrors[0]?.message;
    const details = error.graphQLErrors[0]?.extensions?.details;

    if (error.graphQLErrors[0]?.extensions?.code === "BAD_USER_INPUT") {
      return typeof details === "string"
        ? details
        : "Invalid registration data";
    }
    return message || "Registration failed";
  }

  // Handle regular errors
  if (error instanceof Error) return error.message || "Network error";

  // Fallback
  return "An unexpected error occurred";
};

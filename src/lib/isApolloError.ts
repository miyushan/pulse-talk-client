import { ApolloError } from "@apollo/client";

export const isApolloError = (error: unknown): error is ApolloError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "graphQLErrors" in error &&
    "networkError" in error
  );
};

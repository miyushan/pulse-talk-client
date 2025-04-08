import { gql } from "@apollo/client";

export const SEARCH_USERS = gql`
  query SearchUsers($userName: String!) {
    searchUsers(userName: $userName) {
      id
      userName
    }
  }
`;

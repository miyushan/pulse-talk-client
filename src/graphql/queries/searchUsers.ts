import { gql } from "@apollo/client";

export const SEARCH_USERS = gql`
  query SearchUsers($input: SearchUsersInput!) {
    searchUsers(input: $input) {
      id
      userName
    }
  }
`;

import { gql } from "@apollo/client";

export const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser(
    $email: String!
    $firstName: String!
    $lastName: String
    $userName: String!
    $password: String!
  ) {
    registerUser(
      input: {
        email: $email
        firstName: $firstName
        lastName: $lastName
        password: $password
        userName: $userName
      }
    ) {
      message
      success
    }
  }
`;

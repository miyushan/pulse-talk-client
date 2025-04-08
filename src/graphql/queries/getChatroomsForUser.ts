import { gql } from "@apollo/client";

export const GET_CHATROOMS_FOR_USER = gql`
  query getChatRoomsForUser($userId: Float!) {
    getChatRoomsForUser(userId: $userId) {
      id
      name
      messages {
        id
        content
        createdAt
        user {
          id
          userName
        }
      }
      users {
        id
        userName
      }
    }
  }
`;

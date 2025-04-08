import { gql } from "@apollo/client";

export const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription NewMessage($chatRoomId: Float!) {
    newMessage(chatRoomId: $chatRoomId) {
      id
      content
      createdAt
      user {
        id
        userName
      }
    }
  }
`;

import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
  mutation SendMessage($chatRoomId: Float!, $content: String!) {
    sendMessage(chatRoomId: $chatRoomId, content: $content) {
      id
      content
      user {
        id
        userName
      }
    }
  }
`;

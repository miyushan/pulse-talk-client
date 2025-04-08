import { gql } from "@apollo/client";

export const GET_MESSAGES_FOR_CHATROOM = gql`
  query GetMessagesForChatroom($chatRoomId: Float!) {
    getMessagesForChatroom(chatRoomId: $chatRoomId) {
      id
      content
      createdAt
      user {
        id
        userName
      }
      chatRoom {
        id
        name
        users {
          id
          userName
        }
      }
    }
  }
`;

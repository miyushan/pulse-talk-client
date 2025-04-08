import { gql } from "@apollo/client";

export const GET_USERS_OF_CHATROOM = gql`
  query GetUsersOfChatroom($chatRoomId: Float!) {
    getUsersOfChatroom(chatRoomId: $chatRoomId) {
      id
      userName
    }
  }
`;

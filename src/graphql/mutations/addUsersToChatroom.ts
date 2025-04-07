import { gql } from "@apollo/client";

export const ADD_USERS_TO_CHATROOM = gql`
  mutation AddUsersToChatroom($chatRoomId: Float!, $userIds: [Float!]!) {
    addUsersToChatroom(chatRoomId: $chatRoomId, userIds: $userIds) {
      name
      id
    }
  }
`;

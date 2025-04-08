import { gql } from "@apollo/client";

export const USER_STOPPED_TYPING_SUBSCRIPTION = gql`
  subscription UserStoppedTyping($chatRoomId: Float!, $userId: Float!) {
    userStoppedTyping(chatRoomId: $chatRoomId, userId: $userId) {
      id
      userName
    }
  }
`;

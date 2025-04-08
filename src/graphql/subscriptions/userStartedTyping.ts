import { gql } from "@apollo/client";

export const USER_STARTED_TYPING_SUBSCRIPTION = gql`
  subscription UserStartedTyping($chatRoomId: Float!, $userId: Float!) {
    userStartedTyping(chatRoomId: $chatRoomId, userId: $userId) {
      id
      userName
    }
  }
`;

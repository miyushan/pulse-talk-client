import { gql } from "@apollo/client";

export const USER_STOPPED_TYPING_MUTATION = gql`
  mutation UserStoppedTypingMutation($chatRoomId: Float!) {
    userStoppedTypingMutation(chatRoomId: $chatRoomId) {
      id
      userName
    }
  }
`;

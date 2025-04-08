import { gql } from "@apollo/client";

export const USER_STARTED_TYPING_MUTATION = gql`
  mutation UserStartedTypingMutation($chatRoomId: Float!) {
    userStartedTypingMutation(chatRoomId: $chatRoomId) {
      id
      userName
      email
    }
  }
`;

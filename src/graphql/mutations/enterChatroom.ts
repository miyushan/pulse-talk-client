import { gql } from "@apollo/client";

export const ENTER_CHATROOM = gql`
  mutation EnterChatroom($chatRoomId: Float!) {
    enterChatroom(chatRoomId: $chatRoomId)
  }
`;

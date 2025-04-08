import { gql } from "@apollo/client";

export const LEAVE_CHATROOM = gql`
  mutation LeaveChatroom($chatRoomId: Float!) {
    leaveChatroom(chatRoomId: $chatRoomId)
  }
`;

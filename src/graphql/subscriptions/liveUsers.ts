import gql from "graphql-tag";

export const LIVE_USERS_SUBSCRIPTION = gql`
  subscription LiveUsersInChatroom($chatRoomId: Float!) {
    liveUsersInChatroom(chatRoomId: $chatRoomId) {
      id
      userName
    }
  }
`;

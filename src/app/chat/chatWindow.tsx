"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { useParams } from "next/navigation";
import { PaperclipIcon, SendHorizonalIcon, SmileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  USER_STARTED_TYPING_MUTATION,
  USER_STOPPED_TYPING_MUTATION,
  ENTER_CHATROOM,
  LEAVE_CHATROOM,
  SEND_MESSAGE,
} from "@/graphql/mutations";
import {
  LIVE_USERS_SUBSCRIPTION,
  USER_STOPPED_TYPING_SUBSCRIPTION,
  USER_STARTED_TYPING_SUBSCRIPTION,
  NEW_MESSAGE_SUBSCRIPTION,
} from "@/graphql/subscriptions";
import {
  GET_USERS_OF_CHATROOM,
  GET_MESSAGES_FOR_CHATROOM,
  GET_CHATROOMS_FOR_USER,
} from "@/graphql/queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFirstTwoChars } from "@/lib/getFirstTwoChars";
import { formatDateTime } from "@/lib/formatDateTime";
import { OtherUserBubble } from "./components/otherUserBubble";
import { CurrentUserBubble } from "./components/currentUserBubble";

const CHATROOM_ID = 1; // TODO: Need to be dynamic
const CURRENT_USER_ID = 17; // TODO: Need to be dynamic

export type User = {
  id: number;
  userName: string;
  avatarUrl?: string;
};

export type Message = {
  id: number;
  content: string;
  userId: number;
  chatRoomId: number;
  createdAt: Date;
  updatedAt: Date;
  user: User;
};

export function ChatWindow() {
  const isMediumDevice = useIsMobile();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const typingTimeoutsRef = useRef<Record<number, NodeJS.Timeout>>({});

  // State
  const [messageContent, setMessageContent] = useState("");
  const [typingUsers, setTypingUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isUserInChatroom, setIsUserInChatroom] = useState(false);

  // GraphQL Operations
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [enterChatroom] = useMutation(ENTER_CHATROOM);
  const [leaveChatroom] = useMutation(LEAVE_CHATROOM);
  const [userStartedTyping] = useMutation(USER_STARTED_TYPING_MUTATION);
  const [userStoppedTyping] = useMutation(USER_STOPPED_TYPING_MUTATION);

  // Subscriptions
  const { data: typingData } = useSubscription(
    USER_STARTED_TYPING_SUBSCRIPTION,
    {
      variables: { chatRoomId: CHATROOM_ID, userId: CURRENT_USER_ID },
    }
  );

  const { data: stoppedTypingData } = useSubscription(
    USER_STOPPED_TYPING_SUBSCRIPTION,
    {
      variables: { chatRoomId: CHATROOM_ID, userId: CURRENT_USER_ID },
    }
  );

  const { data: liveUsersData, loading: liveUsersLoading } = useSubscription(
    LIVE_USERS_SUBSCRIPTION,
    { variables: { chatRoomId: CHATROOM_ID } }
  );

  const { data: messagesData, loading: messagesLoading } = useQuery(
    GET_MESSAGES_FOR_CHATROOM,
    { variables: { chatRoomId: CHATROOM_ID } }
  );

  const { data: chatroomUsersData } = useQuery(GET_USERS_OF_CHATROOM, {
    variables: { chatRoomId: CHATROOM_ID },
  });

  const { data: newMessageData } = useSubscription(NEW_MESSAGE_SUBSCRIPTION, {
    variables: { chatRoomId: CHATROOM_ID },
  });

  // Handlers
  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;

    await sendMessage({
      variables: { chatRoomId: CHATROOM_ID, content: messageContent },
      refetchQueries: [
        {
          query: GET_CHATROOMS_FOR_USER,
          variables: { userId: CURRENT_USER_ID },
        },
      ],
    });
    setMessageContent("");
  };

  const handleTyping = useCallback(async () => {
    await userStartedTyping({ variables: { chatRoomId: CHATROOM_ID } });

    if (typingTimeoutsRef.current[CURRENT_USER_ID]) {
      clearTimeout(typingTimeoutsRef.current[CURRENT_USER_ID]);
    }

    typingTimeoutsRef.current[CURRENT_USER_ID] = setTimeout(async () => {
      setTypingUsers((prev) =>
        prev.filter((user) => user.id !== CURRENT_USER_ID)
      );
      await userStoppedTyping({ variables: { chatRoomId: CHATROOM_ID } });
    }, 2000);
  }, [userStartedTyping, userStoppedTyping]);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  // Effects
  useEffect(() => {
    const handleEnter = async () => {
      await enterChatroom({ variables: { chatRoomId: CHATROOM_ID } });
    };

    handleEnter();
    return () => {
      leaveChatroom({ variables: { chatRoomId: CHATROOM_ID } });
      window.removeEventListener("beforeunload", () =>
        leaveChatroom({ variables: { chatRoomId: CHATROOM_ID } })
      );
    };
  }, [enterChatroom, leaveChatroom]);

  useEffect(() => {
    if (messagesData?.getMessagesForChatroom) {
      setMessages(messagesData.getMessagesForChatroom);
      scrollToBottom();
    }
  }, [messagesData, scrollToBottom]);

  useEffect(() => {
    if (newMessageData?.newMessage) {
      setMessages((prev) => [...prev, newMessageData.newMessage]);
      scrollToBottom();
    }
  }, [newMessageData, scrollToBottom]);

  useEffect(() => {
    if (chatroomUsersData?.getUsersOfChatroom) {
      setIsUserInChatroom(
        chatroomUsersData.getUsersOfChatroom.some(
          (user: User) => user.id === CURRENT_USER_ID
        )
      );
    }
  }, [chatroomUsersData]);

  useEffect(() => {
    if (typingData?.userStartedTyping) {
      setTypingUsers((prev) =>
        prev.some((u) => u.id === typingData.userStartedTyping.id)
          ? prev
          : [...prev, typingData.userStartedTyping]
      );
    }
  }, [typingData]);

  useEffect(() => {
    if (stoppedTypingData?.userStoppedTyping) {
      const userId = stoppedTypingData.userStoppedTyping.id;
      clearTimeout(typingTimeoutsRef.current[userId]);
      setTypingUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  }, [stoppedTypingData]);

  if (!isUserInChatroom) return null;

  const totalUsers = chatroomUsersData?.getUsersOfChatroom.length || 0;
  const onlineUsers = liveUsersData?.liveUsersInChatroom.length || 0;

  return null;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex flex-col h-full">
        {/* Chat header */}
        <div className="p-4 border-b bg-white dark:bg-gray-800 flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{getFirstTwoChars("adas")}</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="ml-3">
              <h3 className="font-medium">Team Chat #1</h3>
              <p className="text-sm text-gray-500">
                {totalUsers} members, {onlineUsers} online
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full flex-1 px-6 space-y-4">
            {messages?.map((msg) => {
              const isSentByCurrentUser = msg.user.id === CURRENT_USER_ID;
              if (!isSentByCurrentUser) {
                return <CurrentUserBubble key={msg.id} msg={msg} />;
              }
              return <OtherUserBubble key={msg.id} msg={msg} />;
            })}
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="px-6 pt-4 pb-6 border-t bg-white dark:bg-gray-800 flex items-center gap-4">
          <Input
            onKeyDown={handleTyping}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            classNames={{
              input: "h-12 bg-slate-100",
            }}
          />

          <Button onClick={handleSendMessage} size="icon" className="h-12 w-12">
            <SendHorizonalIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

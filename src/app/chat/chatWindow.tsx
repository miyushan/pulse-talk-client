"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { useParams } from "next/navigation";
import { PaperclipIcon, SendHorizonalIcon, SmileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useMobile";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFirstTwoChars } from "@/lib/getFirstTwoChars";
import { OtherUserBubble } from "./components/otherUserBubble";
import { CurrentUserBubble } from "./components/currentUserBubble";
import { useAppStore } from "@/store/appStore";
import { Skeleton } from "@/components/ui/skeleton";

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

export type Chat = {
  id: number;
  name: string;
  users: User[];
};

export function ChatWindow() {
  const isMediumDevice = useIsMobile();

  const { userId, selectedChatRoomId, selectedChatRoomName, selectChatRoom } =
    useAppStore((state) => state);

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
      variables: { chatRoomId: selectedChatRoomId, userId: userId },
    }
  );

  const { data: stoppedTypingData } = useSubscription(
    USER_STOPPED_TYPING_SUBSCRIPTION,
    {
      variables: { chatRoomId: selectedChatRoomId, userId: userId },
    }
  );

  const { data: liveUsersData, loading: liveUsersLoading } = useSubscription(
    LIVE_USERS_SUBSCRIPTION,
    { variables: { chatRoomId: selectedChatRoomId } }
  );

  const { data: messagesData, loading: messagesLoading } = useQuery(
    GET_MESSAGES_FOR_CHATROOM,
    { variables: { chatRoomId: selectedChatRoomId } }
  );

  const { data: chatroomUsersData } = useQuery(GET_USERS_OF_CHATROOM, {
    variables: { chatRoomId: selectedChatRoomId },
  });

  const { data: newMessageData } = useSubscription(NEW_MESSAGE_SUBSCRIPTION, {
    variables: { chatRoomId: selectedChatRoomId },
  });

  // Handlers
  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;

    const res = await sendMessage({
      variables: { chatRoomId: selectedChatRoomId, content: messageContent },
      refetchQueries: [
        {
          query: GET_CHATROOMS_FOR_USER,
          variables: { userId: userId },
        },
      ],
    });
    setMessages((prev) => [...prev, res.data.sendMessage]);
    setMessageContent("");
  };

  const handleTyping = useCallback(async () => {
    await userStartedTyping({ variables: { chatRoomId: selectedChatRoomId } });

    if (typingTimeoutsRef.current[userId]) {
      clearTimeout(typingTimeoutsRef.current[userId]);
    }

    typingTimeoutsRef.current[userId] = setTimeout(async () => {
      setTypingUsers((prev) => prev.filter((user) => user?.id !== userId));
      await userStoppedTyping({
        variables: { chatRoomId: selectedChatRoomId },
      });
    }, 2000);
  }, [userStartedTyping, userStoppedTyping, selectedChatRoomId, userId]);

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
      await enterChatroom({ variables: { chatRoomId: selectedChatRoomId } });
    };

    handleEnter();
    return () => {
      leaveChatroom({ variables: { chatRoomId: selectedChatRoomId } });
      window.removeEventListener("beforeunload", () =>
        leaveChatroom({ variables: { chatRoomId: selectedChatRoomId } })
      );
    };
  }, [enterChatroom, leaveChatroom, selectedChatRoomId]);

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
          (user: User) => user?.id === userId
        )
      );
    }
  }, [userId, chatroomUsersData]);

  useEffect(() => {
    if (typingData?.userStartedTyping) {
      setTypingUsers((prev) =>
        prev.some((u) => u?.id === typingData.userStartedTyping.id)
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

  if (selectedChatRoomId === 0) {
    return (
      <div className="flex flex-col gap-2 h-screen justify-center items-center">
        Please select a chat.
      </div>
    );
  }
  if (messagesLoading) {
    return (
      <div className="flex flex-col gap-2 h-screen justify-center items-center">
        <Skeleton className="w-[300px] h-[20px] rounded-xl mx-4" />
        <Skeleton className="w-[300px] h-[20px] rounded-xl mx-4" />
      </div>
    );
  }

  if (!isUserInChatroom) return null;

  const totalUsers = chatroomUsersData?.getUsersOfChatroom.length || 0;
  const onlineUsers = liveUsersData?.liveUsersInChatroom.length || 0;

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
              <h3 className="font-medium">{selectedChatRoomName}</h3>
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
              console.log("🚀 ~ {messages?.map ~ msg:", msg);

              if (!msg.user) return null;
              const isSentByCurrentUser = msg.user.id === userId;
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
              handleTyping();
            }}
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

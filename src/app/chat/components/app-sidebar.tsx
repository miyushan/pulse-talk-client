"use client";

import * as React from "react";
import { ArchiveX, Command, File, Inbox, Send, Trash2 } from "lucide-react";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useQuery } from "@apollo/client";
import { GET_CHATROOMS_FOR_USER } from "@/graphql/queries/getChatroomsForUser";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { getFirstTwoChars } from "@/lib/getFirstTwoChars";

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const {
    data: chats,
    loading,
    error,
  } = useQuery(GET_CHATROOMS_FOR_USER, {
    variables: {
      userId: 21,
    },
  });
  console.log("🚀 ~ chats:", chats?.getChatRoomsForUser);

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Pulse Talk</span>
                    <span className="truncate text-xs">Chat</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent></SidebarContent>
        <SidebarFooter>
          <NavUser
            user={{
              name: "John Doe",
              email: "tH3e9@example.com",
              avatar: "",
            }}
          />
        </SidebarFooter>
      </Sidebar>

      <Sidebar collapsible="none" className="hidden bg-white flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className=" text-xl font-bold text-foreground">Pulse Talk</div>

          <SidebarInput placeholder="Search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {chats?.getChatRoomsForUser?.map((chat: any) => (
                <div
                  key={chat.id}
                  className={`p-4 border-b flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    chat.id === 1 ? "bg-blue-50 dark:bg-blue-900" : ""
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {getFirstTwoChars(chat.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="w-full ml-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{chat.name}</h3>
                      <span className="text-xs text-gray-500">2:30 PM</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      Last message preview...
                    </p>
                  </div>
                </div>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
};

"use client";

import * as React from "react";
import {
  ArchiveX,
  Check,
  ChevronsUpDown,
  CirclePlusIcon,
  File,
  Inbox,
  Send,
  Trash2,
} from "lucide-react";
import { NavUser } from "@/app/chat/components/nav-user";
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
import { useMutation, useQuery } from "@apollo/client";
import { GET_CHATROOMS_FOR_USER } from "@/graphql/queries/getChatroomsForUser";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { getFirstTwoChars } from "@/lib/getFirstTwoChars";
import { useAppStore } from "@/store/appStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { SEARCH_USERS } from "@/graphql/queries";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User } from "../chatWindow";
import { ADD_USERS_TO_CHATROOM, CREATE_CHATROOM } from "@/graphql/mutations";

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { userId, selectChatRoom, selectedChatRoomId } = useAppStore(
    (state) => state
  );

  const [search, setSearch] = useState("");
  const [newChatName, setNewChatName] = useState("");

  const {
    data: chats,
    loading,
    error,
  } = useQuery(GET_CHATROOMS_FOR_USER, {
    variables: {
      userId,
    },
  });

  const debouncedSearchTerm = useDebounce(search, 500);

  const { data: users } = useQuery(SEARCH_USERS, {
    variables: { input: { userName: debouncedSearchTerm } },
  });

  const [enterChatroom] = useMutation(ADD_USERS_TO_CHATROOM);
  const [createChatroom] = useMutation(CREATE_CHATROOM);

  const [openPopover, setOpenPopover] = useState(false);
  const [openCreateGroup, setCreateGroup] = useState(false);

  return (
    <>
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
                      <span className="truncate text-xs">Chat</span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent></SidebarContent>
          <SidebarFooter>
            <NavUser />
          </SidebarFooter>
        </Sidebar>

        <Sidebar collapsible="none" className="hidden bg-white flex-1 md:flex">
          <SidebarHeader className="gap-3.5 border-b p-4">
            <div className="flex flex-1 space-between">
              <div className="text-xl flex-1 font-bold text-foreground">
                Pulse Talk
              </div>

              <Button
                onClick={() => setCreateGroup(true)}
                size="icon"
                className="h-8 w-8"
              >
                <CirclePlusIcon className="h-5 w-5" />
              </Button>
            </div>

            <Popover open={openPopover} onOpenChange={setOpenPopover}>
              <PopoverTrigger asChild>
                <SidebarInput placeholder="Search..." />
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <SidebarInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                  />
                  <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {users?.searchUsers?.map((user: User) => (
                        <CommandItem
                          key={user.id}
                          value={`${user.id}`}
                          onSelect={async (currentValue) => {
                            setOpenPopover(false);
                            await enterChatroom({
                              variables: {
                                chatRoomId: selectedChatRoomId,
                                userIds: [user.id],
                              },
                            });
                          }}
                        >
                          <Check className="opacity-0" />
                          {user.userName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup className="px-0">
              <SidebarGroupContent>
                {chats?.getChatRoomsForUser?.length ? (
                  chats?.getChatRoomsForUser?.map((chat: any) => (
                    <div
                      key={chat.id}
                      className={`p-4 border-b flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        chat.id === 1 ? "bg-blue-50 dark:bg-blue-900" : ""
                      }`}
                      onClick={() => selectChatRoom(+chat.id, chat.name)}
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
                  ))
                ) : (
                  <div className="flex flex-col gap-2 mt-2">
                    <Skeleton className="h-[40px] rounded-xl mx-4" />
                    <Skeleton className="h-[40px] rounded-xl mx-4" />
                  </div>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </Sidebar>

      <AlertDialog open={openCreateGroup} onOpenChange={() => setCreateGroup}>
        <AlertDialogContent className="gap-8">
          <AlertDialogHeader>
            <AlertDialogTitle>Chat Group Name</AlertDialogTitle>
            <AlertDialogDescription className="">
              <SidebarInput
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                placeholder="Search..."
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await createChatroom({
                  variables: {
                    name: newChatName,
                  },
                });
                setCreateGroup(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

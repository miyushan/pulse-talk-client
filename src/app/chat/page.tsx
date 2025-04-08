import { AppSidebar } from "@/app/chat/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { query } from "@/config/ApolloClient";
import { ACCESS_TOKEN, BASE_ROUTES } from "@/constants";
import { gql } from "@apollo/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ChatWindow } from "./chatWindow";

export default async function ChatPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

  if (!accessToken) {
    return redirect(`${BASE_ROUTES.SIGN_IN}`);
  }

  const userQuery = gql`
    query SearchUsers($userName: String!) {
      searchUsers(input: { userName: $userName }) {
        createdAt
        email
        firstName
        id
        lastName
        updatedAt
        userName
      }
    }
  `;

  const { data } = await query({
    query: userQuery,
    variables: { userName: "" },
    context: {
      headers: {
        cookie: cookieStore,
      },
    },
  });

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <ChatWindow />
      </SidebarInset>
    </SidebarProvider>
  );
}

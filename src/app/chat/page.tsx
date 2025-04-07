import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { query } from "@/config/ApolloClient";
import { ACCESS_TOKEN, BASE_ROUTES } from "@/constants";
import { gql } from "@apollo/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Inbox</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col"></div>
      </SidebarInset>
    </SidebarProvider>
  );
}

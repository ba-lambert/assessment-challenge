import { Home, TypeOutline, Banknote, Monitor, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { accountService } from "@/lib/appwrite"
import { Link, useLocation } from "react-router-dom"
import { useUser } from "@/contexts/UserContext"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Accounts",
    url: "accounts",
    icon: Banknote,
  },
  {
    title: "Transactions",
    url: "transactions",
    icon: Monitor,
  },
  {
    title: "Categories",
    url: "categories",
    icon: TypeOutline,
  },
]

export function AppSidebar() {
  const location = useLocation();
  const { user } = useUser();

  return (
    <Sidebar className="h-full bg-gray-800 text-white">
      <SidebarContent className="flex flex-col h-full">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-semibold px-4 py-6">
            Expenses Tracker
          </SidebarGroupLabel>
          
          <div className="px-4 py-2 mb-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/50">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-gray-400">{user?.email}</span>
              </div>
            </div>
          </div>

          <Separator className="mb-4 bg-gray-700" />

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url || 
                               (item.url === "/" && location.pathname === "/");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.url}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                          ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-700/50'}`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <div className="mt-auto p-4">
          <Button 
            variant="destructive" 
            className="w-full flex items-center gap-2" 
            onClick={async () => await accountService.signOut()}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}

import { AppSidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"
import { Menu } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";

export default function AppLayout() {
  const [open, setOpen] = useState(true);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <div className="flex flex-col w-full h-screen">
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
          <div className="flex h-16 items-center px-4">
            <Button 
              onClick={() => setOpen(!open)} 
              variant="ghost" 
              size="icon"
              className="mr-4"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1" />
            <UserMenu />
          </div>
        </nav>
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
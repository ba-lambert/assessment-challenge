import { AppSidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"

export default function AppLayout() {
  const [open, setOpen] = useState(true);
  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <div className="flex flex-col w-full h-screen">
        <nav className="bg-blue-700 w-full h-16 mb-4 flex items-center justify-between px-4">
          <Button onClick={()=>setOpen(!open)}>Sidebar</Button>
        </nav>
        <main className="">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
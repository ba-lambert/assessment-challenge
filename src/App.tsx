import { Routes } from "./Routes";
import { UserProvider } from "@/contexts/UserContext";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  return (
    <UserProvider>
      <Routes />
      <Toaster />
    </UserProvider>
  );
}

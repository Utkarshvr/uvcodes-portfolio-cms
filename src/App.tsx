import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Outlet, useNavigate } from "react-router";
import Header from "./components/Header";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { ModeToggle } from "./components/mode-toggle";
import "@/lib/firebase/setup";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/setup";
import { onAuthStateChanged } from "firebase/auth";
import FetchTools from "./components/FetchTools";
import LoadingBackdrop from "./components/LoadingBackdrop";

function App() {
  const defaultOpen = localStorage.getItem("sidebar_state") === "true";

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  // Handle user state changes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onAuthChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, onAuthChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (initializing) return;

    const isOnSignInPage = location.pathname === "/sign-in";

    if (!user) navigate("/sign-in");
    if (user && isOnSignInPage) navigate("/");
  }, [user, initializing, navigate]);

  // console.log({ initializing, user });

  if (initializing) return <LoadingBackdrop />;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main className="p-2 w-full min-h-svh">
          <Header />
          <Outlet />
          <Toaster />
          <div className="bottom-4 fixed right-4">
            <ModeToggle />
          </div>
        </main>
        <FetchTools />
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;

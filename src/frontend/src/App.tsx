import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AppShell from "./components/AppShell";
import { AppProvider, useApp } from "./contexts/AppContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import LandingPage from "./pages/LandingPage";

function AppContent() {
  const { isLoggedIn } = useApp();
  const [page, setPage] = useState("home");

  if (!isLoggedIn) {
    return <LandingPage />;
  }

  return <AppShell currentPage={page} setPage={setPage} />;
}

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <AppContent />
        <Toaster richColors position="top-right" />
      </AppProvider>
    </LanguageProvider>
  );
}

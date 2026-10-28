import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const linkedin = document.querySelector<HTMLAnchorElement>('.contact-details a[href*="YOUR-LINKEDIN-URL"]');
    if (!linkedin) return;

    linkedin.href = "https://www.linkedin.com/in/naman-garg-18440234a/";
    const label = Array.from(linkedin.childNodes).find(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.includes("LinkedIn profile"),
    );
    if (label) label.textContent = " LinkedIn · naman-garg-18440234a ";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChatPage } from "@/pages/ChatPage";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/chat/:tenantName" element={<ChatPage />} />
          <Route path="*" element={<Navigate to="/chat/app_solar" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;

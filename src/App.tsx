import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChatPage } from "@/pages/ChatPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chat/:tenantName" element={<ChatPage />} />
        <Route path="*" element={<Navigate to="/chat/app_solar" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

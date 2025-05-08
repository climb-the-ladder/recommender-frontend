"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ChatbotDialog } from "@/components/chatbot-dialog";
import { FloatingButton } from "@/components/ui/floating-button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {children}
        <FloatingButton onClick={() => setIsChatbotOpen(true)} />
        <ChatbotDialog open={isChatbotOpen} onOpenChange={setIsChatbotOpen} />
      </div>
    </ProtectedRoute>
  );
} 
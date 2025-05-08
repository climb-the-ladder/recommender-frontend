"use client";

import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/hooks/useAuth";
import { supabase } from "@/lib/supabase";

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatbotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatbotDialog({ open, onOpenChange }: ChatbotDialogProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate a unique session ID when component mounts
  useEffect(() => {
    if (open && user) {
      setSessionId(`session_${user.id}_${Date.now()}`);
      loadUserProfile();
    }
  }, [open, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load user profile data for chat context
  const loadUserProfile = async () => {
    if (!user) return;

    try {
      // Load academic scores
      const { data: academicData } = await supabase
        .from("academic_scores")
        .select("*")
        .eq("user_id", user.id)
        .order("recorded_at", { ascending: false })
        .limit(1)
        .single();

      // Load career recommendations
      const { data: careerData } = await supabase
        .from("career_recommendations")
        .select("*")
        .eq("user_id", user.id)
        .order("recommended_at", { ascending: false })
        .limit(1)
        .single();

      setUserProfile({
        academicData,
        careerData
      });

      // Add welcome message
      const welcomeMessage = getWelcomeMessage(academicData, careerData);
      setMessages([
        {
          id: "welcome",
          content: welcomeMessage,
          role: "assistant",
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error("Error loading user profile:", error);
      // Add a generic welcome message if profile loading fails
      setMessages([
        {
          id: "welcome",
          content: "Hi there! I'm your career assistant. How can I help you today?",
          role: "assistant",
          timestamp: new Date()
        }
      ]);
    }
  };

  const getWelcomeMessage = (academicData: any, careerData: any) => {
    if (careerData && academicData) {
      return `Hello! I see you're interested in a career as a ${careerData.career_field} with a GPA of ${academicData.overall_gpa}/100. How can I help you with university selections or career advice today?`;
    } else if (academicData) {
      return `Hello! I see you have a GPA of ${academicData.overall_gpa}/100. How can I help you explore career and university options?`;
    } else {
      return "Hi there! I'm your career assistant. How can I help you today?";
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      content: message,
      role: "user",
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      // Prepare data for API
      const payload: any = {
        message: userMessage.content,
        session_id: sessionId
      };

      // Add profile data if available
      if (userProfile?.careerData) {
        payload.career = userProfile.careerData.career_field;
      }

      if (userProfile?.academicData) {
        payload.gpa = userProfile.academicData.overall_gpa;
        payload.subject_grades = userProfile.academicData.subject_grades || {};
      }

      console.log("Sending payload to chatbot API:", JSON.stringify(payload));

      // Call the API
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      let responseText = "";
      
      if (response.ok) {
        const data = await response.json();
        responseText = data.response;
        // Check if the response is from the mock API
        setUsingMockData(data.isMock === true);
      } else {
        console.error("API response error:", response.status);
        responseText = getFallbackResponse(userMessage.content, payload.career, payload.gpa);
        setUsingMockData(true);
      }

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        content: responseText,
        role: "assistant",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Generate a contextual fallback response based on user query
      const fallbackResponse = getFallbackResponse(userMessage.content, 
        userProfile?.careerData?.career_field, 
        userProfile?.academicData?.overall_gpa);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        content: fallbackResponse,
        role: "assistant",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackResponse = (query: string, career?: string, gpa?: number): string => {
    // Convert query to lowercase for easier matching
    const lowercaseQuery = query.toLowerCase();
    
    // Check if query is about universities
    if (lowercaseQuery.includes("university") || 
        lowercaseQuery.includes("college") || 
        lowercaseQuery.includes("school")) {
      if (career && gpa) {
        return `Based on your interest in ${career} and your GPA of ${gpa}/100, I'd recommend looking into universities that specialize in programs related to ${career} and match your academic profile. Would you like more specific information about any particular university?`;
      } else if (gpa) {
        return `With your GPA of ${gpa}/100, you have options at various universities. What fields or careers are you interested in exploring?`;
      } else {
        return "I'd be happy to discuss university options. Could you tell me your GPA and what career field you're interested in?";
      }
    }
    
    // Check if query is about careers
    else if (lowercaseQuery.includes("career") || 
             lowercaseQuery.includes("job") || 
             lowercaseQuery.includes("profession")) {
      if (career) {
        return `A career in ${career} offers many opportunities. Would you like to know more about the educational requirements, typical career paths, or alternative careers related to ${career}?`;
      } else {
        return "I can help you explore various career paths based on your interests and academic strengths. What subjects do you enjoy or excel in?";
      }
    }
    
    // Generic fallback for when we can't categorize the query
    else {
      return "I'm having trouble connecting to my knowledge base at the moment. I can help with questions about career paths, university recommendations, and educational planning. What specific information are you looking for?";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-xl lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Career Assistant
            {usingMockData && (
              <span className="ml-2 text-xs py-0.5 px-2 bg-yellow-200 text-yellow-800 rounded-full">
                Offline Mode
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <ScrollArea className="h-[50vh] p-4 rounded-md border">
            <div className="flex flex-col gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-lg bg-muted flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about universities, careers, or your profile..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
// pages/predict.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Target, GraduationCap, MessageSquare, ChevronLeft, X } from "lucide-react";

type Message = {
  text: string;
  isUser: boolean;
};

type PredictionResult = {
  career: string;
};

type FormData = {
  math_score: string;
  history_score: string;
  physics_score: string;
  chemistry_score: string;
  biology_score: string;
  english_score: string;
  geography_score: string;
};

type UniversityRecommendation = {
  University_Name: string;
  Rank_Tier: string;
};

type UniversityResponse = {
  recommended_universities: UniversityRecommendation[];
  similar_careers: string[];
};

export default function PredictForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    math_score: "",
    history_score: "",
    physics_score: "",
    chemistry_score: "",
    biology_score: "",
    english_score: "",
    geography_score: ""
  });
  
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const [detailedMode, setDetailedMode] = useState(false);
  const [universityResponse, setUniversityResponse] = useState<UniversityResponse | null>(null);
  const [gpa, setGpa] = useState('');

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 15));

  const steps = [
    { id: 1, title: "Academic Scores", icon: GraduationCap },
    { id: 2, title: "Career Prediction", icon: Target },
    { id: 3, title: "University Recommendations", icon: Compass },
    { id: 4, title: "Alternative Careers", icon: Target },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (name: keyof FormData, value: number[]) => {
    setFormData({ ...formData, [name]: value[0].toString() });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:5000/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });    
    const result = await response.json();
    setPredictions(result);
    
    // Initialize chat with welcome message
    setMessages([
      {
        text: `Welcome! I can help you learn more about a career as a ${result.career}. What would you like to know?`,
        isUser: false
      }
    ]);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId === 1) {
      setCurrentStep(1);
    } else if (predictions && stepId === 2) {
      setCurrentStep(2);
    } else if (predictions && stepId === 3) {
      setCurrentStep(3);
    } else if (universityResponse && stepId === 4) {
      setCurrentStep(4);
    }
  };

  const handleGetRecommendations = async () => {
    if (!predictions || !gpa) return;
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/chatbot-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          gpa: parseFloat(gpa),
          career: predictions.career
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }
      
      const result = await response.json();
      console.log('Recommendations received:', result); // Debug log
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setUniversityResponse(result);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      // You might want to show an error message to the user here
    }
  };

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !predictions) return;
    
    // Add user message to chat
    const userMessage = { text: currentMessage, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    
    try {
      // Send message with career and subject scores
      const res = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentMessage,
          career: predictions.career,
          subject_grades: formData,
          session_id: sessionId
        }),
      });
      
      const result = await res.json();
      
      // Add bot response to chat
      if (result.response) {
        setMessages(prev => [...prev, { text: result.response, isUser: false }]);
      } else {
        setMessages(prev => [...prev, { 
          text: "Sorry, I couldn't process your request at this time.", 
          isUser: false 
        }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { 
        text: "Sorry, there was an error communicating with the server.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute top-10 left-10">
        <Link href="/">
          <Button variant="outline" className="text-white border-gray-800 hover:bg-gray-800">
            Return to Homepage
          </Button>
        </Link>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Compass className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Discover Your Career Path
            </h1>
            <p className="text-gray-400">Follow the steps to find your perfect career match</p>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800 -z-10" />
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleStepClick(step.id)}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    currentStep >= step.id
                      ? "bg-white text-black"
                      : "bg-gray-800 text-gray-400",
                    step.id === 1 || (step.id === 2 && predictions) || 
                    (step.id === 3 && predictions) || (step.id === 4 && universityResponse)
                      ? "hover:bg-gray-700"
                      : "cursor-not-allowed opacity-50"
                  )}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="text-sm mt-2 text-gray-400">{step.title}</span>
              </div>
            ))}
          </div>

          {/* Back Button */}
          {currentStep > 1 && (
            <Button
              onClick={handleBack}
              variant="ghost"
              className="absolute left-4 top-4 text-gray-400 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Academic Scores */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-black border-gray-800 p-6">
                  <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); handleSubmit(e); }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { label: "Math Score", name: "math_score" as keyof FormData, icon: "📐" },
                        { label: "History Score", name: "history_score" as keyof FormData, icon: "📜" },
                        { label: "Physics Score", name: "physics_score" as keyof FormData, icon: "⚛️" },
                        { label: "Chemistry Score", name: "chemistry_score" as keyof FormData, icon: "🧪" },
                        { label: "Biology Score", name: "biology_score" as keyof FormData, icon: "🧬" },
                        { label: "English Score", name: "english_score" as keyof FormData, icon: "📚" },
                        { label: "Geography Score", name: "geography_score" as keyof FormData, icon: "🌍" },
                      ].map((field) => (
                        <motion.div
                          key={field.name}
                          className="space-y-3"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-400 flex items-center gap-2">
                              <span>{field.icon}</span>
                              {field.label}
                            </label>
                            <span className="text-white font-medium">{formData[field.name] || 0}%</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Slider
                              min={0}
                              max={100}
                              step={1}
                              value={[parseInt(formData[field.name]) || 0]}
                              onValueChange={(value) => handleSliderChange(field.name, value)}
                              className="flex-1"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex justify-center pt-6">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-200 hover:to-white px-8 py-6 text-lg transition-all duration-300"
                      >
                        Predict My Career
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Career Prediction */}
            {currentStep === 2 && predictions && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-black border-gray-800 p-6">
                  <h2 className="text-2xl font-semibold text-center mb-6 text-white">
                    Your Career Path
                  </h2>
                  <p className="text-3xl font-bold text-center text-white mb-8">
                    {predictions.career}
                  </p>

                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="border-gray-800 text-white hover:bg-gray-800"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      className="bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-200 hover:to-white"
                    >
                      Continue to Recommendations
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 3: University Recommendations */}
            {currentStep === 3 && predictions && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-black border-gray-800 p-6">
                  <div className="space-y-6">
                    {!universityResponse ? (
                      <div className="flex flex-col gap-4">
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-semibold text-white mb-2">
                            Enter Your GPA to Get University Recommendations
                          </h3>
                          <p className="text-gray-400">
                            Based on your predicted career: {predictions.career}
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-400">Your GPA (0-100)</label>
                            <span className="text-white font-medium">{gpa || 0}%</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Slider
                              min={0}
                              max={100}
                              step={1}
                              value={[parseInt(gpa) || 0]}
                              onValueChange={(value) => setGpa(value[0].toString())}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div className="flex justify-center gap-4">
                          <Button
                            onClick={handleBack}
                            variant="outline"
                            className="border-gray-800 text-white hover:bg-gray-800"
                          >
                            Back
                          </Button>
                          <Button
                            onClick={handleGetRecommendations}
                            className="bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-200 hover:to-white"
                          >
                            Generate University Recommendations
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">Recommended Universities</h3>
                          <div className="space-y-2">
                            {universityResponse.recommended_universities.map((uni, idx) => (
                              <Card key={idx} className="bg-black border-gray-800 p-3">
                                {uni.University_Name} <span className="text-gray-400">({uni.Rank_Tier})</span>
                              </Card>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-center gap-4">
                          <Button
                            onClick={handleBack}
                            variant="outline"
                            className="border-gray-800 text-white hover:bg-gray-800"
                          >
                            Back
                          </Button>
                          <Button
                            onClick={() => setCurrentStep(4)}
                            className="bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-200 hover:to-white"
                          >
                            View Alternative Careers
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Alternative Careers */}
            {currentStep === 4 && universityResponse && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-black border-gray-800 p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Similar Careers</h3>
                      <div className="space-y-2">
                        {universityResponse.similar_careers.map((career, idx) => (
                          <Card key={idx} className="bg-black border-gray-800 p-3">
                            {career}
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={handleBack}
                        variant="outline"
                        className="border-gray-800 text-white hover:bg-gray-800"
                      >
                        Back to Universities
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Chat Button */}
      {predictions && !isChatOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-8 right-8"
        >
          <Button
            onClick={() => setIsChatOpen(true)}
            className="w-16 h-16 rounded-full bg-white text-black hover:bg-gray-200"
          >
            <MessageSquare className="w-6 h-6" />
          </Button>
        </motion.div>
      )}

      {/* Chat Modal */}
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-8 right-8 w-96"
        >
          <Card className="bg-black border-gray-800">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold">Career Assistant</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="bg-black border border-gray-800 rounded-lg p-4 h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center mt-32">
                  Ask me anything about your career path!
                </p>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-3/4 p-3 rounded-lg ${
                          msg.isUser 
                            ? 'bg-white text-black rounded-br-none' 
                            : 'bg-gray-900 text-white rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-900 text-white p-3 rounded-lg rounded-bl-none">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-800">
              <div className="flex gap-2">
                <Textarea
                  value={currentMessage}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="flex-grow bg-black border-gray-800 text-white"
                  rows={2}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !currentMessage.trim()}
                  className="bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-200 hover:to-white"
                >
                  Send
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

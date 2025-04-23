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
import { Compass, Target, GraduationCap, MessageSquare, ChevronLeft, X, Loader2, Map } from "lucide-react";

type Message = {
  text: string;
  isUser: boolean;
};

type PredictionResult = {
  career: string;
};

type CareerDetail = {
  description: string;
  salary_range: string;
  difficulty: string | number;
  education: string;
  skills: string[];
  job_outlook: string;
  day_to_day: string;
  advancement: string;
  work_life_balance: {
    rating: number;
    explanation: string;
  } | string | number;
  pros: string[];
  cons: string[];
};

type CareerDetailsResponse = {
  success: boolean;
  data: string; // JSON string
  error?: string;
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

type RoadmapSection = {
  title: string;
  items: string[];
};

type RoadmapData = {
  "short-term goals": string[];
  "mid-term goals": string[];
  "long-term goals": string[];
  "education requirements": string[];
  "skills to develop": string[];
  "experience needed": string[];
  "industry certifications": string[];
  "personal development recommendations": string[];
  "networking suggestions": string[];
  "milestones and checkpoints": string[];
  [key: string]: string[];
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
  const [careerDetails, setCareerDetails] = useState<CareerDetail | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailedMode, setDetailedMode] = useState(false);
  const [universityResponse, setUniversityResponse] = useState<UniversityResponse | null>(null);
  const [gpa, setGpa] = useState('');
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);

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
    { id: 5, title: "Career Roadmap", icon: Map },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (name: keyof FormData, value: number[]) => {
    setFormData({ ...formData, [name]: value[0].toString() });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    try {
      console.log('Making fetch request to:', "http://127.0.0.1:5000/api/predict");
      const response = await fetch("http://127.0.0.1:5000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Success! Response data:', result);
      
      setPredictions(result);
      
      // Initialize chat with welcome message
      setMessages([
        {
          text: `Welcome! I can help you learn more about a career as a ${result.career}. What would you like to know?`,
          isUser: false
        }
      ]);
      
      // Fetch career details
      fetchCareerDetails(result.career);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      // You might want to set some error state here to show to the user
    }
  };

  const fetchCareerDetails = async (career: string) => {
    setIsLoadingDetails(true);
    setCareerDetails(null); // Clear previous details
    
    console.log("Fetching career details for:", career);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/career-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ career }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get career details');
      }
      
      const result: CareerDetailsResponse = await response.json();
      console.log("Career details response:", result);
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error');
      }
      
      // Parse the JSON string into an object
      try {
        const detailsData: CareerDetail = typeof result.data === 'string' 
          ? JSON.parse(result.data) 
          : result.data;
        setCareerDetails(detailsData);
      } catch (parseError) {
        console.error("Error parsing career details:", parseError);
        throw new Error('Error parsing career details');
      }
    } catch (error) {
      console.error("Error getting career details:", error);
      // Leave careerDetails as null to show the error state
    } finally {
      // Slight delay to prevent flickering
      setTimeout(() => {
        setIsLoadingDetails(false);
      }, 500);
    }
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
    } else if (predictions && stepId === 5) {
      if (!roadmapData) {
        fetchRoadmap();
      }
      setCurrentStep(5);
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

  const fetchRoadmap = async () => {
    if (!predictions) return;
    
    setIsLoadingRoadmap(true);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/career-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          career: predictions.career,
          subject_grades: formData,
          gpa: gpa ? parseFloat(gpa) : undefined
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get career roadmap');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error');
      }
      
      // Parse the JSON string into an object
      try {
        const roadmapJson = typeof result.data === 'string' 
          ? JSON.parse(result.data) 
          : result.data;
        
        // Check if required keys exist
        const requiredKeys = [
          "short-term goals", "mid-term goals", "long-term goals", 
          "education requirements", "skills to develop", "experience needed", 
          "industry certifications", "personal development recommendations", 
          "networking suggestions", "milestones and checkpoints"
        ];
        
        // We don't need to check for missing keys since we have fallbacks in the UI
        
        setRoadmapData(roadmapJson);
      } catch (parseError) {
        throw new Error('Error parsing roadmap data');
      }
    } catch (error) {
      // You might want to show an error message to the user here
    } finally {
      setIsLoadingRoadmap(false);
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
      <style jsx global>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 2.5s linear infinite;
        }
        .styled-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .styled-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        .styled-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .styled-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>

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
                    (step.id === 3 && predictions) || (step.id === 4 && universityResponse) ||
                    (step.id === 5 && predictions)
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

          {/* Back Button
          {currentStep > 1 && (
            <Button
              onClick={handleBack}
              variant="ghost"
              className="absolute left-4 top-4 text-gray-400 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          )} */}

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

                  {isLoadingDetails ? (
                    <div className="flex justify-center py-8 min-h-[200px] items-center">
                      <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
                        <p className="text-gray-400">Gathering detailed information about this career...</p>
                      </div>
                    </div>
                  ) : careerDetails ? (
                    <div className="space-y-6 max-h-96 overflow-y-auto mb-6 pr-2">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Overview</h3>
                        <p className="text-gray-300">{careerDetails.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Compensation</h3>
                          <p className="text-gray-300">{careerDetails.salary_range}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Difficulty Level</h3>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-800 rounded-full h-2.5">
                              <div 
                                className="bg-white h-2.5 rounded-full" 
                                style={{ width: `${(Number(careerDetails.difficulty) / 10) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-white">{careerDetails.difficulty}/10</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Required Education</h3>
                        <p className="text-gray-300">{careerDetails.education}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Key Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {careerDetails.skills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Job Outlook</h3>
                        <p className="text-gray-300">{careerDetails.job_outlook}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Day-to-Day Activities</h3>
                        <p className="text-gray-300">{careerDetails.day_to_day}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Career Advancement</h3>
                        <p className="text-gray-300">{careerDetails.advancement}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Work-Life Balance</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-full bg-gray-800 rounded-full h-2.5">
                            <div 
                              className="bg-white h-2.5 rounded-full" 
                              style={{ 
                                width: `${(typeof careerDetails.work_life_balance === 'object' 
                                  ? Number(careerDetails.work_life_balance.rating) 
                                  : Number(careerDetails.work_life_balance)) / 10 * 100}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-white">
                            {typeof careerDetails.work_life_balance === 'object' 
                              ? `${careerDetails.work_life_balance.rating}/10` 
                              : `${careerDetails.work_life_balance}/10`}
                          </span>
                        </div>
                        {typeof careerDetails.work_life_balance === 'object' && 
                          <p className="text-gray-300">{careerDetails.work_life_balance.explanation}</p>
                        }
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2 text-green-400">Pros</h3>
                          <ul className="list-disc list-inside text-gray-300 space-y-1">
                            {careerDetails.pros.map((pro, idx) => (
                              <li key={idx}>{pro}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-2 text-red-400">Cons</h3>
                          <ul className="list-disc list-inside text-gray-300 space-y-1">
                            {careerDetails.cons.map((con, idx) => (
                              <li key={idx}>{con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 min-h-[200px] flex items-center justify-center">
                      <div>
                        <p className="text-red-400 mb-2">Unable to load career details</p>
                        <Button 
                          onClick={() => fetchCareerDetails(predictions.career)} 
                          variant="outline" 
                          className="border-gray-800 text-white hover:bg-gray-800"
                        >
                          Try Again
                        </Button>
                      </div>
                    </div>
                  )}

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
                        onClick={() => setCurrentStep(3)}
                        variant="outline"
                        className="border-gray-800 text-white hover:bg-gray-800"
                      >
                        Back to Universities
                      </Button>
                      <Button
                        onClick={() => {
                          if (!roadmapData) {
                            fetchRoadmap();
                          }
                          setCurrentStep(5);
                        }}
                        className="bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-200 hover:to-white"
                      >
                        View Career Roadmap
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 5: Career Roadmap */}
            {currentStep === 5 && predictions && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-black border-gray-800 p-6">
                  <div className="space-y-10">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Your Path to Becoming a {predictions.career}
                      </h3>
                      <p className="text-gray-400 max-w-xl mx-auto">
                        Follow this personalized roadmap designed to help you achieve your career aspirations based on your unique strengths and academic profile
                      </p>
                    </div>

                    {isLoadingRoadmap ? (
                      <div className="flex justify-center py-16 min-h-[400px] items-center">
                        <div className="text-center">
                          <div className="w-12 h-12 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-gray-400">Creating your personalized career roadmap...</p>
                        </div>
                      </div>
                    ) : roadmapData ? (
                      <div className="max-w-4xl mx-auto space-y-16 max-h-[600px] overflow-y-auto pr-3 styled-scrollbar">
                        {/* Timeline */}
                        <div className="relative">
                          <div className="absolute left-[15px] top-0 bottom-0 w-[1px] bg-gray-800"></div>

                          {/* Short-term goals */}
                          <div className="mb-14">
                            <div className="flex items-start">
                              <div className="relative mr-6">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black border border-gray-700 z-10">
                                  <span className="text-sm text-gray-400">1</span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                  Short-term Goals <span className="text-sm text-gray-500 ml-2">(0-2 years)</span>
                                </h3>
                                <ul className="space-y-3">
                                  {(roadmapData["short-term goals"] || ["Focus on completing relevant coursework", "Pursue internship opportunities", "Build a foundation of knowledge in your field"]).map((goal, idx) => (
                                    <li key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                                      {goal}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Mid-term goals */}
                          <div className="mb-14">
                            <div className="flex items-start">
                              <div className="relative mr-6">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black border border-gray-700 z-10">
                                  <span className="text-sm text-gray-400">2</span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                  Mid-term Goals <span className="text-sm text-gray-500 ml-2">(2-5 years)</span>
                                </h3>
                                <ul className="space-y-3">
                                  {(roadmapData["mid-term goals"] || ["Advance your education with specialized degrees", "Gain professional experience", "Build your professional network"]).map((goal, idx) => (
                                    <li key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                                      {goal}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Long-term goals */}
                          <div className="mb-14">
                            <div className="flex items-start">
                              <div className="relative mr-6">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black border border-gray-700 z-10">
                                  <span className="text-sm text-gray-400">3</span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                  Long-term Goals <span className="text-sm text-gray-500 ml-2">(5+ years)</span>
                                </h3>
                                <ul className="space-y-3">
                                  {(roadmapData["long-term goals"] || ["Achieve mastery in your specialized field", "Consider leadership and management positions", "Work on groundbreaking projects or research"]).map((goal, idx) => (
                                    <li key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                                      {goal}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Development Areas */}
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-gray-800">
                            Key Development Areas
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <h4 className="text-lg font-medium text-white">Education Requirements</h4>
                              <ul className="space-y-2">
                                {(roadmapData["education requirements"] || ["Bachelor's degree in relevant field", "Consider graduate studies for specialization", "Continuous learning and professional development"]).map((item, idx) => (
                                  <li key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-lg font-medium text-white">Skills to Develop</h4>
                              <ul className="space-y-2">
                                {(roadmapData["skills to develop"] || ["Critical thinking and problem-solving", "Technical skills relevant to your field", "Communication and presentation", "Research methodology", "Data analysis"]).map((item, idx) => (
                                  <li key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-lg font-medium text-white">Experience Needed</h4>
                              <ul className="space-y-2">
                                {(roadmapData["experience needed"] || ["Research assistant positions", "Internships in related fields", "Laboratory or fieldwork experience", "Project-based experience"]).map((item, idx) => (
                                  <li key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-lg font-medium text-white">Industry Certifications</h4>
                              <ul className="space-y-2">
                                {(roadmapData["industry certifications"] || ["Specialized certifications in your field", "Software and tools proficiency certificates", "Professional association memberships"]).map((item, idx) => (
                                  <li key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-lg font-medium text-white">Personal Development</h4>
                              <ul className="space-y-2">
                                {(roadmapData["personal development recommendations"] || ["Time management and organization skills", "Resilience and adaptability", "Ethical judgment", "Curiosity and continuous learning"]).map((item, idx) => (
                                  <li key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-lg font-medium text-white">Networking Suggestions</h4>
                              <ul className="space-y-2">
                                {(roadmapData["networking suggestions"] || ["Join professional associations in your field", "Attend conferences and seminars", "Connect with professors and mentors", "Participate in online communities and forums"]).map((item, idx) => (
                                  <li key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="mt-8 pt-6 border-t border-gray-800">
                            <h4 className="text-lg font-medium text-white mb-4">Key Milestones</h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {(roadmapData["milestones and checkpoints"] || ["Complete undergraduate degree", "Secure first professional position", "Publish research or contribute to projects", "Achieve professional recognition", "Mentor others in your field"]).map((item, idx) => (
                                <li key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 min-h-[200px] flex items-center justify-center">
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-700 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          <p className="text-red-400 mb-4">Unable to load career roadmap</p>
                          <Button 
                            onClick={fetchRoadmap} 
                            variant="outline" 
                            className="border-gray-800 text-white hover:bg-gray-800 hover:border-gray-700 transition-all duration-300"
                          >
                            Try Again
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-center gap-4 pt-4 border-t border-gray-800">
                      <Button
                        onClick={() => setCurrentStep(4)}
                        variant="outline"
                        className="border-gray-800 text-white hover:bg-gray-800 hover:border-gray-700 transition-all duration-300"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back to Alternative Careers
                      </Button>
                      <Button
                        onClick={() => window.print()}
                        className="bg-white text-black hover:bg-gray-200 transition-all duration-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                        Save Roadmap
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
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
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

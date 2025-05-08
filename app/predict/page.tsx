"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Slider } from "@/components/ui/slider";
import { Loader2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import ProtectedRoute from "@/components/ProtectedRoute";
import API_CONFIG from '@/lib/api-config';

import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Target, GraduationCap, MessageSquare, ChevronLeft, X, Loader2, Map } from "lucide-react";

// Get API URL from environment variables with fallback for local development
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

type PredictionResult = {
  career: string;
  confidence_score?: number;
  details?: {
    description: string;
    salary_range: string;
    difficulty: number;
    education: string;
    skills: string[];
    job_outlook: string;
    day_to_day: string;
    advancement: string;
    work_life_balance: {
      rating: number;
      explanation: string;
    };
    pros: string[];
    cons: string[];
  };
};

export default function PredictForm() {
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
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingScores, setIsLoadingScores] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSavedPrediction, setHasSavedPrediction] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsInitialLoading(true);
        await Promise.all([
          loadAcademicScores(),
          loadSavedPrediction()
        ]);
      } catch (error) {
        console.error('Error initializing data:', error);
        toast.error('Failed to initialize data');
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    initializeData();
  }, []);

  const loadAcademicScores = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      console.log('Making fetch request to:', `${API_URL}/api/predict`);
      const response = await fetch(`${API_URL}/api/predict`, {
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

      const { data, error } = await supabase
        .from('academic_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No scores found, set default values
          setFormData({
            math_score: "0",
            history_score: "0",
            physics_score: "0",
            chemistry_score: "0",
            biology_score: "0",
            english_score: "0",
            geography_score: "0"
          });
          toast.info('No academic scores found. Please enter your scores.');
          return;
        }
        throw error;
      }

      if (data) {
        // Convert INTEGER values to strings, handling null values
        setFormData({
          math_score: data.math_score?.toString() || "0",
          history_score: data.history_score?.toString() || "0",
          physics_score: data.physics_score?.toString() || "0",
          chemistry_score: data.chemistry_score?.toString() || "0",
          biology_score: data.biology_score?.toString() || "0",
          english_score: data.english_score?.toString() || "0",
          geography_score: data.geography_score?.toString() || "0"
        });
      }
    } catch (error) {
      console.error('Error loading academic scores:', error);
      toast.error('Failed to load academic scores');
      // Set default values on error
      setFormData({
        math_score: "0",
        history_score: "0",
        physics_score: "0",
        chemistry_score: "0",
        biology_score: "0",
        english_score: "0",
        geography_score: "0"
      });
    } finally {
      setIsLoadingScores(false);
    }
  };

  const loadSavedPrediction = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        router.push('/');
        return;

      const response = await fetch(`${API_URL}/api/career-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ career }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get career details');
      }

      console.log('Fetching career recommendation for user:', user.id);
      
      // Get the most recent career recommendation
      const { data: recommendationData, error: recommendationError } = await supabase
        .from('career_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('recommended_at', { ascending: false })
        .limit(1)
        .single();

      if (recommendationError) {
        if (recommendationError.code === 'PGRST116') {
          console.log('No saved prediction found');
          setHasSavedPrediction(false);
          return;
        }
        throw recommendationError;
      }

      console.log('Found recommendation:', recommendationData);

      if (recommendationData) {
        setHasSavedPrediction(true);
        setIsLoadingDetails(true);

        try {
          // Get the career roadmap
          const { data: roadmapData, error: roadmapError } = await supabase
            .from('career_roadmaps')
            .select('*')
            .eq('user_id', user.id)
            .eq('career', recommendationData.recommended_career)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (roadmapError && roadmapError.code !== 'PGRST116') {
            console.error('Error fetching roadmap:', roadmapError);
          }

          // Get user preferences
          const { data: preferencesData, error: preferencesError } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (preferencesError && preferencesError.code !== 'PGRST116') {
            console.error('Error fetching preferences:', preferencesError);
          }

          // Check if we have career_details
          if (!recommendationData.career_details) {
            console.error('No career details found in recommendation data');
            throw new Error('Career details not found in saved data');
          }

          // Use the saved career details
          setPredictions({
            career: recommendationData.recommended_career,
            confidence_score: recommendationData.confidence_score,
            details: {
              ...recommendationData.career_details,
              ...(roadmapData?.roadmap_steps || {}),
              work_life_balance: {
                rating: parseInt(
                  preferencesData?.work_life_balance_preference || 
                  recommendationData.career_details.work_life_balance.rating
                ),
                explanation: recommendationData.career_details.work_life_balance.explanation
              }
            }
          });

          console.log('Successfully set predictions with saved data');
        } catch (innerError) {
          console.error('Error processing saved data:', innerError);
          setHasSavedPrediction(false);
          throw innerError;
        }
      }

      // Get the result directly - our API returns the career details object directly
      const detailsData = await response.json();
      console.log("Career details response:", detailsData);
      
      // Set the career details directly
      setCareerDetails(detailsData);
    } catch (error) {
      console.error('Error in loadSavedPrediction:', error);
      toast.error('Failed to load saved prediction');
      setHasSavedPrediction(false);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const saveCareerPrediction = async (career: string, details: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user found');
      }

      setIsSaving(true);

      // Save to career_recommendations with full details
      const { error: recommendationError } = await supabase
        .from('career_recommendations')
        .insert({
          user_id: user.id,
          recommended_career: career,
          confidence_score: 0.85, // Example confidence score
          career_details: details // Save full career details
        });

      if (recommendationError) throw recommendationError;

      // Save to career_roadmaps
      const roadmapSteps = {
        education: details.education,
        skills: details.skills,
        advancement: details.advancement,
        outlook: details.job_outlook
      };

      const { error: roadmapError } = await supabase
        .from('career_roadmaps')
        .insert({
          user_id: user.id,
          career: career,
          roadmap_steps: roadmapSteps,
          current_step: 1,
          completed_steps: []
        });

      if (roadmapError) throw roadmapError;

      // Save to user_preferences
      const { error: preferencesError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preferred_career_fields: [career],
          work_life_balance_preference: details.work_life_balance.rating.toString(),
          salary_expectations: details.salary_range,
          preferred_work_environment: details.day_to_day.split('. ').slice(0, 2)
        });

      if (preferencesError) throw preferencesError;

      toast.success('Career prediction saved successfully!');
    } catch (error) {
      console.error('Error saving career prediction:', error);
      toast.error('Failed to save career prediction');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Convert string scores to numbers, ensuring they are valid numbers
      const numericData = {
        math_score: Number(formData.math_score) || 0,
        history_score: Number(formData.history_score) || 0,
        physics_score: Number(formData.physics_score) || 0,
        chemistry_score: Number(formData.chemistry_score) || 0,
        biology_score: Number(formData.biology_score) || 0,
        english_score: Number(formData.english_score) || 0,
        geography_score: Number(formData.geography_score) || 0
      };

      // Validate scores are within range (0-100)
      for (const [key, value] of Object.entries(numericData)) {
        if (value < 0 || value > 100) {
          throw new Error(`Invalid ${key.replace('_', ' ')}. Must be between 0 and 100.`);
        }
      }

      console.log("📤 Sending prediction request:", numericData);
      
      const response = await fetch(API_CONFIG.getBackendUrl(API_CONFIG.endpoints.predict), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(numericData),
      const response = await fetch(`${API_URL}/api/chatbot-recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          gpa: parseFloat(gpa),
          career: predictions.career
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("📥 Received prediction result:", result);
      
      if (!result.career) {
        throw new Error("No career prediction received");
      }
      
      setPredictions({ 
        career: result.career,
        confidence_score: result.confidence_score
      });
      
      // Fetch career details
      setIsLoadingDetails(true);
      const detailsResponse = await fetch(API_CONFIG.getBackendUrl(API_CONFIG.endpoints.careerDetails), {

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
      const response = await fetch(`${API_URL}/api/career-roadmap`, {
 
        method: 'POST',
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ career: result.career })
      });
      
      if (!detailsResponse.ok) {
        throw new Error(`Failed to fetch career details: ${detailsResponse.status}`);
      }
      
      const details = await detailsResponse.json();
      console.log("📥 Received career details:", details);
      
      if (details.success && details.data) {
        const parsedDetails = JSON.parse(details.data);
        setPredictions(prev => ({ 
          ...prev!, 
          details: parsedDetails 
        }));
        
        // Save prediction and details to Supabase
        await saveCareerPrediction(result.career, parsedDetails);
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
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentMessage,
          career: predictions.career,
          subject_grades: formData,
          session_id: sessionId
        }),
      });
      
      toast.success('Career prediction successful!');
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get career prediction');
    } finally {
      setIsLoading(false);
      setIsLoadingDetails(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          {isInitialLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <Loader2 className="h-12 w-12 animate-spin text-white mb-4" />
              <p className="text-gray-400">Loading your career data...</p>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                    className="text-white border-gray-800 hover:bg-gray-800"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </div>
                {hasSavedPrediction && (
                  <Button
                    onClick={handleSubmit}
                    variant="outline"
                    className="text-white border-gray-800 hover:bg-gray-800"
                  >
                    Get New Prediction
                  </Button>
                )}
              </div>

              {!predictions ? (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold text-white mb-2">
                      Your Academic Profile
                    </h2>
                    <p className="text-gray-400">
                      Based on your saved academic scores
                    </p>
                  </div>

                  {isLoadingScores ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                      {[
                        { label: "Math Score", value: formData.math_score, icon: "📐" },
                        { label: "History Score", value: formData.history_score, icon: "📜" },
                        { label: "Physics Score", value: formData.physics_score, icon: "⚛️" },
                        { label: "Chemistry Score", value: formData.chemistry_score, icon: "🧪" },
                        { label: "Biology Score", value: formData.biology_score, icon: "🧬" },
                        { label: "English Score", value: formData.english_score, icon: "📚" },
                        { label: "Geography Score", value: formData.geography_score, icon: "🌍" },
                      ].map(({ label, value, icon }) => (
                        <div key={label} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400 flex items-center gap-2">
                              <span>{icon}</span>
                              {label}
                            </span>
                            <span className="text-white font-medium">{value || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2.5">
                            <div 
                              className="bg-white h-2.5 rounded-full" 
                              style={{ width: `${(parseInt(value) || 0)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-center pt-6">
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-200 hover:to-white px-8 py-6 text-lg transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Predicting...
                        </>
                      ) : (
                        'Predict My Career'
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-2xl font-semibold text-white">
                      {hasSavedPrediction ? 'Your Saved Career Path' : 'Your Career Path'}
                    </h2>
                    <p className="text-4xl font-bold text-white">
                      {predictions.career}
                    </p>
                    {predictions.confidence_score && (
                      <p className="text-gray-400">
                        Confidence Score: {(predictions.confidence_score * 100).toFixed(1)}%
                      </p>
                    )}
                  </div>

                  {isLoadingDetails ? (
                    <div className="flex justify-center py-8 min-h-[200px] items-center">
                      <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
                        <p className="text-gray-400">
                          {isSaving ? 'Saving your career prediction...' : 'Gathering detailed information about this career...'}
                        </p>
                      </div>
                    </div>
                  ) : predictions.details ? (
                    <div className="space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Overview</h3>
                            <p className="text-gray-300 leading-relaxed">{predictions.details.description}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Required Education</h3>
                            <p className="text-gray-300">{predictions.details.education}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Job Outlook</h3>
                            <p className="text-gray-300">{predictions.details.job_outlook}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Compensation</h3>
                            <p className="text-gray-300">{predictions.details.salary_range}</p>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Difficulty Level</h3>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-800/50 rounded-full h-2">
                                <div 
                                  className="bg-white h-2 rounded-full transition-all duration-500" 
                                  style={{ width: `${(predictions.details.difficulty / 10) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-white font-medium">{predictions.details.difficulty}/10</span>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Work-Life Balance</h3>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-full bg-gray-800/50 rounded-full h-2">
                                <div 
                                  className="bg-white h-2 rounded-full transition-all duration-500" 
                                  style={{ width: `${(predictions.details.work_life_balance.rating / 10) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-white font-medium">{predictions.details.work_life_balance.rating}/10</span>
                            </div>
                            <p className="text-gray-300">{predictions.details.work_life_balance.explanation}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Key Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {predictions.details.skills.map((skill, idx) => (
                            <span 
                              key={idx} 
                              className="px-4 py-2 bg-gray-800/50 rounded-full text-sm font-medium text-gray-200 hover:bg-gray-700/50 transition-colors"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-green-400">Pros</h3>
                          <ul className="space-y-2">
                            {predictions.details.pros.map((pro, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-300">
                                <span className="text-green-400 mt-1">•</span>
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-red-400">Cons</h3>
                          <ul className="space-y-2">
                            {predictions.details.cons.map((con, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-300">
                                <span className="text-red-400 mt-1">•</span>
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Day-to-Day Activities</h3>
                          <p className="text-gray-300">{predictions.details.day_to_day}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Career Advancement</h3>
                          <p className="text-gray-300">{predictions.details.advancement}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 min-h-[200px] flex items-center justify-center">
                      <div>
                        <p className="text-red-400 mb-2">Unable to load career details</p>
                        <Button 
                          onClick={() => {
                            setIsLoadingDetails(true);
                            handleSubmit(new Event('submit') as any);
                          }}
                          variant="outline" 
                          className="border-gray-800 text-white hover:bg-gray-800"
                        >
                          Try Again
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

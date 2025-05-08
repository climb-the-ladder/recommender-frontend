"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, Lightbulb, Brain, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import API_CONFIG from '@/lib/api-config';

type AlternativeCareer = {
  career: string;
  matching_score: number;
  explanation: string;
  key_skills: string[];
};

export default function AlternativesPage() {
  const [alternativeCareers, setAlternativeCareers] = useState<AlternativeCareer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [predictedCareer, setPredictedCareer] = useState<string | null>(null);
  const [academicScores, setAcademicScores] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }

      // Load predicted career
      const { data: careerData, error: careerError } = await supabase
        .from('career_recommendations')
        .select('recommended_career')
        .eq('user_id', user.id)
        .order('recommended_at', { ascending: false })
        .limit(1)
        .single();

      if (careerError) throw careerError;

      // Load most recent academic scores
      const { data: academicData, error: academicError } = await supabase
        .from('academic_scores')
        .select(`
          math_score,
          history_score,
          physics_score,
          chemistry_score,
          biology_score,
          english_score,
          geography_score,
          gpa,
          recorded_at
        `)
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      if (academicError) throw academicError;

      // Transform academic data to match the expected format
      const formattedAcademicData = {
        gpa: academicData.gpa,
        subject_mathematics: academicData.math_score,
        subject_history: academicData.history_score,
        subject_physics: academicData.physics_score,
        subject_chemistry: academicData.chemistry_score,
        subject_biology: academicData.biology_score,
        subject_english: academicData.english_score,
        subject_geography: academicData.geography_score
      };

      if (careerData) {
        setPredictedCareer(careerData.recommended_career);
        setAcademicScores(formattedAcademicData);
        fetchAlternativeCareers(careerData.recommended_career, formattedAcademicData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load user data');
    }
  };

  const fetchAlternativeCareers = async (career: string, academicScores: any) => {
    setIsLoading(true);
    try {
      const response = await fetch(API_CONFIG.getAiUrl(API_CONFIG.endpoints.aiChatbotRecommend), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          career,
          academic_scores: academicScores,
          gpa: academicScores.gpa // Keep this for backward compatibility
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get alternative careers');
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Transform the response to match our expected format
      const analyzedCareers = result.similar_careers.map((career: string) => ({
        career,
        matching_score: 0, // This will be updated by the backend
        explanation: "", // This will be updated by the backend
        key_skills: [] // This will be updated by the backend
      }));
      
      setAlternativeCareers(analyzedCareers);

      // Now get the analysis for each career
      const analysisResponse = await fetch(API_CONFIG.getAiUrl(API_CONFIG.endpoints.aiAnalyzeCareer), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careers: result.similar_careers,
          academic_scores: academicScores,
          predicted_career: career
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error('Failed to analyze careers');
      }

      const analysisResult = await analysisResponse.json();
      setAlternativeCareers(analysisResult.analyzed_careers);
      
    } catch (error) {
      console.error("Error getting alternative careers:", error);
      toast.error('Failed to get alternative careers');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="text-white hover:bg-gray-800/50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Alternative Careers
          </h1>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Title Card */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-gray-800 p-8">
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Similar Careers to {predictedCareer || 'Your Predicted Career'}
              </h2>
              <p className="text-gray-400 text-lg">
                Explore these career paths that align with your academic strengths and interests
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 blur-3xl" />
          </div>

          {/* Career Cards Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-white" />
                <p className="text-gray-400">Analyzing career matches...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {alternativeCareers.map((career, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-xl bg-gray-900/50 border border-gray-800 p-6 transition-all duration-300 hover:bg-gray-800/50 hover:border-gray-700"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-white group-hover:text-white/90">
                        {career.career}
                      </h3>
                      <div className="flex flex-col items-end">
                        <div className="text-sm text-gray-400">Match Score</div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                          {career.matching_score}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Explanation */}
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                        <p className="text-gray-300">{career.explanation}</p>
                      </div>
                      
                      {/* Key Skills */}
                      <div className="flex items-start gap-3">
                        <Brain className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Key Skills Match</p>
                          <div className="flex flex-wrap gap-2">
                            {career.key_skills.map((skill, skillIdx) => (
                              <span
                                key={skillIdx}
                                className="px-3 py-1 rounded-full bg-gray-800 text-sm text-gray-300"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-800">
                      <Button
                        variant="ghost"
                        className="w-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                        onClick={() => router.push(`/dashboard/career-details/${encodeURIComponent(career.career)}`)}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Explore Career Path
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-6 pt-8">
            <Button
              onClick={() => router.push('/dashboard/universities')}
              variant="outline"
              className="px-8 py-6 text-lg border-gray-800 text-white hover:bg-gray-800 transition-colors"
            >
              Explore Universities
            </Button>
            <Button
              onClick={() => router.push('/dashboard/roadmap')}
              className="px-8 py-6 text-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
            >
              View Career Roadmap
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 
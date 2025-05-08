'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2, GraduationCap, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface University {
  University_Name: string;
  Rank_Tier: string;
}

interface AcademicScores {
  math_score: number | null;
  history_score: number | null;
  physics_score: number | null;
  chemistry_score: number | null;
  biology_score: number | null;
  english_score: number | null;
  geography_score: number | null;
  gpa: number | null;
}

export default function AcademicScoresPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scores, setScores] = useState<AcademicScores>({
    math_score: null,
    history_score: null,
    physics_score: null,
    chemistry_score: null,
    biology_score: null,
    english_score: null,
    geography_score: null,
    gpa: null,
  });
  const [isSaved, setIsSaved] = useState(false);
  const [predictedCareer, setPredictedCareer] = useState<string | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [showUniversities, setShowUniversities] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          loadScores(),
          loadPredictedCareer()
        ]);
      } catch (error) {
        console.error('Error initializing data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsInitialLoading(false);
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const loadScores = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      
      if (!user) {
        console.error('No user found');
        router.push('/');
        return;
      }

      console.log('Loading academic scores for user:', user.id);

      const { data, error } = await supabase
        .from('academic_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      console.log('Raw Supabase response:', { data, error });

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No academic scores found for user:', user.id);
          setScores({
            math_score: null,
            history_score: null,
            physics_score: null,
            chemistry_score: null,
            biology_score: null,
            english_score: null,
            geography_score: null,
            gpa: null
          });
          return;
        }
        throw error;
      }

      if (data) {
        console.log('Raw data from Supabase:', data);
        
        // Convert all scores to numbers, handling null values and proper types
        const newScores = {
          math_score: data.math_score !== null ? Number(data.math_score) : null,
          history_score: data.history_score !== null ? Number(data.history_score) : null,
          physics_score: data.physics_score !== null ? Number(data.physics_score) : null,
          chemistry_score: data.chemistry_score !== null ? Number(data.chemistry_score) : null,
          biology_score: data.biology_score !== null ? Number(data.biology_score) : null,
          english_score: data.english_score !== null ? Number(data.english_score) : null,
          geography_score: data.geography_score !== null ? Number(data.geography_score) : null,
          gpa: data.gpa !== null ? Number(data.gpa) : null
        };

        console.log('Processed scores:', newScores);
        
        // Update state with the processed scores
        setScores(newScores);
        setIsSaved(true);
      } else {
        console.log('No data returned from Supabase');
        setScores({
          math_score: null,
          history_score: null,
          physics_score: null,
          chemistry_score: null,
          biology_score: null,
          english_score: null,
          geography_score: null,
          gpa: null
        });
      }
    } catch (error) {
      console.error('Error loading scores:', error);
      toast.error('Failed to load academic scores');
      throw error;
    }
  };

  const loadPredictedCareer = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log('Loading career prediction for user:', user.id);

      const { data, error } = await supabase
        .from('career_recommendations')
        .select(`
          recommended_career,
          career_details
        `)
        .eq('user_id', user.id)
        .order('recommended_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No career prediction found');
          return;
        }
        throw error;
      }

      if (data) {
        console.log('Found career prediction:', data);
        setPredictedCareer(data.recommended_career);
      }
    } catch (error) {
      console.error('Error loading predicted career:', error);
      toast.error('Failed to load career prediction');
      throw error;
    }
  };

  const loadUniversities = async () => {
    if (!scores.gpa) {
      toast.error('Please ensure your GPA is calculated');
      return;
    }

    if (!predictedCareer) {
      toast.error('Please get a career prediction first');
      return;
    }

    setLoadingUniversities(true);
    try {
      console.log('Fetching universities with GPA:', scores.gpa, 'and career:', predictedCareer);
      
      const response = await fetch('http://127.0.0.1:5050/api/chatbot-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gpa: scores.gpa,
          career: predictedCareer
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get university recommendations');
      }

      const data = await response.json();
      console.log('Received university recommendations:', data);
      setUniversities(data.recommended_universities || []);
      setShowUniversities(true);
    } catch (error) {
      console.error('Error loading universities:', error);
      toast.error('Failed to load university recommendations');
    } finally {
      setLoadingUniversities(false);
    }
  };

  const calculateGPA = (scores: AcademicScores): number | null => {
    const validScores = Object.entries(scores)
      .filter(([key]) => key !== 'gpa')
      .map(([_, value]) => value)
      .filter((score): score is number => score !== null);

    if (validScores.length === 0) return null;
    
    // Calculate average score on 0-100 scale
    const averageScore = validScores.reduce((a, b) => a + b, 0) / validScores.length;
    
    // Ensure score is within valid range (0-100)
    const clampedScore = Math.min(Math.max(averageScore, 0), 100);
    return Number(clampedScore.toFixed(2));
  };

  const handleScoreChange = async (field: keyof AcademicScores, value: number[]) => {
    const numValue = value[0];
    const newScores = { ...scores, [field]: numValue };
    
    if (field !== 'gpa') {
      newScores.gpa = calculateGPA(newScores);
    }
    
    setScores(newScores);
    setIsSaved(false);

    // Auto-save when all fields are filled
    const allFieldsFilled = Object.entries(newScores)
      .filter(([key]) => key !== 'gpa')
      .every(([_, value]) => value !== null);

    if (allFieldsFilled) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/');
          return;
        }

        const scoresWithGpa = { 
          ...newScores, 
          gpa: newScores.gpa !== null ? Number(newScores.gpa.toFixed(2)) : null,
          math_score: newScores.math_score !== null ? Math.round(newScores.math_score) : null,
          history_score: newScores.history_score !== null ? Math.round(newScores.history_score) : null,
          physics_score: newScores.physics_score !== null ? Math.round(newScores.physics_score) : null,
          chemistry_score: newScores.chemistry_score !== null ? Math.round(newScores.chemistry_score) : null,
          biology_score: newScores.biology_score !== null ? Math.round(newScores.biology_score) : null,
          english_score: newScores.english_score !== null ? Math.round(newScores.english_score) : null,
          geography_score: newScores.geography_score !== null ? Math.round(newScores.geography_score) : null
        };

        const { error } = await supabase
          .from('academic_scores')
          .upsert({
            user_id: user.id,
            ...scoresWithGpa,
            recorded_at: new Date().toISOString(),
          });

        if (error) throw error;

        setScores(scoresWithGpa);
        toast.success('Academic scores saved successfully');
        setIsSaved(true);
      } catch (error) {
        console.error('Error saving scores:', error);
        toast.error('Failed to save academic scores');
      }
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p>Loading your academic profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Your Academic Profile
            </h1>
            <p className="text-gray-400">View your academic scores and explore career predictions</p>
          </div>

          <Card className="bg-black border-gray-800 p-6">
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="border-gray-800 text-white hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              {isSaved && (
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm">Scores Saved</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { field: 'math_score', label: 'Math Score', icon: '📐' },
                  { field: 'history_score', label: 'History Score', icon: '📜' },
                  { field: 'physics_score', label: 'Physics Score', icon: '⚛️' },
                  { field: 'chemistry_score', label: 'Chemistry Score', icon: '🧪' },
                  { field: 'biology_score', label: 'Biology Score', icon: '🧬' },
                  { field: 'english_score', label: 'English Score', icon: '📚' },
                  { field: 'geography_score', label: 'Geography Score', icon: '🌍' },
                ].map(({ field, label, icon }) => (
                  <div key={field} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-gray-400 flex items-center gap-2">
                        <span>{icon}</span>
                        {label}
                      </Label>
                      <span className="text-white font-medium">
                        {scores[field as keyof AcademicScores] !== null 
                          ? `${scores[field as keyof AcademicScores]}%` 
                          : 'Not set'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[scores[field as keyof AcademicScores] ?? 0]}
                        onValueChange={(value) => handleScoreChange(field as keyof AcademicScores, value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                ))}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-400">GPA (Auto-calculated)</Label>
                    <span className="text-white font-medium">
                      {scores.gpa !== null ? `${scores.gpa.toFixed(2)}%` : 'Not calculated'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[scores.gpa ?? 0]}
                      onValueChange={(value) => handleScoreChange('gpa', value)}
                      className="flex-1 bg-muted"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-6">
                <Button
                  onClick={() => router.push('/predict')}
                  className="bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-200 hover:to-white px-8 py-6 text-lg transition-all duration-300"
                >
                  Get Career Prediction
                </Button>
              </div>
            </div>
          </Card>

          {showUniversities && (
            <Card className="bg-black border-gray-800 p-6">
              <h2 className="text-2xl font-semibold mb-6">Recommended Universities</h2>
              {universities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {universities.map((uni, index) => (
                    <div 
                      key={index}
                      className="p-4 border border-gray-800 rounded-lg hover:bg-gray-900/50 transition-colors"
                    >
                      <h3 className="text-lg font-medium mb-2">{uni.University_Name}</h3>
                      <p className="text-sm text-gray-400">
                        Rank Tier: {uni.Rank_Tier}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center">No universities found matching your criteria</p>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 
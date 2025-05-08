"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2, ChevronLeft, Search, MapPin, DollarSign, Star, Bookmark, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type UniversityRecommendation = {
  University_Name: string;
  Rank_Tier: string;
  Description?: string;
  Admission_Rate?: number;
  Tuition?: number;
  Location?: string;
  Relevant_Majors?: string[];
  Website?: string;
};

type UniversityResponse = {
  recommended_universities: UniversityRecommendation[];
  similar_careers: string[];
};

type SavedUniversity = {
  id: string;
  university_name: string;
  notes: string;
  saved_at: string;
};

type UniversitySummary = {
  overview: string;
  academic_programs: string;
  campus_life: string;
  achievements: string;
  unique_features: string;
};

export default function UniversitiesPage() {
  const [universityResponse, setUniversityResponse] = useState<UniversityResponse | null>(null);
  const [gpa, setGpa] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictedCareer, setPredictedCareer] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityRecommendation | null>(null);
  const [savedUniversities, setSavedUniversities] = useState<SavedUniversity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [budgetFilter, setBudgetFilter] = useState<number>(100000);
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [generatingSummary, setGeneratingSummary] = useState<boolean>(false);
  const [universitySummaries, setUniversitySummaries] = useState<Record<string, UniversitySummary>>({});
  const [selectedUniversitySummary, setSelectedUniversitySummary] = useState<UniversitySummary | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadPredictedCareer();
    loadGPA();
    loadSavedUniversities();
    loadSavedRecommendations();
  }, []);

  const loadSavedUniversities = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }

      const { data, error } = await supabase
        .from('saved_universities')
        .select('*')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        setSavedUniversities(data);
      }
    } catch (error) {
      console.error('Error loading saved universities:', error);
      toast.error('Failed to load saved universities');
    }
  };

  const loadSavedRecommendations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }

      const { data, error } = await supabase
        .from('university_preferences')
        .select('preferred_universities')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No saved recommendations found');
          return;
        }
        throw error;
      }

      if (data?.preferred_universities) {
        // Convert saved universities to the expected format
        const savedRecommendations: UniversityResponse = {
          recommended_universities: data.preferred_universities.map((name: string) => ({
            University_Name: name,
            Rank_Tier: "Saved Recommendation",
            Description: "Previously recommended university"
          })),
          similar_careers: []
        };
        setUniversityResponse(savedRecommendations);
      }
    } catch (error) {
      console.error('Error loading saved recommendations:', error);
      toast.error('Failed to load saved recommendations');
    }
  };

  const handleSaveUniversity = async (university: UniversityRecommendation) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }

      const { error } = await supabase
        .from('saved_universities')
        .insert({
          user_id: user.id,
          university_name: university.University_Name,
          notes: `Interested in ${predictedCareer || 'unknown career'}`,
        });

      if (error) throw error;
      
      toast.success('University saved successfully!');
      loadSavedUniversities();
    } catch (error) {
      console.error('Error saving university:', error);
      toast.error('Failed to save university');
    }
  };

  const loadPredictedCareer = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }

      const { data, error } = await supabase
        .from('career_recommendations')
        .select('recommended_career')
        .eq('user_id', user.id)
        .order('recommended_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No career recommendation found');
          return;
        }
        throw error;
      }

      if (data) {
        setPredictedCareer(data.recommended_career);
      }
    } catch (error) {
      console.error('Error loading predicted career:', error);
      toast.error('Failed to load predicted career');
    }
  };

  const loadGPA = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }

      const { data, error } = await supabase
        .from('academic_scores')
        .select('gpa')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No GPA found');
          toast.error('Please complete your academic scores first');
          router.push('/dashboard/academic-scores');
          return;
        }
        throw error;
      }

      if (data?.gpa) {
        setGpa(data.gpa);
      } else {
        toast.error('Please complete your academic scores first');
        router.push('/dashboard/academic-scores');
      }
    } catch (error) {
      console.error('Error loading GPA:', error);
      toast.error('Failed to load GPA');
    }
  };

  const handleGetRecommendations = async () => {
    if (!predictedCareer || gpa === null) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5050/api/chatbot-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          gpa: gpa,
          career: predictedCareer
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setUniversityResponse(result);

      // Save recommendations to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Save to university_preferences
        const { error: saveError } = await supabase
          .from('university_preferences')
          .upsert({
            user_id: user.id,
            preferred_universities: result.recommended_universities.map((uni: UniversityRecommendation) => uni.University_Name),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (saveError) throw saveError;

        // Update user_preferences to mark universities as completed
        const { error: updateError } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            preferred_universities: result.recommended_universities.map((uni: UniversityRecommendation) => uni.University_Name),
            updated_at: new Date().toISOString()
          });

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error("Error getting recommendations:", error);
      toast.error('Failed to get university recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const generateUniversitySummary = async (university: UniversityRecommendation) => {
    if (universitySummaries[university.University_Name]) {
      setSelectedUniversitySummary(universitySummaries[university.University_Name]);
      return;
    }
    
    setGeneratingSummary(true);
    try {
      const response = await fetch('http://127.0.0.1:5050/api/university-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          university_name: university.University_Name,
          additional_info: {
            rank_tier: university.Rank_Tier,
            admission_rate: university.Admission_Rate,
            tuition: university.Tuition,
            location: university.Location,
            relevant_majors: university.Relevant_Majors?.join(', ')
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      if (data.success && data.summary) {
        const summary = data.summary;
        // Validate the summary has all required fields and content
        const requiredFields = ['overview', 'academic_programs', 'campus_life', 'achievements', 'unique_features'];
        const isValid = requiredFields.every(field => 
          summary[field] && 
          typeof summary[field] === 'string' && 
          summary[field].trim().length > 0
        );
        
        if (!isValid) {
          throw new Error('Invalid summary format received');
        }

        setUniversitySummaries(prev => ({
          ...prev,
          [university.University_Name]: summary
        }));
        setSelectedUniversitySummary(summary);
      } else {
        throw new Error(data.error || 'Failed to generate summary');
      }
    } catch (error) {
      console.error('Error generating university summary:', error);
      toast.error('Failed to generate university summary. Please try again.');
      // Set a default summary to prevent empty dialog
      setSelectedUniversitySummary({
        overview: `Information about ${university.University_Name}`,
        academic_programs: 'Please try again later.',
        campus_life: 'Please try again later.',
        achievements: 'Please try again later.',
        unique_features: 'Please try again later.'
      });
    } finally {
      setGeneratingSummary(false);
    }
  };

  const filteredUniversities = universityResponse?.recommended_universities?.filter(uni => {
    const matchesSearch = uni.University_Name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBudget = !uni.Tuition || uni.Tuition <= budgetFilter;
    const matchesLocation = !locationFilter || uni.Location?.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesBudget && matchesLocation;
  });

  const renderUniversityCard = (uni: UniversityRecommendation) => (
    <Card key={uni.University_Name} className="bg-black border-gray-800 p-4 hover:border-gray-700 transition-colors">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{uni.University_Name}</h3>
            <Badge variant="outline" className="mt-1">
              {uni.Rank_Tier}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleSaveUniversity(uni)}
            className="text-gray-400 hover:text-white"
          >
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>
        
        {uni.Location && (
          <div className="flex items-center text-sm text-gray-400">
            <MapPin className="w-4 h-4 mr-1" />
            {uni.Location}
          </div>
        )}
        
        {uni.Tuition && (
          <div className="flex items-center text-sm text-gray-400">
            <DollarSign className="w-4 h-4 mr-1" />
            ${uni.Tuition.toLocaleString()}/year
          </div>
        )}

        <Button
          variant="outline"
          className="w-full border-gray-800 text-white hover:bg-gray-800"
          onClick={() => {
            setSelectedUniversity(uni);
            if (!universitySummaries[uni.University_Name]) {
              generateUniversitySummary(uni);
            }
          }}
        >
          View Details
        </Button>
      </div>
    </Card>
  );

  const renderUniversityDialog = () => {
    if (!selectedUniversity) return null;

    return (
      <Dialog open={!!selectedUniversity} onOpenChange={() => {
        setSelectedUniversity(null);
        setSelectedUniversitySummary(null);
      }}>
        <DialogContent className="bg-black border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedUniversity.University_Name}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedUniversity.Rank_Tier}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">
              {generatingSummary ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-400">Generating summary...</span>
                </div>
              ) : selectedUniversitySummary ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Overview</h4>
                    <p className="text-gray-400">{selectedUniversitySummary.overview}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Academic Programs</h4>
                    <p className="text-gray-400">{selectedUniversitySummary.academic_programs}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Campus Life</h4>
                    <p className="text-gray-400">{selectedUniversitySummary.campus_life}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Achievements</h4>
                    <p className="text-gray-400">{selectedUniversitySummary.achievements}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Unique Features</h4>
                    <p className="text-gray-400">{selectedUniversitySummary.unique_features}</p>
                  </div>

                  {/* Additional Information */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {selectedUniversity.Admission_Rate && (
                      <div className="bg-gray-900 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-400">Admission Rate</h4>
                        <p className="text-xl font-semibold">{selectedUniversity.Admission_Rate}%</p>
                      </div>
                    )}
                    {selectedUniversity.Tuition && (
                      <div className="bg-gray-900 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-400">Annual Tuition</h4>
                        <p className="text-xl font-semibold">${selectedUniversity.Tuition.toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {selectedUniversity.Relevant_Majors && (
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Relevant Majors</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedUniversity.Relevant_Majors.map((major, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-gray-900">
                            {major}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="text-white border-gray-800 hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">University Recommendations</h1>
          </div>

          <Card className="bg-black border-gray-800 p-6">
            <div className="space-y-6">
              {!universityResponse ? (
                <div className="flex flex-col gap-4">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Your University Recommendations
                    </h3>
                    <p className="text-gray-400">
                      Based on your predicted career: {predictedCareer || 'Not available'}
                    </p>
                    <p className="text-gray-400 mt-2">
                      Your GPA: {gpa?.toFixed(2) ?? 'Not set'}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => router.push('/dashboard/academic-scores')}
                      className="mt-4 text-white border-gray-800 hover:bg-gray-800"
                    >
                      Update Academic Scores
                    </Button>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      onClick={handleGetRecommendations}
                      disabled={isLoading || !predictedCareer || !gpa}
                      className="bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-200 hover:to-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating Recommendations
                        </>
                      ) : (
                        'Generate University Recommendations'
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search universities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-black border-gray-800 text-white"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="text-gray-400" />
                        <Slider
                          min={0}
                          max={100000}
                          step={1000}
                          value={[budgetFilter]}
                          onValueChange={(value) => setBudgetFilter(value[0])}
                          className="w-32"
                        />
                        <span className="text-sm text-gray-400">${budgetFilter.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="text-gray-400" />
                        <Input
                          placeholder="Location"
                          value={locationFilter}
                          onChange={(e) => setLocationFilter(e.target.value)}
                          className="w-32 bg-black border-gray-800 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredUniversities?.map(renderUniversityCard)}
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={() => setUniversityResponse(null)}
                      variant="outline"
                      className="border-gray-800 text-white hover:bg-gray-800"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => router.push('/dashboard/alternatives')}
                      className="bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-200 hover:to-white"
                    >
                      View Alternative Careers
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {renderUniversityDialog()}
    </div>
  );
} 
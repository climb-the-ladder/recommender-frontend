"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type RoadmapData = {
  roadmap_steps: {
    education: string;
    skills: string[];
    advancement: string;
    outlook: string;
    education_requirements: string[];
    experience_needed: string[];
    industry_certifications: string[];
    personal_development: string[];
    networking_suggestions: string[];
    timeline_milestones: string[];
  };
  current_step: number;
  completed_steps: number[];
};

export default function RoadmapPage() {
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictedCareer, setPredictedCareer] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadPredictedCareer();
  }, []);

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
        throw error;
      }

      if (data) {
        setPredictedCareer(data.recommended_career);
        fetchRoadmap(data.recommended_career);
      }
    } catch (error) {
      console.error('Error loading predicted career:', error);
      toast.error('Failed to load predicted career');
    }
  };

  const fetchRoadmap = async (career: string) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }

      const { data, error } = await supabase
        .from('career_roadmaps')
        .select('*')
        .eq('user_id', user.id)
        .eq('career', career)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No roadmap found, generate a new one
          const response = await fetch('http://127.0.0.1:5050/api/career-roadmap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ career }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to generate career roadmap');
          }
          
          const result = await response.json();
          
          if (result.error) {
            throw new Error(result.error);
          }

          // Save the new roadmap to the database
          const { error: saveError } = await supabase
            .from('career_roadmaps')
            .insert({
              user_id: user.id,
              career: career,
              roadmap_steps: {
                education: result.roadmap.education,
                skills: result.roadmap.skills,
                advancement: result.roadmap.advancement,
                outlook: result.roadmap.outlook,
                education_requirements: result.roadmap.education_requirements || ["Bachelor's degree in relevant field", "Consider graduate studies for specialization", "Continuous learning and professional development"],
                experience_needed: result.roadmap.experience_needed || ["Research assistant positions", "Internships in related fields", "Laboratory or fieldwork experience", "Project-based experience"],
                industry_certifications: result.roadmap.industry_certifications || ["Specialized certifications in your field", "Software and tools proficiency certificates", "Professional association memberships"],
                personal_development: result.roadmap.personal_development || ["Time management and organization skills", "Resilience and adaptability", "Ethical judgment", "Curiosity and continuous learning"],
                networking_suggestions: result.roadmap.networking_suggestions || ["Join professional associations in your field", "Attend conferences and seminars", "Connect with professors and mentors", "Participate in online communities and forums"],
                timeline_milestones: result.roadmap.timeline_milestones || ["Complete undergraduate degree", "Secure first professional position", "Publish research or contribute to projects", "Achieve professional recognition", "Mentor others in your field"]
              },
              current_step: 1,
              completed_steps: []
            });

          if (saveError) throw saveError;
          
          setRoadmapData({
            roadmap_steps: {
              education: result.roadmap.education,
              skills: result.roadmap.skills,
              advancement: result.roadmap.advancement,
              outlook: result.roadmap.outlook,
              education_requirements: result.roadmap.education_requirements || ["Bachelor's degree in relevant field", "Consider graduate studies for specialization", "Continuous learning and professional development"],
              experience_needed: result.roadmap.experience_needed || ["Research assistant positions", "Internships in related fields", "Laboratory or fieldwork experience", "Project-based experience"],
              industry_certifications: result.roadmap.industry_certifications || ["Specialized certifications in your field", "Software and tools proficiency certificates", "Professional association memberships"],
              personal_development: result.roadmap.personal_development || ["Time management and organization skills", "Resilience and adaptability", "Ethical judgment", "Curiosity and continuous learning"],
              networking_suggestions: result.roadmap.networking_suggestions || ["Join professional associations in your field", "Attend conferences and seminars", "Connect with professors and mentors", "Participate in online communities and forums"],
              timeline_milestones: result.roadmap.timeline_milestones || ["Complete undergraduate degree", "Secure first professional position", "Publish research or contribute to projects", "Achieve professional recognition", "Mentor others in your field"]
            },
            current_step: 1,
            completed_steps: []
          });
        } else {
          throw error;
        }
      } else {
        setRoadmapData(data);
      }
    } catch (error) {
      console.error("Error getting career roadmap:", error);
      toast.error('Failed to get career roadmap');
    } finally {
      setIsLoading(false);
    }
  };

  const markStepComplete = async (stepIndex: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !roadmapData) return;

      const newCompletedSteps = [...roadmapData.completed_steps];
      if (!newCompletedSteps.includes(stepIndex)) {
        newCompletedSteps.push(stepIndex);
      }

      const { error } = await supabase
        .from('career_roadmaps')
        .update({
          completed_steps: newCompletedSteps,
          current_step: Math.max(...newCompletedSteps) + 1
        })
        .eq('user_id', user.id)
        .eq('career', predictedCareer);

      if (error) throw error;

      setRoadmapData(prev => prev ? {
        ...prev,
        completed_steps: newCompletedSteps,
        current_step: Math.max(...newCompletedSteps) + 1
      } : null);

      toast.success('Step marked as complete!');
    } catch (error) {
      console.error('Error updating step:', error);
      toast.error('Failed to update step');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
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
            <h1 className="text-3xl font-bold">Career Roadmap</h1>
          </div>

          <Card className="bg-black border-gray-800 p-6">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Your Path to Becoming a {predictedCareer || 'Professional'}
                </h3>
                <p className="text-gray-400">
                  A personalized roadmap to help you achieve your career goals
                </p>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
              ) : roadmapData ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-black border-gray-800 p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <h4 className="text-lg font-semibold text-white">Education Requirements</h4>
                        </div>
                        <p className="text-gray-400 pl-4 border-l-2 border-gray-800">{roadmapData.roadmap_steps.education}</p>
                      </div>
                    </Card>

                    <Card className="bg-black border-gray-800 p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <h4 className="text-lg font-semibold text-white">Career Advancement</h4>
                        </div>
                        <p className="text-gray-400 pl-4 border-l-2 border-gray-800">{roadmapData.roadmap_steps.advancement}</p>
                      </div>
                    </Card>

                    <Card className="bg-black border-gray-800 p-6 md:col-span-2">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <h4 className="text-lg font-semibold text-white">Skills to Develop</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {roadmapData.roadmap_steps.skills.map((skill, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                              <p className="text-gray-400">{skill}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-black border-gray-800 p-6 md:col-span-2">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <h4 className="text-lg font-semibold text-white">Job Outlook</h4>
                        </div>
                        <p className="text-gray-400 pl-4 border-l-2 border-gray-800">{roadmapData.roadmap_steps.outlook}</p>
                      </div>
                    </Card>

                    <Card className="bg-black border-gray-800 p-6 md:col-span-2">
                      <div className="space-y-4">
                        {/* Development Areas */}
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-gray-800">
                            Key Development Areas
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <h4 className="text-lg font-medium text-white">Education Requirements</h4>
                              <ul className="space-y-2">
                                {(roadmapData.roadmap_steps.education_requirements || ["Bachelor's degree in relevant field", "Consider graduate studies for specialization", "Continuous learning and professional development"]).map((item, idx) => (
                                  <li key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-lg font-medium text-white">Skills to Develop</h4>
                              <ul className="space-y-2">
                                {(roadmapData.roadmap_steps.skills || ["Critical thinking and problem-solving", "Technical skills relevant to your field", "Communication and presentation", "Research methodology", "Data analysis"]).map((item, idx) => (
                                  <li key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-lg font-medium text-white">Experience Needed</h4>
                              <ul className="space-y-2">
                                {(roadmapData.roadmap_steps.experience_needed || ["Research assistant positions", "Internships in related fields", "Laboratory or fieldwork experience", "Project-based experience"]).map((item, idx) => (
                                  <li key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-lg font-medium text-white">Industry Certifications</h4>
                              <ul className="space-y-2">
                                {(roadmapData.roadmap_steps.industry_certifications || ["Specialized certifications in your field", "Software and tools proficiency certificates", "Professional association memberships"]).map((item, idx) => (
                                  <li key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-lg font-medium text-white">Personal Development</h4>
                              <ul className="space-y-2">
                                {(roadmapData.roadmap_steps.personal_development || ["Time management and organization skills", "Resilience and adaptability", "Ethical judgment", "Curiosity and continuous learning"]).map((item, idx) => (
                                  <li key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-lg font-medium text-white">Networking Suggestions</h4>
                              <ul className="space-y-2">
                                {(roadmapData.roadmap_steps.networking_suggestions || ["Join professional associations in your field", "Attend conferences and seminars", "Connect with professors and mentors", "Participate in online communities and forums"]).map((item, idx) => (
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
                              {(roadmapData.roadmap_steps.timeline_milestones || ["Complete undergraduate degree", "Secure first professional position", "Publish research or contribute to projects", "Achieve professional recognition", "Mentor others in your field"]).map((item, idx) => (
                                <li key={idx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-800">
                    <h4 className="text-lg font-medium text-white mb-4">Career Timeline</h4>
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800"></div>
                      
                      {/* Timeline items */}
                      <div className="space-y-6">
                        {(roadmapData?.roadmap_steps?.timeline_milestones || [
                          "Year 1: Complete foundational courses",
                          "Year 2: Gain internship experience",
                          "Year 3: Complete degree requirements",
                          "Year 4: Secure entry-level position",
                          "Year 5: Pursue advanced certifications"
                        ]).map((milestone, idx) => {
                          const year = milestone.split(':')[0];
                          const description = milestone.split(':')[1].trim();
                          const isCompleted = roadmapData?.completed_steps?.includes(idx) || false;
                          
                          return (
                            <div key={idx} className="relative pl-12">
                              {/* Timeline dot */}
                              <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${
                                isCompleted ? 'bg-green-500' : 'bg-gray-600'
                              }`}></div>
                              
                              {/* Timeline content */}
                              <div className={`p-4 rounded-lg ${
                                isCompleted ? 'bg-green-900/20 border-green-800' : 'bg-gray-900/50 border-gray-800'
                              } border`}>
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-semibold text-white">{year}</span>
                                  {!isCompleted && roadmapData && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs border-gray-700 hover:bg-gray-800"
                                      onClick={() => markStepComplete(idx)}
                                    >
                                      Mark Complete
                                    </Button>
                                  )}
                                </div>
                                <p className="mt-2 text-gray-300">{description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 pt-4">
                    <Button
                      onClick={() => router.push('/dashboard/alternatives')}
                      variant="outline"
                      className="border-gray-800 text-white hover:bg-gray-800"
                    >
                      Back to Alternative Careers
                    </Button>
                    <Button
                      onClick={() => router.push('/dashboard/universities')}
                      className="bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-200 hover:to-white"
                    >
                      View University Recommendations
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No roadmap data available</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 
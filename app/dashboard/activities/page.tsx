'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';

interface StudyHabits {
  preferred_study_time: string;
  study_environment: string;
  learning_style: string;
  study_methods: string;
}

interface Interests {
  academic_interests: string;
  extracurricular_activities: string;
  career_interests: string;
  skills: string;
}

export default function ActivitiesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [studyHabits, setStudyHabits] = useState<StudyHabits>({
    preferred_study_time: '',
    study_environment: '',
    learning_style: '',
    study_methods: ''
  });
  const [interests, setInterests] = useState<Interests>({
    academic_interests: '',
    extracurricular_activities: '',
    career_interests: '',
    skills: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadExistingData();
    }
  }, [user]);

  const loadExistingData = async () => {
    try {
      const { data } = await supabase
        .from('student_activities')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setStudyHabits({
          preferred_study_time: data.preferred_study_time || '',
          study_environment: data.study_environment || '',
          learning_style: data.learning_style || '',
          study_methods: data.study_methods || ''
        });
        setInterests({
          academic_interests: data.academic_interests || '',
          extracurricular_activities: data.extracurricular_activities || '',
          career_interests: data.career_interests || '',
          skills: data.skills || ''
        });
      }
    } catch (error) {
      console.error('Error loading activities data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('student_activities')
        .upsert({
          user_id: user.id,
          ...studyHabits,
          ...interests,
          recorded_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Your activities and preferences have been saved successfully.',
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving activities:', error);
      toast({
        title: 'Error',
        description: 'There was an error saving your activities. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8">Activities & Preferences</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Study Habits Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Study Habits</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="preferred_study_time">Preferred Study Time</Label>
                  <Input
                    id="preferred_study_time"
                    value={studyHabits.preferred_study_time}
                    onChange={(e) => setStudyHabits({ ...studyHabits, preferred_study_time: e.target.value })}
                    placeholder="e.g., Morning, Afternoon, Evening"
                  />
                </div>

                <div>
                  <Label htmlFor="study_environment">Study Environment</Label>
                  <Input
                    id="study_environment"
                    value={studyHabits.study_environment}
                    onChange={(e) => setStudyHabits({ ...studyHabits, study_environment: e.target.value })}
                    placeholder="e.g., Quiet room, Library, Coffee shop"
                  />
                </div>

                <div>
                  <Label htmlFor="learning_style">Learning Style</Label>
                  <Input
                    id="learning_style"
                    value={studyHabits.learning_style}
                    onChange={(e) => setStudyHabits({ ...studyHabits, learning_style: e.target.value })}
                    placeholder="e.g., Visual, Auditory, Kinesthetic"
                  />
                </div>

                <div>
                  <Label htmlFor="study_methods">Study Methods</Label>
                  <Textarea
                    id="study_methods"
                    value={studyHabits.study_methods}
                    onChange={(e) => setStudyHabits({ ...studyHabits, study_methods: e.target.value })}
                    placeholder="Describe your preferred study methods"
                  />
                </div>
              </div>
            </div>

            {/* Interests Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Interests</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="academic_interests">Academic Interests</Label>
                  <Textarea
                    id="academic_interests"
                    value={interests.academic_interests}
                    onChange={(e) => setInterests({ ...interests, academic_interests: e.target.value })}
                    placeholder="List your academic interests and favorite subjects"
                  />
                </div>

                <div>
                  <Label htmlFor="extracurricular_activities">Extracurricular Activities</Label>
                  <Textarea
                    id="extracurricular_activities"
                    value={interests.extracurricular_activities}
                    onChange={(e) => setInterests({ ...interests, extracurricular_activities: e.target.value })}
                    placeholder="List your extracurricular activities and hobbies"
                  />
                </div>

                <div>
                  <Label htmlFor="career_interests">Career Interests</Label>
                  <Textarea
                    id="career_interests"
                    value={interests.career_interests}
                    onChange={(e) => setInterests({ ...interests, career_interests: e.target.value })}
                    placeholder="Describe your career interests and aspirations"
                  />
                </div>

                <div>
                  <Label htmlFor="skills">Skills</Label>
                  <Textarea
                    id="skills"
                    value={interests.skills}
                    onChange={(e) => setInterests({ ...interests, skills: e.target.value })}
                    placeholder="List your skills and strengths"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
} 
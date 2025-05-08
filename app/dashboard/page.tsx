'use client';



import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User, BookOpen, Activity, Target, Map, GraduationCap, Lightbulb } from 'lucide-react';
import { SettingsDialog } from '@/components/settings-dialog';
import { ProgressChecklist } from '@/components/progress-checklist';
import { Progress } from '@/components/ui/progress';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';

type ChecklistStatus = 'completed' | 'incomplete' | 'ready';

interface ChecklistItem {
  id: string;
  title: string;
  subtitle: string;
  status: ChecklistStatus;
  href: string;
  icon: React.ReactNode;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [dropdownKey, setDropdownKey] = useState(0);
  const [profileItems, setProfileItems] = useState<ChecklistItem[]>([]);
  const [futureItems, setFutureItems] = useState<ChecklistItem[]>([]);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadProfileProgress();
    }
  }, [user]);

  const loadProfileProgress = async () => {
    try {
      // Load academic scores
      const { data: academicData } = await supabase
        .from('academic_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      // Load activities
      const { data: activitiesData } = await supabase
        .from('student_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      // Load career recommendations
      const { data: careerData } = await supabase
        .from('career_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('recommended_at', { ascending: false })
        .limit(1)
        .single();

      // Load university preferences
      const { data: universityData } = await supabase
        .from('university_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Load user preferences
      const { data: preferencesData } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Update profile items status
      const updatedProfileItems: ChecklistItem[] = [
        {
          id: 'academic',
          title: 'Academic Scores',
          subtitle: 'Enter your grades and academic achievements',
          status: academicData ? 'completed' : 'incomplete',
          href: '/dashboard/academic-scores',
          icon: <BookOpen className="h-5 w-5" />
        },
        {
          id: 'activities',
          title: 'Activities & Preferences',
          subtitle: 'Tell us about your study habits and interests',
          status: activitiesData ? 'completed' : 'incomplete',
          href: '/dashboard/activities',
          icon: <Activity className="h-5 w-5" />
        }
      ];

      // Update future items status
      const updatedFutureItems: ChecklistItem[] = [
        {
          id: 'prediction',
          title: 'Career Prediction',
          subtitle: 'Generate your personalized career recommendations',
          status: careerData ? 'completed' : 'ready',
          href: '/predict',
          icon: <Target className="h-5 w-5" />
        },
        {
          id: 'universities',
          title: 'University Recommendations',
          subtitle: 'View recommended universities based on your profile',
          status: universityData ? 'completed' : 'incomplete',
          href: '/dashboard/universities',
          icon: <GraduationCap className="h-5 w-5" />
        },
        {
          id: 'alternatives',
          title: 'Alternative Careers',
          subtitle: 'Explore related career options and alternatives',
          status: preferencesData ? 'completed' : 'incomplete',
          href: '/dashboard/alternatives',
          icon: <Lightbulb className="h-5 w-5" />
        },
        {
          id: 'roadmap',
          title: 'Roadmap',
          subtitle: 'View your personalized career path',
          status: careerData ? 'ready' : 'incomplete',
          href: '/dashboard/roadmap',
          icon: <Map className="h-5 w-5" />
        }
      ];

      setProfileItems(updatedProfileItems);
      setFutureItems(updatedFutureItems);

      // Calculate progress
      const totalItems = [...updatedProfileItems, ...updatedFutureItems].length;
      const completedItems = [...updatedProfileItems, ...updatedFutureItems]
        .filter(item => item.status === 'completed').length;
      const progressPercentage = Math.round((completedItems / totalItems) * 100);
      setProgress(progressPercentage);
    } catch (error) {
      console.error('Error loading profile progress:', error);
    }
  };

  const handleSettingsClose = () => {
    setIsSettingsOpen(false);
    setDropdownKey(prev => prev + 1);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link href="/dashboard" className="flex items-center">
                  <span className="text-xl font-bold">ClimbTheLadder</span>
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Welcome back, {user.user_metadata?.first_name || 'there'}
            </h1>
            <p className="mt-2 text-muted-foreground">
              Let&apos;s continue building your career path
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Profile Completion</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* Profile Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Tell Us About Yourself</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground mb-6">
                Help us understand your academic background and interests to provide better recommendations
              </p>
              <ProgressChecklist items={profileItems} />
            </div>
          </div>

          {/* Future Planning Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Your Future Path</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground mb-6">
                Explore career opportunities and plan your journey ahead
              </p>
              <ProgressChecklist items={futureItems} />
            </div>
          </div>
        </main>

        <SettingsDialog open={isSettingsOpen} onOpenChange={handleSettingsClose} />
      </div>
    </ProtectedRoute>
  );
} 
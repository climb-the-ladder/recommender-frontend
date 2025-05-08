'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

interface Profile {
  first_name: string;
  last_name: string;
  gender: Gender;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    first_name: '',
    last_name: '',
    gender: 'prefer_not_to_say',
  });

  useEffect(() => {
    if (open) {
      loadProfile();
    }
  }, [open]);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No user found');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name, gender')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        throw error;
      }

      if (data) {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          gender: (data.gender as Gender) || 'prefer_not_to_say',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No user found');
        toast.error('No user found. Please try logging in again.');
        return;
      }

      console.log('Saving profile for user:', user.id);
      console.log('Profile data:', profile);

      // First, try to update the auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: profile.first_name,
          last_name: profile.last_name,
        }
      });

      if (authError) {
        console.error('Error updating auth user:', authError);
        throw authError;
      }

      // Then update the users table
      const { error: dbError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          gender: profile.gender,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (dbError) {
        console.error('Error saving to database:', dbError);
        throw dbError;
      }

      toast.success('Profile updated successfully');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences" disabled>Preferences</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={profile.first_name}
                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={profile.last_name}
                onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={profile.gender}
                onValueChange={(value: Gender) => setProfile({ ...profile, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          <TabsContent value="preferences">
            <div className="text-center py-4 text-muted-foreground">
              Preferences coming soon
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
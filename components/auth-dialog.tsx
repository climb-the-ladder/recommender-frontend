'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AuthDialog() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }
      
      // Close dialog - useAuth will handle the redirect
      setIsSignInOpen(false);
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: email,
              first_name: firstName,
              last_name: lastName,
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          setError(profileError.message);
          setIsLoading(false);
          return;
        }
      }
      
      // Close dialog - useAuth will handle the redirect
      setIsSignUpOpen(false);
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-4">
      <Dialog open={isSignInOpen} onOpenChange={(open) => {
        if (!isLoading) setIsSignInOpen(open);
      }}>
        <DialogContent className="sm:max-w-[425px] p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-bold text-center">Sign In</DialogTitle>
          </DialogHeader>
          <form className="space-y-6" onSubmit={handleSignIn}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <Input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-lg"
                disabled={isLoading}
              />
              <Input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-lg"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isSignUpOpen} onOpenChange={(open) => {
        if (!isLoading) setIsSignUpOpen(open);
      }}>
        <DialogContent className="sm:max-w-[425px] p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-bold text-center">Create Account</DialogTitle>
          </DialogHeader>
          <form className="space-y-6" onSubmit={handleSignUp}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <Input
                type="text"
                required
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-12 text-lg"
                disabled={isLoading}
              />
              <Input
                type="text"
                required
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-12 text-lg"
                disabled={isLoading}
              />
              <Input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-lg"
                disabled={isLoading}
              />
              <Input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-lg"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Button variant="ghost" className="px-6" onClick={() => setIsSignInOpen(true)}>
        Sign In
      </Button>
      <Button className="px-6" onClick={() => setIsSignUpOpen(true)}>
        Sign Up
      </Button>
    </div>
  );
} 
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

interface FormData {
  email: string;
  password: string;
}

interface AuthPageProps {
  onContinueAsGuest: () => void;
}

const isStaticHost = window.location.hostname.endsWith('.github.io') ||
  window.location.protocol === 'file:';

export default function AuthPage({ onContinueAsGuest }: AuthPageProps) {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

  const signInForm = useForm<FormData>();
  const signUpForm = useForm<FormData>();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setError('');
  };

  const parseJsonResponse = async (res: Response) => {
    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      throw new Error('Authentication service is unavailable. Please play as a guest.');
    }
    return res.json();
  };

  const handleSignIn = async (data: FormData) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await parseJsonResponse(res);
      if (!res.ok) throw new Error(json.error);
      login(json.token, json.user);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (data: FormData) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await parseJsonResponse(res);
      if (!res.ok) throw new Error(json.error);
      login(json.token, json.user);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl mb-4 text-amber-900">🏴‍☠️ Treasure Hunt Game 🏴‍☠️</h1>
        <p className="text-amber-700">
          {isStaticHost ? 'Play as a guest — no account needed' : 'Sign in to save your scores, or play as a guest'}
        </p>
      </div>

      {isStaticHost ? (
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-6 pb-6 text-center space-y-4">
            <p className="text-amber-800 text-sm">
              This is a static demo hosted on GitHub Pages. Account sign-in and score saving require the backend server and are not available here.
            </p>
            <Button
              onClick={onContinueAsGuest}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              Play Now (Guest Mode)
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="w-full max-w-md shadow-lg">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <CardHeader className="pb-0">
                <TabsList className="w-full">
                  <TabsTrigger value="signin" className="flex-1">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent className="pt-6">
                <TabsContent value="signin" className="mt-0">
                  <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        {...signInForm.register('email', { required: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        {...signInForm.register('password', { required: true })}
                      />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <Button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      disabled={loading}
                    >
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-0">
                  <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        {...signUpForm.register('email', { required: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Min. 6 characters"
                        {...signUpForm.register('password', { required: true, minLength: 6 })}
                      />
                      {signUpForm.formState.errors.password?.type === 'minLength' && (
                        <p className="text-sm text-red-600">Password must be at least 6 characters</p>
                      )}
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <Button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      disabled={loading}
                    >
                      {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          <div className="mt-6">
            <Button
              variant="ghost"
              onClick={onContinueAsGuest}
              className="text-amber-700 hover:text-amber-900 hover:bg-amber-100"
            >
              Continue as Guest (scores won't be saved)
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

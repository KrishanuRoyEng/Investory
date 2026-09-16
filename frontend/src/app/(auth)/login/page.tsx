'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      const { data: resData, error: apiError, response } = await apiFetch.POST('/auth/login', {
        body: data,
      });

      if (response.status === 429) {
        setError('Too many attempts. Please try again shortly.');
        return;
      }

      if (apiError || !resData) {
        setError((apiError as any)?.error?.message || 'Invalid email or password');
        return;
      }

      // @ts-ignore
      setAuth(resData.data.accessToken, resData.data.user);
      toast.success('Successfully logged in');
      router.push('/dashboard');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-border shadow-sm p-8 rounded-lg shadow-2xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
        <p className="text-foreground/60">Sign in to your account to continue</p>
      </div>

      <div className="mb-6 grid grid-cols-5 gap-2">
        <button type="button" onClick={() => onSubmit({email: 'admin@stocklearn.com', password: 'Password123!'})} className="px-2 py-1.5 text-xs font-medium bg-surface/50 hover:bg-surface border border-border rounded-md transition-colors">Admin</button>
        <button type="button" onClick={() => onSubmit({email: 'instructor@stocklearn.com', password: 'Password123!'})} className="px-2 py-1.5 text-xs font-medium bg-surface/50 hover:bg-surface border border-border rounded-md transition-colors">Instructor</button>
        <button type="button" onClick={() => onSubmit({email: 'learner@stocklearn.com', password: 'Password123!'})} className="px-2 py-1.5 text-xs font-medium bg-surface/50 hover:bg-surface border border-border rounded-md transition-colors">L 1</button>
        <button type="button" onClick={() => onSubmit({email: 'learner2@stocklearn.com', password: 'Password123!'})} className="px-2 py-1.5 text-xs font-medium bg-surface/50 hover:bg-surface border border-border rounded-md transition-colors">L 2</button>
        <button type="button" onClick={() => onSubmit({email: 'learner3@stocklearn.com', password: 'Password123!'})} className="px-2 py-1.5 text-xs font-medium bg-surface/50 hover:bg-surface border border-border rounded-md transition-colors">L 3</button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 dark:text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-1.5">Email</label>
          <input
            id="email"
            {...register('email')}
            type="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="w-full bg-background border border-border shadow-sm rounded-lg px-4 py-2.5 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            placeholder="name@example.com"
          />
          {errors.email && <p id="email-error" className="text-red-500 dark:text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-foreground/80">Password</label>
            <Link href="/forgot-password" className="text-xs text-primary hover:text-primary/80 transition-colors">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            {...register('password')}
            type="password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="w-full bg-background border border-border shadow-sm rounded-lg px-4 py-2.5 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            placeholder="••••••••"
          />
          {errors.password && <p id="password-error" className="text-red-500 dark:text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 text-foreground font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in'}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-surface px-4 text-foreground/60">Or continue with</span>
          </div>
        </div>

        <Link
          href="/login/otp"
          className="w-full flex items-center justify-center border border-border shadow-sm hover:bg-surface/80 text-foreground/80 font-medium py-2.5 rounded-lg transition-colors"
        >
          Sign in with OTP
        </Link>
      </form>

      <p className="mt-8 text-center text-sm text-foreground/60">
        Don't have an account?{' '}
        <Link href="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
}

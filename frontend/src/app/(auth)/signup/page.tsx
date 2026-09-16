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

// Strictly mirrors backend SignupDto minLength(8)
const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setError(null);
    try {
      const { data: resData, error: apiError, response } = await apiFetch.POST('/auth/signup', {
        body: { email: data.email, password: data.password },
      });

      if (response.status === 429) {
        setError('Too many attempts. Please try again shortly.');
        return;
      }

      if (apiError || !resData) {
        setError((apiError as any)?.error?.message || 'Failed to sign up');
        return;
      }

      // @ts-ignore
      setAuth(resData.data.accessToken, resData.data.user);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-border shadow-sm p-8 rounded-lg shadow-2xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Create an account</h2>
        <p className="text-foreground/60">Join StockLearn to master the markets</p>
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
          <label htmlFor="password" className="block text-sm font-medium text-foreground/80 mb-1.5">Password</label>
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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground/80 mb-1.5">Confirm Password</label>
          <input
            id="confirmPassword"
            {...register('confirmPassword')}
            type="password"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
            className="w-full bg-background border border-border shadow-sm rounded-lg px-4 py-2.5 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            placeholder="••••••••"
          />
          {errors.confirmPassword && <p id="confirmPassword-error" className="text-red-500 dark:text-red-400 text-xs mt-1.5">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 text-foreground font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign up'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-foreground/60">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}

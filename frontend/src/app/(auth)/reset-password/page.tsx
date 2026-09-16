'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const resetSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters long'), // Strictly mirrors backend DTO minLength(8)
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
  });

  if (!token) {
    return (
      <div className="bg-surface/80 backdrop-blur-xl border border-border shadow-sm p-8 rounded-lg shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Invalid Link</h2>
        <p className="text-foreground/60 mb-6">The password reset link is missing from the URL.</p>
        <button onClick={() => router.push('/forgot-password')} className="bg-emerald-500 hover:bg-emerald-600 text-foreground font-medium px-6 py-2 rounded-lg transition-colors">
          Request new link
        </button>
      </div>
    );
  }

  const onSubmit = async (data: z.infer<typeof resetSchema>) => {
    setError(null);
    try {
      const { error: apiError, response } = await apiFetch.POST('/auth/reset-password', {
        body: { token, password: data.password },
      });

      if (response.status === 429) {
        setError('Too many requests. Please try again shortly.');
        return;
      }

      if (apiError) {
        setError((apiError as any)?.error?.message || 'Failed to reset password. Link might be expired.');
        return;
      }

      toast.success('Password reset successfully!');
      router.push('/login');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-border shadow-sm p-8 rounded-lg shadow-2xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Set new password</h2>
        <p className="text-foreground/60">Please enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 dark:text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground/80 mb-1.5">New Password</label>
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
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground/80 mb-1.5">Confirm New Password</label>
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
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset password'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

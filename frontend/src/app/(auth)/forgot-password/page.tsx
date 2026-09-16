'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiFetch } from '@/lib/api/client';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: z.infer<typeof forgotSchema>) => {
    setError(null);
    try {
      const { response } = await apiFetch.POST('/auth/forgot-password', {
        body: { email: data.email },
      });
      
      if (response.status === 429) {
        setError('Too many requests. Please try again shortly.');
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-border shadow-sm p-8 rounded-lg shadow-2xl relative">
      <Link href="/login" className="absolute top-8 left-8 text-foreground/60 hover:text-foreground transition-colors">
        <ArrowLeft className="w-5 h-5" />
      </Link>

      <div className="mb-8 text-center pt-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Reset Password</h2>
        <p className="text-foreground/60">
          {isSuccess 
            ? "If that email is in our system, we've sent a reset link." 
            : "Enter your email and we'll send you a link to reset your password."}
        </p>
      </div>

      {!isSuccess ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 dark:text-red-400 p-3 rounded-lg text-sm mb-6">
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-foreground font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send reset link'}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <Link href="/login" className="w-full inline-block bg-surface/80 hover:bg-slate-700 text-foreground font-medium py-2.5 rounded-lg transition-colors">
            Return to login
          </Link>
        </div>
      )}
    </div>
  );
}

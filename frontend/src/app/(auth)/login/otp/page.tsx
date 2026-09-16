'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const requestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const verifySchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export default function OtpLoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);
  
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { register: registerRequest, handleSubmit: handleRequestSubmit, formState: { errors: requestErrors, isSubmitting: isRequesting } } = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
  });

  const { register: registerVerify, handleSubmit: handleVerifySubmit, formState: { errors: verifyErrors, isSubmitting: isVerifying } } = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onRequest = async (data: z.infer<typeof requestSchema>) => {
    setError(null);
    try {
      const { error: apiError, response } = await apiFetch.POST('/auth/request-otp', {
        body: { email: data.email },
      });

      if (response.status === 429) {
        setError('Too many requests. Please try again shortly.');
        return;
      }

      if (apiError) {
        setError((apiError as any)?.error?.message || 'Failed to request OTP');
        return;
      }

      setEmail(data.email);
      setStep('verify');
      toast.success('OTP sent to your email');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const onVerify = async (data: z.infer<typeof verifySchema>) => {
    setError(null);
    try {
      const { data: resData, error: apiError, response } = await apiFetch.POST('/auth/login-otp', {
        body: { email, otp: data.otp },
      });

      if (response.status === 429) {
        setError('Too many attempts. Please try again shortly.');
        return;
      }

      if (apiError || !resData) {
        setError((apiError as any)?.error?.message || 'Invalid OTP');
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
    <div className="bg-surface/80 backdrop-blur-xl border border-border shadow-sm p-8 rounded-lg shadow-2xl relative">
      <Link href="/login" className="absolute top-8 left-8 text-foreground/60 hover:text-foreground transition-colors">
        <ArrowLeft className="w-5 h-5" />
      </Link>
      
      <div className="mb-8 text-center pt-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Sign in with OTP</h2>
        <p className="text-foreground/60">
          {step === 'request' ? 'Enter your email to receive a code' : `We sent a code to ${email}`}
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 dark:text-red-400 p-3 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      {step === 'request' ? (
        <form onSubmit={handleRequestSubmit(onRequest)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-1.5">Email</label>
            <input
              id="email"
              {...registerRequest('email')}
              type="email"
              aria-invalid={!!requestErrors.email}
              aria-describedby={requestErrors.email ? "email-error" : undefined}
              className="w-full bg-background border border-border shadow-sm rounded-lg px-4 py-2.5 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              placeholder="name@example.com"
            />
            {requestErrors.email && <p id="email-error" className="text-red-500 dark:text-red-400 text-xs mt-1.5">{requestErrors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isRequesting}
            className="w-full bg-primary hover:bg-primary/90 text-foreground font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {isRequesting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifySubmit(onVerify)} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-foreground/80 mb-1.5">6-digit Code</label>
            <input
              id="otp"
              {...registerVerify('otp')}
              type="text"
              maxLength={6}
              aria-invalid={!!verifyErrors.otp}
              aria-describedby={verifyErrors.otp ? "otp-error" : undefined}
              className="w-full bg-background border border-border shadow-sm rounded-lg px-4 py-2.5 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-center tracking-widest text-2xl transition-all"
              placeholder="000000"
            />
            {verifyErrors.otp && <p id="otp-error" className="text-red-500 dark:text-red-400 text-xs mt-1.5">{verifyErrors.otp.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full bg-primary hover:bg-primary/90 text-foreground font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Sign in'}
          </button>
          
          <button
            type="button"
            onClick={() => setStep('request')}
            className="w-full text-foreground/60 hover:text-foreground text-sm transition-colors"
          >
            Change email
          </button>
        </form>
      )}
    </div>
  );
}

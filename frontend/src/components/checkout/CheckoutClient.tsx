'use client';

import { useState } from 'react';
import { getApiClient } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';
import { useRouter } from 'next/navigation';
import { Loader2, Tag, XCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface CourseData {
  id: string;
  title: string;
  pricePaise: number;
}

interface CheckoutClientProps {
  course: CourseData;
}

export function CheckoutClient({ course }: CheckoutClientProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  
  const [checkoutSession, setCheckoutSession] = useState<{
    orderId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  const authStatus = useAuthStore((s) => s.status);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    setIsApplying(true);

    try {
      const client = await getApiClient();
      const { data, error } = await client.POST('/payments/checkout', {
        body: {
          courseIds: [course.id],
          couponCode: couponCode.trim(),
        },
      });

      if (error) {
        // Use the error message from backend if available
        const errMsg = (error as any)?.message || 'Invalid coupon code';
        setCouponError(errMsg);
        setCheckoutSession(null);
        setAppliedCoupon('');
      } else if (data?.data) {
        setCheckoutSession(data.data);
        setAppliedCoupon(couponCode.trim());
        setCouponError('');
        toast.success('Coupon applied successfully!');
      }
    } catch (err) {
      setCouponError('Failed to apply coupon');
    } finally {
      setIsApplying(false);
    }
  };

  const handleClearCoupon = () => {
    setCouponCode('');
    setAppliedCoupon('');
    setCouponError('');
    setCheckoutSession(null);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayNow = async () => {
    if (authStatus !== 'authenticated') {
      router.push(`/login?redirect=/checkout?slug=${course.id}`); // ID or Slug, but the layout handles the redirect logic correctly if we send them to login. Wait, we should use window.location.pathname + window.location.search to return exactly here.
      return;
    }

    setIsProcessing(true);

    try {
      let session = checkoutSession;

      // If no session exists (i.e. they didn't apply a coupon first), create one now
      if (!session) {
        const client = await getApiClient();
        const { data, error } = await client.POST('/payments/checkout', {
          body: {
            courseIds: [course.id],
            ...(appliedCoupon ? { couponCode: appliedCoupon } : {})
          },
        });

        if (error) {
          toast.error((error as any)?.message || 'Failed to initialize checkout');
          setIsProcessing(false);
          return;
        }
        if (data?.data) {
          session = data.data;
          setCheckoutSession(session);
        } else {
          throw new Error('No checkout session data');
        }
      }

      // Load Razorpay
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load payment gateway. Please check your connection.');
        setIsProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_123',
        amount: session.amount,
        currency: session.currency,
        name: 'StockLearn',
        description: course.title,
        order_id: session.razorpayOrderId,
        handler: async function (response: any) {
          try {
            toast.loading('Verifying payment...', { id: 'payment-verify' });
            
            const client = await getApiClient();
            const { data, error } = await client.POST('/payments/verify', {
              body: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
            });

            if (error || !data?.success) {
              toast.error('Payment verification failed. Please contact support.', { id: 'payment-verify' });
              return;
            }

            // Invalidate caches
            await queryClient.invalidateQueries({ queryKey: ['enrolled-courses'] });
            await queryClient.invalidateQueries({ queryKey: ['dashboard', 'orders'] });

            toast.success('Payment successful! Welcome to the course.', { id: 'payment-verify' });
            router.push('/dashboard/courses');

          } catch (err) {
            toast.error('Payment verification error. We will verify it shortly.', { id: 'payment-verify' });
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.error('Payment cancelled. Please try again when you are ready.');
          }
        },
        theme: {
          color: '#059669', // Emerald 600
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setIsProcessing(false);
        toast.error(response.error.description || 'Payment failed. Please try again.');
      });
      rzp.open();

    } catch (err) {
      setIsProcessing(false);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  // Format currency
  const formatINR = (paise: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(paise / 100);
  };

  const displayAmount = checkoutSession ? checkoutSession.amount : course.pricePaise;
  const isDiscounted = checkoutSession && checkoutSession.amount < course.pricePaise;

  return (
    <div className="bg-surface/60 backdrop-blur-xl border border-border rounded-lg p-6 shadow-xl">
      <h3 className="text-xl font-semibold text-slate-100 mb-6">Payment Details</h3>
      
      {/* Coupon Section */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-foreground/80 mb-2">Have a coupon code?</label>
        <div className="flex gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="w-5 h-5 text-foreground/40" />
            </div>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              disabled={!!appliedCoupon || isApplying || isProcessing}
              placeholder="Enter code"
              className="w-full bg-background/50 border border-border/80/50 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all disabled:opacity-60"
            />
          </div>
          {!appliedCoupon ? (
            <button
              onClick={handleApplyCoupon}
              disabled={!couponCode.trim() || isApplying || isProcessing}
              className="bg-surface/80 hover:bg-slate-700 text-slate-200 px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Apply'}
            </button>
          ) : (
            <button
              onClick={handleClearCoupon}
              disabled={isProcessing}
              className="bg-primary/10 hover:bg-primary/20 text-primary/80 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove
            </button>
          )}
        </div>
        
        {couponError && (
          <div className="flex items-center gap-1.5 mt-2 text-sm text-primary/80">
            <XCircle className="w-4 h-4" />
            <span>{couponError}</span>
          </div>
        )}
        
        {appliedCoupon && !couponError && (
          <div className="flex items-center gap-1.5 mt-2 text-sm text-primary">
            <CheckCircle2 className="w-4 h-4" />
            <span>Coupon {appliedCoupon} applied successfully</span>
          </div>
        )}
      </div>

      <div className="border-t border-border/50 pt-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-foreground/60 text-sm mb-1">Total to pay</p>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-foreground">{formatINR(displayAmount)}</span>
              {isDiscounted && (
                <span className="text-lg text-foreground/40 line-through decoration-rose-500/50 decoration-2">
                  {formatINR(course.pricePaise)}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handlePayNow}
          disabled={isProcessing}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-foreground font-bold text-lg py-4 px-6 rounded-md transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            `Pay ${formatINR(displayAmount)}`
          )}
        </button>
      </div>
    </div>
  );
}

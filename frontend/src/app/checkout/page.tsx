import { getApiClient } from '@/lib/api/client';
import { CheckoutClient } from '@/components/checkout/CheckoutClient';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

interface CheckoutPageProps {
  searchParams: { slug?: string };
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const slug = searchParams.slug;

  if (!slug) {
    redirect('/courses');
  }

  const client = await getApiClient();
  const { data, error } = await client.GET('/courses/{slug}', {
    params: { path: { slug } },
    next: { revalidate: 60 },
  });

  if (error || !data || !data.data) {
    notFound();
  }

  const course = data.data;

  // Format price
  const priceFormatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(course.pricePaise / 100);

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Section */}
          <div className="lg:col-span-2 space-y-6">
            <CheckoutClient course={course} />
            
            <div className="flex items-center justify-center gap-2 text-foreground/60 text-sm mt-8">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span>Payments are secure and encrypted by Razorpay</span>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-surface/60 backdrop-blur-xl border border-border rounded-lg p-6 sticky top-24 shadow-2xl shadow-emerald-900/10">
              <h2 className="text-xl font-bold text-slate-100 mb-6">Order Summary</h2>
              
              <div className="flex gap-4 mb-6">
                <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-surface/80">
                  {course.thumbnailUrl ? (
                    <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-slate-800" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200 line-clamp-2">{course.title}</h3>
                  <p className="text-xs text-foreground/40 capitalize mt-1">{course.level.toLowerCase()} • {course.format.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="border-t border-border/50 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-foreground/80">
                  <span>Subtotal</span>
                  <span>{priceFormatted}</span>
                </div>
                {/* Discount rows will be handled via CheckoutClient state, but we can just show the total here if needed.
                    Actually, it's better to let CheckoutClient manage the total since it applies coupons!
                    So we'll let CheckoutClient render the actual totals below the coupon input. */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { SiteHeader } from '@/components/layouts/SiteHeader';
import { SiteFooter } from '@/components/layouts/SiteFooter';
import { Metadata } from 'next';
import { Rocket, Target, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Investory',
  description: 'Learn about our mission to defy gravity in modern fintech.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      <main className="flex-1 w-full">
        {/* Hero */}
        <section className="relative py-24 bg-surface/50 border-b border-border text-center overflow-hidden">
          <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full w-full max-w-2xl mx-auto top-1/2 -translate-y-1/2 -z-10 pointer-events-none"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Defying limits in modern fintech.
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Investory was founded on a simple principle: access to elite market education shouldn't be restricted by gravity or legacy institutions.
            </p>
          </div>
        </section>

        {/* Mission / Vision */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-6 border border-border rounded-md bg-surface shadow-xl shadow-black/5 hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 mx-auto bg-primary/10 border border-primary/20 text-primary rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Our Mission</h3>
              <p className="text-foreground/70">To democratize financial education through immersive, real-time technology and institutional-grade curriculum.</p>
            </div>
            
            <div className="text-center p-6 border border-border rounded-md bg-surface shadow-xl shadow-black/5 hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 mx-auto bg-primary/10 border border-primary/20 text-primary rounded-full flex items-center justify-center mb-6">
                <Rocket className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Our Vision</h3>
              <p className="text-foreground/70">To build the ultimate Neo-broker educational platform, launching the next generation of precision traders.</p>
            </div>
            
            <div className="text-center p-6 border border-border rounded-md bg-surface shadow-xl shadow-black/5 hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 mx-auto bg-primary/10 border border-primary/20 text-primary rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Our Community</h3>
              <p className="text-foreground/70">A growing network of driven individuals, mentors, and industry veterans all working towards market mastery.</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

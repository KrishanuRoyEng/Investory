import Link from 'next/link';
import { SiteHeader } from '@/components/layouts/SiteHeader';
import { SiteFooter } from '@/components/layouts/SiteFooter';
import { ArrowRight, BarChart3, Presentation, PlayCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      <SiteHeader />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Abstract Antigravity Grid / Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-primary/20 blur-[140px] pointer-events-none"></div>
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter max-w-4xl mx-auto leading-[1.1]">
            UNDERSTAND THE MARKET. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70 dark:to-foreground/50">
              THINK WITH CONFIDENCE.
            </span>
          </h1>
          
          <p className="mt-8 text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
            Practical, expert-led market education designed to build knowledge, strengthen understanding and develop disciplined decision-making. <br className="hidden sm:block mt-2" /> <span className="font-medium text-foreground/80 mt-2 inline-block">Live Learning &middot; Structured Courses &middot; Practical Tools</span>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 w-full max-w-md mx-auto sm:max-w-none">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold rounded-md transition-all shadow-[0_0_40px_rgba(52,211,153,0.3)] hover:shadow-[0_0_60px_rgba(52,211,153,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/courses" 
              className="w-full sm:w-auto px-8 py-4 bg-surface border border-border hover:border-foreground/30 text-foreground text-lg font-semibold rounded-md transition-all hover:bg-surface/80 flex items-center justify-center gap-2 shadow-lg"
            >
              Explore Courses
            </Link>
          </div>
          <p className="mt-8 text-sm md:text-base text-foreground/50 max-w-xl mx-auto font-medium">
            For those who want to understand markets—not simply follow them.
          </p>
        </section>

        {/* Minimal Trust Indicators / Market Approach */}
        <section className="border-y border-border bg-surface/50 backdrop-blur-md py-16 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 uppercase tracking-wider">
                BUILT AROUND THE WAY MARKETS ACTUALLY WORK.
              </h2>
              <p className="text-foreground/60 max-w-3xl mx-auto">
                Structured learning grounded in market knowledge, practical application, disciplined thinking and continuously evolving capital-market content.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left max-w-5xl mx-auto">
              <div>
                <h4 className="font-bold text-foreground mb-2 text-sm uppercase tracking-wide">MARKET KNOWLEDGE</h4>
                <p className="text-sm text-foreground/60 leading-relaxed">Understand the concepts, instruments and frameworks that shape capital markets.</p>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2 text-sm uppercase tracking-wide">PRACTICAL LEARNING</h4>
                <p className="text-sm text-foreground/60 leading-relaxed">Apply concepts through charts, case studies, market situations and live learning.</p>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2 text-sm uppercase tracking-wide">DISCIPLINED THINKING</h4>
                <p className="text-sm text-foreground/60 leading-relaxed">Develop a structured approach to risk, uncertainty and decision-making.</p>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2 text-sm uppercase tracking-wide">CONTINUOUS LEARNING</h4>
                <p className="text-sm text-foreground/60 leading-relaxed">Stay connected with evolving markets, tools, practices and regulatory developments.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features / Floating Cards */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 uppercase">ELEVATE YOUR MARKET KNOWLEDGE</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
              Everything you need to learn, analyse, and apply market concepts through structured education, live learning, and practical tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/courses" className="bg-surface/60 backdrop-blur-md border border-border p-8 rounded-lg shadow-xl shadow-black/5 hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 block">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 text-primary rounded-md flex items-center justify-center mb-6 shadow-inner">
                <PlayCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 uppercase tracking-wide">1. STRUCTURED COURSES</h3>
              <p className="text-foreground/60 leading-relaxed">
                Live, instructor-led programs with practical assignments, assessments, class recordings and ongoing learner support.
              </p>
            </Link>
            
            <div className="bg-surface/60 backdrop-blur-md border border-border p-8 rounded-lg shadow-xl shadow-black/5 transition-all duration-300 block">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 text-primary rounded-md flex items-center justify-center mb-6 shadow-inner">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 uppercase tracking-wide">2. PRACTICE & SIMULATION</h3>
              <p className="text-foreground/60 leading-relaxed">
                Apply what you learn through chart analysis, trading simulations, portfolio exercises, journals, homework, quizzes and real-market case studies.
              </p>
            </div>
            
            <Link href="/webinars" className="bg-surface/60 backdrop-blur-md border border-border p-8 rounded-lg shadow-xl shadow-black/5 hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 block">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 text-primary rounded-md flex items-center justify-center mb-6 shadow-inner">
                <Presentation className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 uppercase tracking-wide">3. LIVE MARKET SESSIONS</h3>
              <p className="text-foreground/60 leading-relaxed">
                Join live webinars and discussions covering market outlook, technical and fundamental analysis, macroeconomics, psychology and current market developments.
              </p>
            </Link>
          </div>
        </section>
      </main>
      
      <SiteFooter />
    </div>
  );
}

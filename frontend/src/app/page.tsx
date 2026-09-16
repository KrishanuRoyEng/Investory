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
            Defy gravity. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70 dark:to-foreground/50">
              Trade with precision.
            </span>
          </h1>
          
          <p className="mt-8 text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto">
            Experience the future of market education. High-performance tools, live institutional-grade webinars, and dynamic course curriculums.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 w-full max-w-md mx-auto sm:max-w-none">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold rounded-md transition-all shadow-[0_0_40px_rgba(52,211,153,0.3)] hover:shadow-[0_0_60px_rgba(52,211,153,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Start Investing <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/courses" 
              className="w-full sm:w-auto px-8 py-4 bg-surface border border-border hover:border-foreground/30 text-foreground text-lg font-semibold rounded-md transition-all hover:bg-surface/80 flex items-center justify-center gap-2 shadow-lg"
            >
              Explore Catalogue
            </Link>
          </div>
        </section>

        {/* Minimal Trust Indicators */}
        <section className="border-y border-border bg-surface/50 backdrop-blur-md py-10 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-medium text-foreground/40 mb-6 uppercase tracking-widest">
              Trusted by modern traders & institutions
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-xl font-bold font-mono tracking-tight">NASDAQ</span>
              <span className="text-xl font-bold font-mono tracking-tight">NYSE</span>
              <span className="text-xl font-bold font-mono tracking-tight">BLOOMBERG</span>
              <span className="text-xl font-bold font-mono tracking-tight">REUTERS</span>
            </div>
          </div>
        </section>
        
        {/* Features / Floating Cards */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Elevate your strategy</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
              Everything you need to analyze, execute, and scale your portfolio, packed into an impossibly fast platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/courses" className="bg-surface/60 backdrop-blur-md border border-border p-8 rounded-lg shadow-xl shadow-black/5 hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 block">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 text-primary rounded-md flex items-center justify-center mb-6 shadow-inner">
                <PlayCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Masterclass Video</h3>
              <p className="text-foreground/60 leading-relaxed">
                Step-by-step video curriculum from industry veterans. Tracked progress, high-res streaming, and certifiable completion.
              </p>
            </Link>
            
            <Link href="/live" className="bg-surface/60 backdrop-blur-md border border-border p-8 rounded-lg shadow-xl shadow-black/5 hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 block">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 text-primary rounded-md flex items-center justify-center mb-6 shadow-inner">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Live Trading Floors</h3>
              <p className="text-foreground/60 leading-relaxed">
                Interact with instructors in real-time, ask doubts, and analyze live charts. Experience the adrenaline of live markets.
              </p>
            </Link>
            
            <Link href="/webinars" className="bg-surface/60 backdrop-blur-md border border-border p-8 rounded-lg shadow-xl shadow-black/5 hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 block">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 text-primary rounded-md flex items-center justify-center mb-6 shadow-inner">
                <Presentation className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Institutional Webinars</h3>
              <p className="text-foreground/60 leading-relaxed">
                Join thousands of traders in large-scale market breakdowns. Macro-economic analysis delivered straight to your screen.
              </p>
            </Link>
          </div>
        </section>
      </main>
      
      <SiteFooter />
    </div>
  );
}

import Link from 'next/link';
import { Twitter, Linkedin, Github } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border bg-background py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-extrabold tracking-tight text-foreground">
                Invest<span className="text-primary">ory</span>
              </span>
            </Link>
            <p className="text-foreground/60 text-sm max-w-sm mb-6">
              Defying limits in modern fintech. We build tools and education platforms for the next generation of traders.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-foreground/40 hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-foreground/40 hover:text-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-foreground/40 hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-foreground/60 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/courses" className="text-foreground/60 hover:text-primary transition-colors">Courses</Link></li>
              <li><Link href="/webinars" className="text-foreground/60 hover:text-primary transition-colors">Webinars</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="text-foreground/60 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-foreground/60 hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-foreground/40">
          <p>© {new Date().getFullYear()} Investory Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

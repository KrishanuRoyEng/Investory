import { SiteHeader } from '@/components/layouts/SiteHeader';
import { SiteFooter } from '@/components/layouts/SiteFooter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Investory',
  description: 'Terms of service for Investory.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8 w-full">
        <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Terms of Service</h1>
        <div className="prose prose-invert prose-slate max-w-none space-y-6 text-foreground/80">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using the Investory platform, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Provision of Services</h2>
            <p>Investory is constantly innovating in order to provide the best possible experience for its users. You acknowledge and agree that the form and nature of the Services which Investory provides may change from time to time without prior notice to you.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. User Conduct</h2>
            <p>You agree to use the Services only for purposes that are permitted by (a) the Terms and (b) any applicable law, regulation or generally accepted practices or guidelines in the relevant jurisdictions. You agree not to access (or attempt to access) any of the Services by any means other than through the interface that is provided by Investory.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Proprietary Rights</h2>
            <p>You acknowledge and agree that Investory (or Investory's licensors) own all legal right, title and interest in and to the Services, including any intellectual property rights which subsist in the Services.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

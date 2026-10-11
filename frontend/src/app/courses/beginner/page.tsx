import type { Metadata } from 'next';
import { LandingNav } from '@/components/layouts/LandingNav';
import { LandingFooter } from '@/components/layouts/LandingFooter';
import { BeginnerCourseView } from '@/components/courses/BeginnerCourseView';
import '@/app/landing.css';

export const metadata: Metadata = {
  title: 'Master Trader Programme (Beginner) | INVESONE',
  description:
    'A structured, mentor-led learning experience that builds your understanding of technical and fundamental analysis—with a focus on analytical thinking, risk awareness, and disciplined decision-making.',
};

export default function BeginnerCoursePage() {
  return (
    <div data-theme="landing" className="min-h-screen flex flex-col font-sans">
      <LandingNav />
      <main className="flex-1">
        <BeginnerCourseView />
      </main>
      <LandingFooter />
    </div>
  );
}

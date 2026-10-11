import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getApiClient } from '@/lib/api/client';
import { CourseActionCard } from '@/components/courses/CourseActionCard';
import { CurriculumAccordion } from '@/components/courses/CurriculumAccordion';
import { LandingNav } from '@/components/layouts/LandingNav';
import { LandingFooter } from '@/components/layouts/LandingFooter';
import { BeginnerCourseView } from '@/components/courses/BeginnerCourseView';
import '@/app/landing.css';
import { BookOpen, BarChart, Globe } from 'lucide-react';
import { Metadata } from 'next';

interface CourseDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CourseDetailPageProps): Promise<Metadata> {
  const client = await getApiClient();
  const { data } = await client.GET('/courses/{slug}', {
    params: { path: { slug: params.slug } }
  });
  
  if (!data?.data) return { title: 'Course Not Found' };
  
  return {
    title: `${data.data.title} | INVESONE`,
    description: data.data.description,
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  if (params.slug === 'master-trader-programme') {
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

  const client = await getApiClient();
  const { data, error } = await client.GET('/courses/{slug}', {
    params: { path: { slug: params.slug } }
  });

  if (error || !data?.data) {
    notFound();
  }

  const course = data.data;

  // Render gradient background if no thumbnail
  const gradientPresets = [
    'from-emerald-900 to-teal-950',
    'from-blue-900 to-indigo-950',
    'from-purple-900 to-fuchsia-950',
    'from-rose-900 to-pink-950',
  ];
  const charCode = course.title.charCodeAt(0) || 0;
  const gradientClass = gradientPresets[charCode % gradientPresets.length];

  const posterImage =
    course.slug === 'mastery-derivatives-risk-management'
      ? '/brand/mastery-derivatives.jpg'
      : course.slug === 'master-trader-programme'
      ? '/brand/master-trader-programme.jpg'
      : course.thumbnailUrl;

  return (
    <div data-theme="landing" className="min-h-screen bg-[#f8fafc] text-gray-900 flex flex-col font-sans">
      <LandingNav />
      {/* Hero Section */}
      <div className="relative bg-[var(--lp-navy-deepest)] text-white border-b border-white/10">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-30 -z-10`} />
        {course.thumbnailUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 -z-10 mix-blend-overlay"
            style={{ backgroundImage: `url(${course.thumbnailUrl})` }}
          />
        )}
        <div className="absolute inset-0 bg-[var(--lp-navy-deepest)]/80 -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-10 items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-[rgba(212,148,30,0.15)] text-[var(--lp-gold-bright)] border border-[rgba(212,148,30,0.3)]">
                  {course.format.replace('_', ' ')}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-white/90">
                  <BarChart className="w-3.5 h-3.5" />
                  {course.level}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-white/90">
                  <Globe className="w-3.5 h-3.5" />
                  {course.language}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                {course.title}
              </h1>
              
              <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
                {course.description}
              </p>
            </div>

            {/* Course Poster Graphic */}
            {posterImage && (
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[380px] aspect-square rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 group bg-slate-900/60">
                  <Image
                    src={posterImage}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* About Section */}
            <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[var(--brand-blue)]" />
                About this course
              </h2>
              <div className="prose text-gray-700 max-w-none text-sm leading-relaxed">
                <p className="whitespace-pre-wrap">
                  {course.description}
                </p>
              </div>
            </section>

            {/* Curriculum Section */}
            <section id="curriculum" className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-6">
                Curriculum Overview
              </h2>
              <CurriculumAccordion modules={course.modules || []} />
            </section>
          </div>

          {/* Floating Action Card (Desktop) */}
          <div className="hidden lg:block relative">
            <CourseActionCard courseId={course.id!} courseSlug={course.slug!} pricePaise={course.pricePaise!} />
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

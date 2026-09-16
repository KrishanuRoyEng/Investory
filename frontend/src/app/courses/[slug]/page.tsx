import { notFound } from 'next/navigation';
import { getApiClient } from '@/lib/api/client';
import { CourseActionCard } from '@/components/courses/CourseActionCard';
import { CurriculumAccordion } from '@/components/courses/CurriculumAccordion';
import { SiteHeader } from '@/components/layouts/SiteHeader';
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
    title: `${data.data.title} | StockLearn`,
    description: data.data.description,
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
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

  return (
    <div className="min-h-screen bg-background text-slate-200 selection:bg-emerald-500/30">
      <SiteHeader />
      {/* Hero Section */}
      <div className="relative border-b border-border">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-30 -z-10`} />
        {course.thumbnailUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 -z-10 mix-blend-overlay"
            style={{ backgroundImage: `url(${course.thumbnailUrl})` }}
          />
        )}
        <div className="absolute inset-0 bg-background/80 -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-primary/10 text-primary border border-emerald-500/20">
                {course.format.replace('_', ' ')}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full bg-surface/80 text-foreground/80">
                <BarChart className="w-4 h-4" />
                {course.level}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full bg-surface/80 text-foreground/80">
                <Globe className="w-4 h-4" />
                {course.language}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {course.title}
            </h1>
            
            <p className="text-xl text-foreground/80 leading-relaxed max-w-2xl">
              {course.description}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                About this course
              </h2>
              <div className="prose prose-invert prose-slate max-w-none">
                <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">
                  {course.description}
                </p>
              </div>
            </section>

            {/* Curriculum Section */}
            <section id="curriculum">
              <h2 className="text-2xl font-bold text-foreground mb-6">
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
    </div>
  );
}

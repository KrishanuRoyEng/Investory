import { Metadata } from 'next';
import Link from 'next/link';
import { getApiClient } from '@/lib/api/client';
import { LandingNav } from '@/components/layouts/LandingNav';
import { LandingFooter } from '@/components/layouts/LandingFooter';
import { MentorshipBanner } from '@/components/landing/MentorshipBanner';
import { ScholarshipBanner } from '@/components/landing/ScholarshipBanner';
import { CourseCard } from '@/components/landing/CourseCard';
import { CourseFiltersSidebar } from './CourseFiltersSidebar';

export const metadata: Metadata = {
  title: 'Course Catalogue | StockLearn',
  description: 'Browse our complete catalog of stock market courses.',
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const pageSize = typeof searchParams.pageSize === 'string' ? parseInt(searchParams.pageSize, 10) : 50;
  const format = typeof searchParams.format === 'string' ? searchParams.format : undefined;
  const level = typeof searchParams.level === 'string' ? searchParams.level : undefined;
  const language = typeof searchParams.language === 'string' ? searchParams.language : undefined;
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;

  const client = await getApiClient();

  const [coursesRes, categoriesRes] = await Promise.all([
    client.GET('/courses', {
      params: {
        query: {
          page,
          pageSize,
          format: format as any,
          level: level as any,
          language,
          q,
          category,
        },
      },
      cache: 'no-store',
    }),
    client.GET('/courses/categories', {
      cache: 'no-store',
    })
  ]);

  if (coursesRes.error || categoriesRes.error) {
    return (
      <div data-theme="landing" className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-gray-900">
        <div className="text-center bg-red-50 border border-red-200 p-8 rounded-2xl max-w-lg w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading courses</h2>
          <p className="text-gray-600">We could not load the course catalogue at this time. Please try again later.</p>
        </div>
      </div>
    );
  }

  const courses = coursesRes.data?.data || [];
  const categories = categoriesRes.data?.data || [];

  // Group courses by category
  const groupedCourses: Record<string, typeof courses> = {};
  for (const course of courses) {
    const catName = course.category?.name || 'Other';
    if (!groupedCourses[catName]) {
      groupedCourses[catName] = [];
    }
    groupedCourses[catName].push(course);
  }

  // Sort groups by category sortOrder
  const sortedCategories = categories
    .filter(c => groupedCourses[c.name])
    .sort((a, b) => a.sortOrder - b.sortOrder);
  
  // If a course has no matched category in `categories`, it's pushed to 'Other'.
  if (groupedCourses['Other'] && !sortedCategories.find(c => c.name === 'Other')) {
    sortedCategories.push({ name: 'Other', slug: 'other', sortOrder: 999, publishedCount: groupedCourses['Other'].length });
  }

  return (
    <div data-theme="landing" className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
      <LandingNav />
      
      <main className="flex-1">
        {/* Header Area */}
        <div className="bg-[var(--lp-navy-deepest)] text-white pt-24 pb-12 px-4 lg:px-8">
          <div className="max-w-[1400px] mx-auto">
            {/* Breadcrumb */}
            <div className="text-xs font-semibold text-[var(--lp-white-50)] mb-4 flex items-center gap-2">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[var(--lp-gold-bright)]">Courses</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              Course Catalogue
            </h1>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Sidebar */}
            <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24">
              <CourseFiltersSidebar categories={categories} />
            </div>

            {/* Grid */}
            <div className="flex-1 min-w-0">
              {courses.length > 0 ? (
                <div className="space-y-12">
                  {sortedCategories.map(cat => {
                    const group = groupedCourses[cat.name];
                    if (!group || group.length === 0) return null;
                    return (
                      <div key={cat.slug}>
                        <h2 className="text-2xl font-extrabold text-[var(--lp-navy-deepest)] mb-6 border-b border-gray-200 pb-2">
                          {cat.name}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {group.map((course) => (
                            <CourseCard key={course.id} course={course} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-extrabold text-[var(--lp-navy-deepest)] mb-2">No courses found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search query to find what you&apos;re looking for.</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Banners */}
        <div className="mb-20">
          <MentorshipBanner />
        </div>
        <div className="mb-20">
          <ScholarshipBanner />
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
